package com.medexpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.medexpress.service.AIFAService;
import com.medexpress.service.OrderService;
import com.medexpress.dto.CommonDrug;
import com.medexpress.dto.OrderDTO;
import com.medexpress.dto.OrderRequest;
import com.medexpress.dto.OrderSocket;
import com.medexpress.entity.Order;

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
        Order order = orderService.createOrder(body.getPackageId(), body.getUserId(), body.getDrugId(), statusDoctor,
                priority);

        if (order == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (statusDoctor == Order.StatusDoctor.PENDING) {
            // get user's doctor and send order to doctor if available
            if (order.getUser() != null) {
                var doctor = order.getUser().getDoctor();
                if (doctor != null) {
                    OrderSocket orderSocket = new OrderSocket(order.getId().toString(),
                            "statusDoctor", statusDoctor.name(), order.getUpdatedAt());
                    socketServer.getBroadcastOperations().sendEvent(doctor.getId().toString(), orderSocket);
                }
            }
        }

        if (statusDoctor == Order.StatusDoctor.NO_APPROVAL_NEEDED && statusPharmacy == Order.StatusPharmacy.PENDING) {
            // find all pharmacies
            Iterable<Pharmacy> pharmacies = pharmacyService.findAll();
            // send order to all pharmacies
            for (Pharmacy pharmacy : pharmacies) {
                OrderSocket orderSocket = new OrderSocket(order.getId().toString(),
                        "statusPharmacy", statusPharmacy.name(), order.getUpdatedAt());
                socketServer.getBroadcastOperations().sendEvent(pharmacy.getId().toString(), orderSocket);
            }
        }

        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);

    }

    // get all order by user id arranged by date and status - url:
    // http://localhost:8080/api/v1/order/all
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
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
                    return new ResponseEntity<>(orders, HttpStatus.OK);
                }
                // else if user is a patient, get all orders of the patient
                else if (userDetails.getRole() == User.Role.PATIENT) {
                    List<Order> orders = orderService.getOrdersByUser(userDetails.getId());
                    // add drugPackage
                    for (Order order : orders) {
                        order.setDrugPackage(aifaService.getPackage(order.getDrugId(), order.getPackageId()).block());
                    }
                    return new ResponseEntity<>(orders, HttpStatus.OK);
                }

                // else if driver, get all orders of the driver or statusPharmacy is
                // DELIVERED_TO_DRIVER
                else if (userDetails.getRole() == User.Role.DRIVER) {
                    List<Order> orders = orderService.getOrdersByDriver(userDetails.getId());
                    // add drugPackage
                    for (Order order : orders) {
                        order.setDrugPackage(aifaService.getPackage(order.getDrugId(), order.getPackageId()).block());
                    }
                    return new ResponseEntity<>(orders, HttpStatus.OK);
                }

            } else if (userDetails.getEntityType() == AuthEntityType.PHARMACY) {
                List<Order> orders = orderService.getOrdersByPharmacy(userDetails.getId());
                // add drugPackage
                for (Order order : orders) {
                    order.setDrugPackage(aifaService.getPackage(order.getDrugId(), order.getPackageId()).block());
                }
                return new ResponseEntity<>(orders, HttpStatus.OK);
            }

        }

        // Added default return to satisfy the return type
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
