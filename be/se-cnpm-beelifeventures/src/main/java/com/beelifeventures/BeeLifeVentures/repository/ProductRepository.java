package com.beelifeventures.BeeLifeVentures.repository;

import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity,Long> {
}