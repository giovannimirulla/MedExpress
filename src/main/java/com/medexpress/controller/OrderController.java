package com.medexpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.medexpress.service.AIFAService;
import com.medexpress.service.OrderService;
import com.medexpress.dto.CommonDrug;
import com.medexpress.dto.EntityDTO;
import com.medexpress.dto.OrderDTO;
import com.medexpress.dto.OrderRequest;
import com.medexpress.dto.OrderSocket;
import com.medexpress.entity.Order;
import com.medexpress.entity.Order.StatusDriver;
import com.medexpress.entity.Order.StatusPharmacy;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import com.corundumstudio.socketio.SocketIOServer;
import com.medexpress.service.PharmacyService;
import com.medexpress.entity.Pharmacy;
import com.medexpress.enums.DrugPackageClasseFornitura;
import com.medexpress.security.CustomUserDetails;

import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

import org.springframework.security.core.Authentication;
import com.medexpress.enums.AuthEntityType;

import com.medexpress.service.UserService;
import com.medexpress.entity.User;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/v1/order")
public class OrderController {

    private final OrderService orderService;

    private final ModelMapper modelMapper;

    private final AIFAService aifaService;

    private final SocketIOServer socketServer;

    private final PharmacyService pharmacyService;

    private final UserService userService;

    public OrderController(OrderService orderService, ModelMapper modelMapper, AIFAService aifaService,
            SocketIOServer socketServer, PharmacyService pharmacyService, UserService userService) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.aifaService = aifaService;
        this.socketServer = socketServer;
        this.pharmacyService = pharmacyService;
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderRequest body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            if (userDetails.getEntityType() == AuthEntityType.PHARMACY) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            //get name and surname of the user
            User user = userService.getUser(userDetails.getId());
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            String nameAndSurname = user.getName() + " " + user.getSurname();
            EntityDTO entity = new EntityDTO(userDetails.getId(), userDetails.getEntityType(), nameAndSurname, user.getEmail()); 


            CommonDrug drugPackage = aifaService.getPackage(body.getDrugId(), body.getPackageId()).block();

