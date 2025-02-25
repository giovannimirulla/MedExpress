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

    public Order createOrder(String packageId, String userId, String drugId) {

        // check if user exists
        User user = userRepository.findById(new ObjectId(userId)).orElseThrow(() -> new RuntimeException("User not found"));

       
        
        return orderRepository.insert(new Order(packageId, user, drugId, LocalDateTime.now(), LocalDateTime.now(), 
        Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING, Order.Priority.LOW));


    }


    
}
