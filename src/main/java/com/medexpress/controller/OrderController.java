package com.medexpress.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.medexpress.service.OrderService;
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


    public OrderController(OrderService orderService, ModelMapper modelMapper) {
        this.orderService = orderService;
        this.modelMapper = modelMapper;
    }

    @PostMapping()
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO body) {

        Order order = orderService.createOrder(body.getPackageId(), body.getUserId(), body.getDrugId());

        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);

    }

}

