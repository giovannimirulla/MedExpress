package com.medexpress.dto;

import java.util.List;
import com.medexpress.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusDTO {
    private List<Order> pending;
    private List<Order> approvedOrNoApprovalNeeded;
    private List<Order> deliveredToDriver;
    private List<Order> deliveredToUser;
}