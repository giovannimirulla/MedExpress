package com.medexpress.controller;

import org.springframework.http.ResponseEntity;
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

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("/api/v1/order")
public class OrderController {

    private final OrderService orderService;

    private final ModelMapper modelMapper;

    private final AIFAService aifaService;

    private final SocketIOServer socketServer;

    private final PharmacyService pharmacyService;

    public OrderController(OrderService orderService, ModelMapper modelMapper, AIFAService aifaService,
            SocketIOServer socketServer, PharmacyService pharmacyService) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.aifaService = aifaService;
        this.socketServer = socketServer;
        this.pharmacyService = pharmacyService;
    }

    @PostMapping()
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderRequest body) {

        CommonDrug drugPackage = aifaService.getPackage(body.getDrugId(), body.getPackageId()).block();

        if (drugPackage == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // if RR or SOP Order.StatusDoctor.NO_APPROVAL_NEEDED
        Order.StatusDoctor statusDoctor = Order.StatusDoctor.NO_APPROVAL_NEEDED;
        Order.StatusPharmacy statusPharmacy = Order.StatusPharmacy.PENDING;
        // convert drugPackage.getConfezioni().get(0).getClasseFornitura() to
        // DrugPackageClasseFornitura
        DrugPackageClasseFornitura drugPackageClasseFornitura = DrugPackageClasseFornitura
                .valueOf(drugPackage.getConfezioni().get(0).getClasseFornitura());
        // if otc
        if (drugPackageClasseFornitura == DrugPackageClasseFornitura.OTC) {
            statusDoctor = Order.StatusDoctor.PENDING;
        }

        // create order
        Order order = orderService.createOrder(body.getPackageId(), body.getUserId(), body.getDrugId(), statusDoctor,
                Order.Priority.NORMAL);

        switch (drugPackageClasseFornitura) {
            case RR: // ricetta ripetibile
                // get user's doctor and send order to doctor if available
                if (order.getUser() != null) {
                    var doctor = order.getUser().getDoctor();
                    if (doctor != null) {
                        OrderSocket orderSocket = new OrderSocket(order.getId().toString(),
                                "statusDoctor", statusDoctor.name());
                        socketServer.getBroadcastOperations().sendEvent(doctor.getId().toString(), orderSocket);
                    }
                }
                break;

            case OTC: // over the counter (da banco)
                // find all pharmacies
                Iterable<Pharmacy> pharmacies = pharmacyService.findAll();
                // send order to all pharmacies
                for (Pharmacy pharmacy : pharmacies) {
                    OrderSocket orderSocket = new OrderSocket(order.getId().toString(),
                            "statusPharmacy", statusPharmacy.name());
                    socketServer.getBroadcastOperations().sendEvent(pharmacy.getId().toString(), orderSocket);
                }
                break;

            case SOP: // senza obbligo di prescrizione, ma non da banco
                break;
        }

        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);

    }

    // get all order by user id arranged by date and status
    @GetMapping("/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable String userId) {
        List<Order> orders = orderService.getOrders(userId);
        return new ResponseEntity<>(orders.stream().map(order -> modelMapper.map(order, OrderDTO.class)).toList(),
                HttpStatus.OK);
    }
}
