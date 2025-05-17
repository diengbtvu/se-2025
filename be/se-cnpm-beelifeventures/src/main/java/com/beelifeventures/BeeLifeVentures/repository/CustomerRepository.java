package com.beelifeventures.BeeLifeVentures.repository;

import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {
}