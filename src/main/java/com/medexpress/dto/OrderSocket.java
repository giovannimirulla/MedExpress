package com.medexpress.dto;

import com.medexpress.entity.Order.Priority;
import com.medexpress.entity.Order.StatusDoctor;
import com.medexpress.entity.Order.StatusDriver;
import com.medexpress.entity.Order.StatusPharmacy;

import com.medexpress.entity.Order;

import java.time.LocalDateTime;


public class OrderSocket extends OrderDTO {
    private String updatedAtString;
    private String createdAtString;



    public OrderSocket(String id, String drugId, StatusPharmacy statusPharmacy, StatusDriver statusDriver, StatusDoctor statusDoctor, Priority priority, CommonDrug drugPackage, LocalDateTime createdAt, LocalDateTime updatedAt, EntityDTO updatedBy, UserDTO user, UserDTO driver, PharmacyDTO pharmacy) {
        super(id, drugId, statusPharmacy, statusDriver, statusDoctor, priority, drugPackage, null, null, updatedBy, user, driver, pharmacy);
        this.updatedAtString = updatedAt.toString();
        this.createdAtString = createdAt.toString();
    }

    public static OrderSocket fromOrderDTO(OrderDTO orderDTO, LocalDateTime updatedAt, EntityDTO updatedBy) {
        return new OrderSocket(orderDTO.getId(), orderDTO.getDrugId(), orderDTO.getStatusPharmacy(), orderDTO.getStatusDriver(), orderDTO.getStatusDoctor(), orderDTO.getPriority(), orderDTO.getDrugPackage(), orderDTO.getCreatedAt(), updatedAt, updatedBy, orderDTO.getUser(), orderDTO.getDriver(), orderDTO.getPharmacy());
    }

    public static OrderSocket fromOrder(Order order,  EntityDTO updatedBy, CommonDrug drugPackage) {
        return new OrderSocket(order.getId().toString(), order.getDrugId(), order.getStatusPharmacy(), order.getStatusDriver(), order.getStatusDoctor(), order.getPriority(), drugPackage, order.getCreatedAt(), order.getUpdatedAt(), updatedBy, UserDTO.fromUser(order.getUser()), UserDTO.fromUser(order.getDriver()), PharmacyDTO.fromPharmacy(order.getPharmacy()));
    }

    public String getUpdatedAtString() {
        return updatedAtString;
    }

    public void setUpdatedAtString(String updatedAtString) {
        this.updatedAtString = updatedAtString;
    }

    public String getCreatedAtString() {
        return createdAtString;
    }

    public void setCreatedAtString(String createdAtString) {
        this.createdAtString = createdAtString;
    }



}
