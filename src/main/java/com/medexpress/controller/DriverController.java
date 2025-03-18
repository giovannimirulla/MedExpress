package com.medexpress.controller;

import com.medexpress.service.OrderService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;

import com.medexpress.dto.UpdateStatusDriverRequest;
import com.medexpress.entity.Order;
import com.medexpress.entity.User;
import com.medexpress.enums.AuthEntityType;
import com.medexpress.security.CustomUserDetails;
import com.medexpress.service.UserService;

@RestController
@RequestMapping("/api/v1/driver")
public class DriverController {

    private final OrderService orderService;

    private final UserService userService;

    public DriverController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    // update status of order
    @PostMapping("/updateStatus")
    public ResponseEntity<Order> updateStatus(@RequestBody UpdateStatusDriverRequest body) {
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            if (userDetails.getRole() != User.Role.DRIVER || userDetails.getEntityType() != AuthEntityType.USER) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            //get driver
            User driver = userService.getUser(userDetails.getId());

            Order order = orderService.updateStatusDriver(body.getOrderId(), body.getStatus(), driver);
            return new ResponseEntity<Order>(order, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }



}
