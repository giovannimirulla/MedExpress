package com.medexpress.controller;

import com.medexpress.service.OrderService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.medexpress.entity.Order;


@RestController
@RequestMapping("/api/v1/driver")
public class DriverController {



    private final OrderService orderService;

    public DriverController( OrderService orderService) {
        this.orderService = orderService;
    }

    //update status of order
    @RequestMapping("/updateStatus")
    public ResponseEntity<Order> updateStatus(@RequestParam String orderId, @RequestParam Order.StatusDriver status) {
        return new ResponseEntity<Order>(orderService.updateStatusDriver(orderId, status), HttpStatus.OK);
    }

}