            if (drugPackage == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // convert drugPackage.getConfezioni().get(0).getClasseFornitura() to
            // DrugPackageClasseFornitura
            DrugPackageClasseFornitura drugPackageClasseFornitura = DrugPackageClasseFornitura
                    .valueOf(drugPackage.getConfezioni().get(0).getClasseFornitura());

            Order.StatusDoctor statusDoctor = Order.getStatusDoctor(drugPackageClasseFornitura);
            Order.StatusPharmacy statusPharmacy = Order.StatusPharmacy.PENDING;
            Order.Priority priority = Order.getPriority(drugPackageClasseFornitura);

            // create order
            Order order = orderService.createOrder(body.getPackageId(), userDetails.getId(), body.getDrugId(),
                    statusDoctor,
                    priority);

            if (order == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            if (statusDoctor == Order.StatusDoctor.PENDING) {
                // get user's doctor and send order to doctor if available
                if (order.getUser() != null) {
                    User doctor = userService.getDoctor(order.getUser().getId().toString());
                    if (doctor != null) {
                        OrderSocket orderSocket = new OrderSocket(order.getId().toString(), drugPackage,
                                "statusDoctor", statusDoctor.name(), order.getUpdatedAt().toString(), priority, entity);
                        socketServer.getBroadcastOperations().sendEvent(doctor.getId().toString(), orderSocket);
                    }
                }
            }

            if (statusDoctor == Order.StatusDoctor.NO_APPROVAL_NEEDED
                    && statusPharmacy == Order.StatusPharmacy.PENDING) {
                // find all pharmacies
                Iterable<Pharmacy> pharmacies = pharmacyService.findAll();
                // send order to all pharmacies
                for (Pharmacy pharmacy : pharmacies) {
                    OrderSocket orderSocket = new OrderSocket(order.getId().toString(), drugPackage,
                            "statusPharmacy", statusPharmacy.name(), order.getUpdatedAt().toString(), priority, entity);
                    socketServer.getBroadcastOperations().sendEvent(pharmacy.getId().toString(), orderSocket);
                }
            }

            OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
            return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    // get all order by user id arranged by date and status - url:
    // http://localhost:8080/api/v1/order/all
    @GetMapping("/all")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // get entityType, if entityType is User check role else return all order where
            // pharmacy is the pharmacy
            if (userDetails.getEntityType() == AuthEntityType.USER) {
                // if user is a doctor, get all orders of his patients
                if (userDetails.getRole() == User.Role.DOCTOR) {
                    List<User> patients = userService.getPatients(userDetails.getId());
                    List<Order> orders = new ArrayList<>();
                    for (User patient : patients) {
                        // get all orders of the patient where statusDoctor is not NO_APPROVAL_NEEDED
                        List<Order> patientOrders = orderService.getOrdersByUser(patient.getId().toString());
                        for (Order order : patientOrders) {
                            if (order.getStatusDoctor() != Order.StatusDoctor.NO_APPROVAL_NEEDED) {
                                // add drugPackage
                                order.setDrugPackage(
                                        aifaService.getPackage(order.getDrugId(), order.getPackageId()).block());
                                orders.add(order);
                            }
                        }
                    }
                    
                    List<OrderDTO> orderDTOs = new ArrayList<>();
                    for (Order order : orders) {
                        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
                        orderDTO.setDoctor(new EntityDTO(order.getUser().getDoctor().getId().toString(), AuthEntityType.USER, order.getUser().getDoctor().getName() + " " + order.getUser().getDoctor().getSurname(), order.getUser().getDoctor().getEmail()));
                        orderDTO.setUser(new EntityDTO(order.getUser().getId().toString(), AuthEntityType.USER, order.getUser().getName() + " " + order.getUser().getSurname(), order.getUser().getEmail()));
                        if (order.getPharmacy() != null) {
                            orderDTO.setPharmacy(new EntityDTO(order.getPharmacy().getId().toString(), AuthEntityType.PHARMACY, order.getPharmacy().getCompanyName(), order.getPharmacy().getEmail()));
                        }
                        if (order.getDriver() != null) {
                            orderDTO.setDriver(new EntityDTO(order.getDriver().getId().toString(), AuthEntityType.USER, order.getDriver().getName() + " " + order.getDriver().getSurname(), order.getDriver().getEmail()));
                        }
                        orderDTOs.add(orderDTO);
                    }
                    return new ResponseEntity<>(orderDTOs, HttpStatus.OK);
                    
                }
                // else if user is a patient, get all orders of the patient
                else if (userDetails.getRole() == User.Role.PATIENT) {
                    List<Order> orders = orderService.getOrdersByUser(userDetails.getId());
                    // add drugPackage
                    for (Order order : orders) {
                        order.setDrugPackage(aifaService.getPackage(order.getDrugId(), order.getPackageId()).block());
                    }
                    List<OrderDTO> orderDTOs = new ArrayList<>();
                    for (Order order : orders) {
                        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
                        orderDTO.setDoctor(new EntityDTO(order.getUser().getDoctor().getId().toString(), AuthEntityType.USER, order.getUser().getDoctor().getName() + " " + order.getUser().getDoctor().getSurname(), order.getUser().getDoctor().getEmail()));
                        orderDTO.setUser(new EntityDTO(order.getUser().getId().toString(), AuthEntityType.USER, order.getUser().getName() + " " + order.getUser().getSurname(), order.getUser().getEmail()));
                        if (order.getPharmacy() != null) {
                            orderDTO.setPharmacy(new EntityDTO(order.getPharmacy().getId().toString(), AuthEntityType.PHARMACY, order.getPharmacy().getCompanyName(), order.getPharmacy().getEmail()));
                        }
                        if (order.getDriver() != null) {
                            orderDTO.setDriver(new EntityDTO(order.getDriver().getId().toString(), AuthEntityType.USER, order.getDriver().getName() + " " + order.getDriver().getSurname(), order.getDriver().getEmail()));
                        }
                        orderDTOs.add(orderDTO);
                    }
                    return new ResponseEntity<>(orderDTOs, HttpStatus.OK);
                }

                // else if driver, get all orders of the driver or statusPharmacy is
                // DELIVERED_TO_DRIVER
                else if (userDetails.getRole() == User.Role.DRIVER) {
                    List<Order> orders = orderService.getOrdersByDriver(userDetails.getId());
                    // add drugPackage
                    for (Order order : orders) {
                        order.setDrugPackage(aifaService.getPackage(order.getDrugId(), order.getPackageId()).block());
                    }
                    List<OrderDTO> orderDTOs = new ArrayList<>();
                    for (Order order : orders) {
                        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
                        orderDTO.setDoctor(new EntityDTO(order.getUser().getDoctor().getId().toString(), AuthEntityType.USER, order.getUser().getDoctor().getName() + " " + order.getUser().getDoctor().getSurname(), order.getUser().getDoctor().getEmail()));
                        orderDTO.setUser(new EntityDTO(order.getUser().getId().toString(), AuthEntityType.USER, order.getUser().getName() + " " + order.getUser().getSurname(), order.getUser().getEmail()));
                        if (order.getPharmacy() != null) {
                            orderDTO.setPharmacy(new EntityDTO(order.getPharmacy().getId().toString(), AuthEntityType.PHARMACY, order.getPharmacy().getCompanyName(), order.getPharmacy().getEmail()));
                        }
                        if (order.getDriver() != null) {
                            orderDTO.setDriver(new EntityDTO(order.getDriver().getId().toString(), AuthEntityType.USER, order.getDriver().getName() + " " + order.getDriver().getSurname(), order.getDriver().getEmail()));
                        }
                        orderDTOs.add(orderDTO);
                    }
                    return new ResponseEntity<>(orderDTOs, HttpStatus.OK);
                }

            } else if (userDetails.getEntityType() == AuthEntityType.PHARMACY) {
                List<Order> orders = orderService.getOrdersByPharmacy(userDetails.getId());
                // add drugPackage
                for (Order order : orders) {
                    order.setDrugPackage(aifaService.getPackage(order.getDrugId(), order.getPackageId()).block());
                }
                List<OrderDTO> orderDTOs = new ArrayList<>();
                for (Order order : orders) {
                    OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
                    orderDTO.setDoctor(new EntityDTO(order.getUser().getDoctor().getId().toString(), AuthEntityType.USER, order.getUser().getDoctor().getName() + " " + order.getUser().getDoctor().getSurname(), order.getUser().getDoctor().getEmail()));
                    orderDTO.setUser(new EntityDTO(order.getUser().getId().toString(), AuthEntityType.USER, order.getUser().getName() + " " + order.getUser().getSurname(), order.getUser().getEmail()));
                    if (order.getPharmacy() != null) {
                        orderDTO.setPharmacy(new EntityDTO(order.getPharmacy().getId().toString(), AuthEntityType.PHARMACY, order.getPharmacy().getCompanyName(), order.getPharmacy().getEmail()));
                    }
                    if (order.getDriver() != null) {
                        orderDTO.setDriver(new EntityDTO(order.getDriver().getId().toString(), AuthEntityType.USER, order.getDriver().getName() + " " + order.getDriver().getSurname(), order.getDriver().getEmail()));
                    }
                    orderDTOs.add(orderDTO);
                }
                return new ResponseEntity<>(orderDTOs, HttpStatus.OK);
            }

        }

        // Added default return to satisfy the return type
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }



