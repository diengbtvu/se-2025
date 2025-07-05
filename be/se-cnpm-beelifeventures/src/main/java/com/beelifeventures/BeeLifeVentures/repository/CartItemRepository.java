package com.beelifeventures.BeeLifeVentures.repository;

import com.beelifeventures.BeeLifeVentures.repository.entity.CartEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.CartItemEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findByCart(CartEntity cart);
    List<CartItemEntity> findByCartId(Long cartId);
    Optional<CartItemEntity> findByCartAndProduct(CartEntity cart, ProductEntity product);
    
    @Query("SELECT ci FROM CartItemEntity ci WHERE ci.cart.id = :cartId AND ci.product.id = :productId")
    Optional<CartItemEntity> findByCartIdAndProductId(@Param("cartId") Long cartId, @Param("productId") Long productId);
    
    void deleteByCart(CartEntity cart);
    void deleteByCartId(Long cartId);
}
