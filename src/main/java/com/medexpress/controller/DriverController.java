package com.medexpress.controller;

import com.medexpress.service.OrderService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.medexpress.dto.UpdateStatusDriverRequest;
import com.medexpress.entity.Order;

@RestController
@RequestMapping("/api/v1/driver")
public class DriverController {

    private final OrderService orderService;

    public DriverController(OrderService orderService) {
        this.orderService = orderService;
    }

    // update status of order
    @PostMapping("/updateStatus")
    public ResponseEntity<Order> updateStatus(@RequestBody UpdateStatusDriverRequest body) {
        Order order = orderService.updateStatusDriver(body.getOrderId(), body.getStatus());
        return new ResponseEntity<Order>(order, HttpStatus.OK);
    }

}
