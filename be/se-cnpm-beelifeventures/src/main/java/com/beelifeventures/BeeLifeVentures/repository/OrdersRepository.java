package com.beelifeventures.BeeLifeVentures.repository;

import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.OrdersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<OrdersEntity, Long> {
    List<OrdersEntity> findByCustomer(CustomerEntity customer);
    List<OrdersEntity> findByCustomerId(Long customerId);
}