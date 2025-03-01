package com.medexpress.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;

import com.medexpress.entity.Order;
import com.medexpress.entity.User;

import com.medexpress.service.UserService;
import com.medexpress.service.OrderService;
import com.medexpress.dto.DoctorDTO;
import com.medexpress.dto.UpdateStatusDoctorRequest;
import com.medexpress.dto.UserDTO;




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
    public ResponseEntity<List<DoctorDTO>> searchDoctor(@RequestParam String query) {
        List<User> doctors = userService.searchDoctor(query);
        List<DoctorDTO> doctorDTOs = DoctorDTO.fromEntityList(doctors);
        return new ResponseEntity<List<DoctorDTO>>(doctorDTOs, HttpStatus.OK);
    }

    // update status of order
    @PostMapping("/updateStatus")
    public ResponseEntity<Order> updateStatus(@RequestBody UpdateStatusDoctorRequest body) {
        Order order = orderService.updateStatusDoctor(body.getOrderId(), body.getStatus());
        return new ResponseEntity<Order>(order, HttpStatus.OK);
    }
}
