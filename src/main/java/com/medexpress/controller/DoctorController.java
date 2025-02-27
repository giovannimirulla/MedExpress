package com.medexpress.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;

import com.medexpress.entity.Order;
import com.medexpress.entity.User;

import com.medexpress.service.UserService;
import com.medexpress.service.OrderService;

@RestController
@RequestMapping("/api/v1/doctor")
public class DoctorController {

    private final UserService userService;

    private final OrderService orderService;

    // constructor
    public DoctorController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    // search doctor by name or lastname using one query string
    @RequestMapping("/search")
    public ResponseEntity<List<User>> searchDoctor(@RequestParam String query) {
        return new ResponseEntity<List<User>>(userService.searchDoctor(query), HttpStatus.OK);
    }

    // approve prescription request of a drug in an order
    @RequestMapping("/approve")
    public ResponseEntity<Order> approvePrescription(@RequestParam String orderId) {
        return new ResponseEntity<Order>(orderService.approvePrescription(orderId), HttpStatus.OK);
    }

    // reject prescription request of a drug in an order -url with 67be54564f80bd31a2b5b128 = http://localhost:8080/api/v1/doctor/reject?orderId=67be54564f80bd31a2b5b128
    @RequestMapping("/reject")
    public ResponseEntity<Order> rejectPrescription(@RequestParam String orderId) {
        return new ResponseEntity<Order>(orderService.rejectPrescription(orderId), HttpStatus.OK);
    }
}