    // private User user; // This is the user who made the order
    // private User driver;
    // private Pharmacy pharmacy; // This is the pharmacy that will prepare the order

    // private StatusPharmacy statusPharmacy;
    // private StatusDriver statusDriver;
    // private StatusDoctor statusDoctor;


    //get order only if or user is the patient that made the order or user is the doctor of the patient that made the order, or pharmacy is the pharmacy that received the order, or pharmacy not setted and statusPharmacy is PENDING, or driver is the driver that received the order, or driver not setted and statusDriver is PENDING
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable String orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            if (userDetails.getEntityType() == AuthEntityType.USER) {
                // if user is a doctor, get all orders of his patients
                if (userDetails.getRole() == User.Role.DOCTOR) {
                    List<User> patients = userService.getPatients(userDetails.getId());
                    for (User patient : patients) {
                        if (order.getUser().getId().equals(patient.getId())) {
                            return new ResponseEntity<>(order, HttpStatus.OK);
                        }
                    }
                }
                // else if user is a patient, get all orders of the patient
                else if (userDetails.getRole() == User.Role.PATIENT) {
                    if (order.getUser().getId().equals(userDetails.getId())) {
                        return new ResponseEntity<>(order, HttpStatus.OK);
                    }
                }

                else if (userDetails.getRole() == User.Role.DRIVER) {
                    if (order.getDriver().getId().equals(userDetails.getId())) {
                        return new ResponseEntity<>(order, HttpStatus.OK);
                    }
                    if (order.getDriver() == null && order.getStatusDriver() == StatusDriver.PENDING) {
                        return new ResponseEntity<>(order, HttpStatus.OK);
                    }
                }

            } else if (userDetails.getEntityType() == AuthEntityType.PHARMACY) {
                if (order.getPharmacy().getId().equals(userDetails.getId())) {
                    return new ResponseEntity<>(order, HttpStatus.OK);
                }
                if (order.getPharmacy() == null && order.getStatusPharmacy() == StatusPharmacy.PENDING) {
                    return new ResponseEntity<>(order, HttpStatus.OK);
                }
            } 
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

}


