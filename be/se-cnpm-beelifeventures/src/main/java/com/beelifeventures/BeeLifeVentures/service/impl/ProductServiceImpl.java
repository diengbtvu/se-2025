package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.ProductDTO;
import com.beelifeventures.BeeLifeVentures.repository.ProductRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import com.beelifeventures.BeeLifeVentures.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<ProductDTO> findAll() {
        List<ProductEntity> productEntities = productRepository.findAll();
        List<ProductDTO> productDTOs = new ArrayList<>();
        for (ProductEntity productEntity : productEntities) {
            ProductDTO productDTO = modelMapper.map(productEntity, ProductDTO.class);
            productDTOs.add(productDTO);

        }
        return productDTOs;
    }

    @Override
    public void save(ProductDTO product) {
        ProductEntity product1 =new ProductEntity();
        product1.setImageUrl(product.getImageUrl());
        product1.setName(product.getName());
        product1.setPrice(product.getPrice());
        product1.setDescription(product.getDescription());
        product1.setStockQuantity(product.getStockQuantity());
        product1.setExpiryDate(product.getExpiryDate());
        product1.setProductType(product.getProductType());
        product1.setManufactureDate(product.getManufactureDate());
        productRepository.save(product1);

    }

    @Override
    public void delete(ProductDTO product) {
        Optional<ProductEntity> deletedProductEntity = productRepository.findById(product.getId());

        if (deletedProductEntity.isPresent()) {
            productRepository.delete(deletedProductEntity.get());
        } else {
            throw new EntityNotFoundException("Product with ID " + product.getId() + " not found.");
        }
    }


    @Override
    public ProductDTO findById(Long id) {
        Optional<ProductEntity> it = productRepository.findById(id);
        if (!it.isPresent()) {
            throw new EntityNotFoundException("Ko tim thay");
        }
        ProductEntity bien = it.get();
        ProductDTO bien2 = modelMapper.map(bien,ProductDTO.class);
        return bien2;
    }

    @Override
    public ProductDTO update(ProductDTO product) {
        ProductEntity product1 = new ProductEntity();
        product1.setId(product.getId());
        product1.setImageUrl(product.getImageUrl());
        product1.setName(product.getName());
        product1.setPrice(product.getPrice());
        product1.setDescription(product.getDescription());
        product1.setStockQuantity(product.getStockQuantity());
        product1.setExpiryDate(product.getExpiryDate());
        product1.setProductType(product.getProductType());
        product1.setManufactureDate(product.getManufactureDate());
        productRepository.save(product1);
      return product;
    }


}
