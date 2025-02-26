package com.medexpress.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medexpress.dto.CommonDrug;
import com.medexpress.dto.OrderStatusDTO;
import com.medexpress.entity.Order;
import com.medexpress.repository.OrderRepository;

import com.medexpress.repository.UserRepository;
import com.medexpress.entity.User;

import org.bson.types.ObjectId;

import org.springframework.data.domain.Sort;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIFAService aifaService;


    // create order
    public Order createOrder(String packageId, String userId, String drugId) {

        // check if user exists
        User user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order(packageId, user, null, null, drugId, LocalDateTime.now(), LocalDateTime.now(),
                Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, Order.StatusDoctor.PENDING,
                Order.Priority.LOW);
        return orderRepository.save(order);
    }

    // approve prescription request of a drug in an order
    public Order approvePrescription(String orderId) {
        Order order = orderRepository.findById(new ObjectId(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        order.setStatusDoctor(Order.StatusDoctor.APPROVED);
        return orderRepository.save(order);
    }

    // reject prescription request of a drug in an order
    public Order rejectPrescription(String orderId) {
        Order order = orderRepository.findById(new ObjectId(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found!"));
        order.setStatusDoctor(Order.StatusDoctor.REJECTED);
        return orderRepository.save(order);
    }

    // get orders by user
    public List<Order> getOrdersByUser(String userId) {
        Sort sort = Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.asc("statusDoctor"),
                Sort.Order.asc("statusPharmacy"),
                Sort.Order.asc("statusDriver"));
        return orderRepository.findByUser_Id(new ObjectId(userId), sort);
    }

    public OrderStatusDTO getOrdersGroupedByStatus(String userId) {
        List<Order> orders = getOrdersByUser(userId);
        List<Order> pending = new ArrayList<>();
        List<Order> approvedOrNoApprovalNeeded = new ArrayList<>();
        List<Order> deliveredToDriver = new ArrayList<>();
        List<Order> deliveredToUser = new ArrayList<>();

        for (Order order : orders) {
            CommonDrug drugPackage = aifaService.getPackage(order.getDrugId(), order.getPackageId()).block();
            order.setDrugPackage(drugPackage);
            order.setUser(null);
            order.setPackageId(null);
            
            if (order.getStatusDoctor() == Order.StatusDoctor.PENDING) {
                pending.add(order);
            } else if (order.getStatusDoctor() == Order.StatusDoctor.APPROVED ||
                    order.getStatusDoctor() == Order.StatusDoctor.NO_APPROVAL_NEEDED) {
                approvedOrNoApprovalNeeded.add(order);
                if (order.getStatusPharmacy() == Order.StatusPharmacy.DELIVERED_TO_DRIVER) {
                    deliveredToDriver.add(order);
                    if (order.getStatusDriver() == Order.StatusDriver.DELIVERED_TO_THE_USER) {
                        deliveredToUser.add(order);
                    }
                }
            }
        }
        return new OrderStatusDTO(pending, approvedOrNoApprovalNeeded, deliveredToDriver, deliveredToUser);
    }

}
