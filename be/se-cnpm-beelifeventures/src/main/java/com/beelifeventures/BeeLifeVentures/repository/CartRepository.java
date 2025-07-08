package com.beelifeventures.BeeLifeVentures.repository;

import com.beelifeventures.BeeLifeVentures.repository.entity.CartEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    Optional<CartEntity> findByCustomer(CustomerEntity customer);
    Optional<CartEntity> findByCustomerId(Long customerId);
    boolean existsByCustomer(CustomerEntity customer);
}
