package com.medexpress.service;

import java.time.LocalDateTime;
import org.bson.types.ObjectId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.medexpress.entity.Order;
import com.medexpress.repository.OrderRepository;

import com.medexpress.repository.UserRepository;


@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public Order createOrder(String idPackage, String idUser, String idDrug) {

        // check if user exists
        if (!userRepository.existsById(new ObjectId(idUser))) {
            throw new IllegalArgumentException("User with id " + idUser + " does not exist!");
        }
        
        return orderRepository.insert(new Order(idPackage, new ObjectId(idUser), idDrug, LocalDateTime.now(), LocalDateTime.now()));
    }
    
}
