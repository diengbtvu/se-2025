package com.beelifeventures.BeeLifeVentures.service;

import com.beelifeventures.BeeLifeVentures.model.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    List<ProductDTO> findAll();
    void save(ProductDTO product);

    void delete(ProductDTO product);
    ProductDTO findById(Long id);

    ProductDTO update(ProductDTO product);



}
