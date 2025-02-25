package com.medexpress.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.medexpress.entity.Order;
import com.medexpress.repository.OrderRepository;

import com.medexpress.repository.UserRepository;
import com.medexpress.entity.User;


import org.bson.types.ObjectId;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // create order
    public Order createOrder(String packageId, String userId, String drugId) {

        // check if user exists
        User user = userRepository.findById(new ObjectId(userId)).orElseThrow(() -> new RuntimeException("User not found"));
      
        Order order = new Order(packageId, user, null, null, drugId, LocalDateTime.now(), LocalDateTime.now(),  Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING, Order.Priority.LOW);
        return orderRepository.save(order);
    }

    // approve prescription request of a drug in an order
    public Order approvePrescription(String orderId) {
        Order order = orderRepository.findById(new ObjectId(orderId)).orElseThrow(() -> new RuntimeException("Order not found!"));
        order.setStatusDoctor(Order.StatusDoctor.APPROVED);
        return orderRepository.save(order);
    }
    
    // reject prescription request of a drug in an order
    public Order rejectPrescription(String orderId) {
        Order order = orderRepository.findById(new ObjectId(orderId)).orElseThrow(() -> new RuntimeException("Order not found!"));
        order.setStatusDoctor(Order.StatusDoctor.REJECTED);
        return orderRepository.save(order);
    }
}
