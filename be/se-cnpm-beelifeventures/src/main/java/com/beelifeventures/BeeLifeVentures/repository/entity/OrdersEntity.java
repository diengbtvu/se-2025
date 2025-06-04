package com.beelifeventures.BeeLifeVentures.repository.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(length = 50, nullable = false)
    private String status;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(length = 255)
    private String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderDetailEntity> orderDetails;

    public List<OrderDetailEntity> getOrderDetails() { return orderDetails; }
    public void setOrderDetails(List<OrderDetailEntity> orderDetails) { this.orderDetails = orderDetails; }
}
