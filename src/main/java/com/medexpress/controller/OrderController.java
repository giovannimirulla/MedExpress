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
import com.medexpress.entity.Order;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.http.HttpStatus;




@RestController 
@RequestMapping("/api/v1/order")
public class OrderController {
   
    @Autowired
    private OrderService orderService;

    @Autowired  
    private ModelMapper modelMapper; 

    @Autowired
    private AIFAService aifaService; 


    public OrderController(OrderService orderService, ModelMapper modelMapper) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
    }

    @PostMapping()
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO body) {
        //create order
        Order order = orderService.createOrder(body.getPackageId(), body.getUserId(), body.getDrugId());

        CommonPackage commonPackage = aifaService.getPackage(body.getDrugId(), body.getPackageId()).block();
        
        //check if package classe fornitura is like RR
       
        switch(commonPackage.getClasseFornitura()){
            case "RR": //ricetta ripetibile
                ;
                break;
            case "OTC": //over the counter (da banco)
                ;
                break;
            case "SOP": //senza obbligo di prescrizione, ma non da banco
                ;
                break;
        }

        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);

    }

}

