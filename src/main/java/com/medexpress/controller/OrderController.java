package com.medexpress.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.medexpress.service.OrderService;
import com.medexpress.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.http.HttpStatus;

import java.util.Map;


@RestController 
@RequestMapping("/api/v1/order")
public class OrderController {
   
    @Autowired
    private OrderService orderService;


    public OrderController(OrderService orderService) {
        this.orderService = orderService;
        
    }

    @PostMapping()
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, String> body) {

        Order order = orderService.createOrder(body.get("idPackage"), body.get("idUser"), body.get("idDrug"));

        return new ResponseEntity<>(order, HttpStatus.CREATED);

    }

}

