package com.medexpress.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.medexpress.service.AIFAService;
import com.medexpress.service.OrderService;
import com.medexpress.dto.CommonPackage;
import com.medexpress.dto.OrderDTO;
import com.medexpress.dto.OrderSocket;
import com.medexpress.entity.Order;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.corundumstudio.socketio.SocketIOServer;
import com.medexpress.service.PharmacyService;
import com.medexpress.entity.Pharmacy;

@RestController
@RequestMapping("/api/v1/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AIFAService aifaService;

    @Autowired
    private SocketIOServer socketServer;

    @Autowired
    private PharmacyService pharmacyService;

    public OrderController(OrderService orderService, ModelMapper modelMapper, AIFAService aifaService,
            SocketIOServer socketServer, PharmacyService pharmacyService) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
        this.aifaService = aifaService;
        this.socketServer = socketServer;
        this.pharmacyService = pharmacyService;
    }

    @PostMapping()
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO body) {
        // create order
        Order order = orderService.createOrder(body.getPackageId(), body.getUserId(), body.getDrugId());

        CommonPackage commonPackage = aifaService.getPackage(body.getDrugId(), body.getPackageId()).block();

        // make object with commonPackage and body userId
        OrderSocket orderSocket = new OrderSocket(order.getId().toString(), body.getUserId(), body.getDrugId(), commonPackage);


        // check if package classe fornitura is like RR

        switch (commonPackage.getClasseFornitura()) {
            case "RR": // ricetta ripetibile

                // get user's doctor and send order to doctor
                socketServer.getBroadcastOperations().sendEvent(order.getUser().getDoctor().getId().toString(),
                        orderSocket);
                break;

            case "OTC": // over the counter (da banco)

                // find all pharmacies
                Iterable<Pharmacy> pharmacies = pharmacyService.findAll();
                // send order to all pharmacies
                for (Pharmacy pharmacy : pharmacies) {
                    socketServer.getBroadcastOperations().sendEvent(pharmacy.getId().toString(), orderSocket);
                }
                break;

            case "SOP": // senza obbligo di prescrizione, ma non da banco
                ;
                break;
        }

        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);

    }

}
