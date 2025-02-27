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

    // update status of order
    @RequestMapping("/updateStatus")
    public ResponseEntity<Order> updateStatus(@RequestParam String orderId, @RequestParam Order.StatusDoctor status) {
        return new ResponseEntity<Order>(orderService.updateStatusDoctor(orderId, status), HttpStatus.OK);
    }
}
