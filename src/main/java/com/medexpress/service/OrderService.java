package com.medexpress.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medexpress.dto.CommonDrug;
import com.medexpress.dto.OrderSocket;
import com.medexpress.entity.Order;
import com.medexpress.repository.OrderRepository;

import com.medexpress.repository.UserRepository;
import com.medexpress.repository.PharmacyRepository;
import com.medexpress.entity.Pharmacy;
import com.medexpress.entity.User;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;

import com.corundumstudio.socketio.SocketIOServer;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PharmacyRepository pharmacyRepository;

    @Autowired
    private AIFAService aifaService;

    @Autowired
    private SocketIOServer socketServer;

    // create order
    public Order createOrder(String packageId, String userId, String drugId, Order.StatusDoctor statusDoctor,
            Order.Priority priority) {

        // check if user exists
        User user = userRepository.findById(new ObjectId(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order(packageId, user, null, null, drugId, LocalDateTime.now(), LocalDateTime.now(),
                Order.StatusPharmacy.PENDING, Order.StatusDriver.PENDING, statusDoctor,
                priority);
        return orderRepository.save(order);
    }

    //getOrderById
        public Order getOrderById(String orderId) {
                return orderRepository.findById(new ObjectId(orderId))
                        .orElseThrow(() -> new RuntimeException("Order not found!"));
        }

    // get orders by user
    public List<Order> getOrdersByUser(String userId) {
        Sort sort = Sort.by(
                Sort.Order.desc("updatedAt"),
                Sort.Order.asc("statusDoctor"),
                Sort.Order.asc("statusPharmacy"),
                Sort.Order.asc("statusDriver"));
        return orderRepository.findByUser_Id(new ObjectId(userId), sort);
    }

    public List<Order> getOrders(String userId) {
        List<Order> orders = getOrdersByUser(userId);

        for (Order order : orders) {
            CommonDrug drugPackage = aifaService.getPackage(order.getDrugId(), order.getPackageId()).block();
            order.setDrugPackage(drugPackage);
            order.setUser(null);
            order.setPackageId(null);
        }

        return orders;
    }

    public Order getOrder(String orderId) {
        Order order = orderRepository.findById(new ObjectId(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found!"));

        CommonDrug drugPackage = aifaService.getPackage(order.getDrugId(), order.getPackageId()).block();
        order.setDrugPackage(drugPackage);
        order.setUser(null);
        order.setPackageId(null);

        return order;
    }

    // updateStatusDoctor
    public Order updateStatusDoctor(String orderId, Order.StatusDoctor statusDoctor, User doctor) {
        Order order = orderRepository.findById(new ObjectId(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found!"));

        String nameAndSurname = doctor.getName() + " " + doctor.getSurname();

        order.setStatusDoctor(statusDoctor);
        order.setUpdatedAt(LocalDateTime.now());
        CommonDrug drugPackage = aifaService.getPackage(order.getDrugId(), order.getPackageId()).block();
        order.setDrugPackage(drugPackage);
        OrderSocket orderSocket = new OrderSocket(order.getId().toString(), order.getDrugPackage(), "statusDoctor", statusDoctor.name(),
                order.getUpdatedAt().toString(), order.getPriority(), nameAndSurname);

        // send notification to user that the prescription has been approved
        socketServer.getBroadcastOperations().sendEvent(order.getUser().getId().toString(), orderSocket);

        // if Order.StatusDoctor.APPROVED, send notification to all pharmacies
        if (statusDoctor == Order.StatusDoctor.APPROVED) {
            Iterable<Pharmacy> pharmacies = pharmacyRepository.findAll();
            for (Pharmacy pharmacy : pharmacies) {
                OrderSocket orderSocketPharmacy = new OrderSocket(order.getId().toString(), order.getDrugPackage(), "statusDoctor",
                        statusDoctor.name(), order.getUpdatedAt().toString(), order.getPriority(), nameAndSurname);
                socketServer.getBroadcastOperations().sendEvent(pharmacy.getId().toString(), orderSocketPharmacy);
            }
        }
        return orderRepository.save(order);
    }

    // updateStatusPharmacy
    public Order updateStatusPharmacy(String orderId, Order.StatusPharmacy statusPharmacy, Pharmacy pharmacy) {
        Order order = orderRepository.findById(new ObjectId(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found!"));

        String companyName = pharmacy.getCompanyName();

        order.setStatusPharmacy(statusPharmacy);
        order.setUpdatedAt(LocalDateTime.now());
        CommonDrug drugPackage = aifaService.getPackage(order.getDrugId(), order.getPackageId()).block();
        order.setDrugPackage(drugPackage);

        OrderSocket orderSocket = new OrderSocket(order.getId().toString(),  order.getDrugPackage(), "statusPharmacy", statusPharmacy.name(),
                order.getUpdatedAt().toString(), order.getPriority(), companyName);

        // send notification to user that the prescription has been approved
        socketServer.getBroadcastOperations().sendEvent(order.getUser().getId().toString(), orderSocket);

        // if Order.StatusPharmacy.READY_FOR_PICKUP, send notification to all drivers
        if (statusPharmacy == Order.StatusPharmacy.READY_FOR_PICKUP) {
            List<User> drivers = userRepository.findByRole(User.Role.DRIVER);
            for (User driver : drivers) {
                OrderSocket orderSocketDriver = new OrderSocket(order.getId().toString(), order.getDrugPackage(), "statusPharmacy",
                        statusPharmacy.name(), order.getUpdatedAt().toString(), order.getPriority(), companyName);
                socketServer.getBroadcastOperations().sendEvent(driver.getId().toString(), orderSocketDriver);
            }
        }
        return orderRepository.save(order);
    }

    // updateStatusDriver
    public Order updateStatusDriver(String orderId, Order.StatusDriver statusDriver, User driver) {
        Order order = orderRepository.findById(new ObjectId(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found!"));

        String nameAndSurname = driver.getName() + " " + driver.getSurname();

        order.setStatusDriver(statusDriver);
        order.setUpdatedAt(LocalDateTime.now());
        CommonDrug drugPackage = aifaService.getPackage(order.getDrugId(), order.getPackageId()).block();
        order.setDrugPackage(drugPackage);
        
        OrderSocket orderSocket = new OrderSocket(order.getId().toString(), order.getDrugPackage(), "statusDriver", statusDriver.name(),
                order.getUpdatedAt().toString(), order.getPriority(), nameAndSurname);

        // send notification to user that the prescription has been approved
        socketServer.getBroadcastOperations().sendEvent(order.getUser().getId().toString(), orderSocket);
        return orderRepository.save(order);
    }

    // get all orders of the driver or statusPharmacy is DELIVERED_TO_DRIVER
    public List<Order> getOrdersByDriver(String driverId) {
        Sort sort = Sort.by(
                Sort.Order.desc("updatedAt"),
                Sort.Order.asc("statusDoctor"),
                Sort.Order.asc("statusPharmacy"),
                Sort.Order.asc("statusDriver"));
        return orderRepository.findByDriver_IdOrDriverIsNullAndStatusPharmacy(new ObjectId(driverId),
                Order.StatusPharmacy.DELIVERED_TO_DRIVER, sort);
    }

    // get all orders of the pharmacy or statusDoctor is NO_APPROVAL_NEEDED or
    // APPROVED
    public List<Order> getOrdersByPharmacy(String pharmacyId) {
        Sort sort = Sort.by(
                Sort.Order.desc("updatedAt"),
                Sort.Order.asc("statusDoctor"),
                Sort.Order.asc("statusPharmacy"),
                Sort.Order.asc("statusDriver"));
        return orderRepository.findByPharmacy_IdOrPharmacyIsNullAndStatusDoctorIn(new ObjectId(pharmacyId),
                List.of(Order.StatusDoctor.NO_APPROVAL_NEEDED, Order.StatusDoctor.APPROVED), sort);
    }

}
