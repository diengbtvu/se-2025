package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.ProductDTO;
import com.beelifeventures.BeeLifeVentures.repository.ProductRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private ProductEntity productEntity;
    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        productEntity = new ProductEntity();
        productEntity.setId(1L);
        productEntity.setName("Honey");
        productEntity.setPrice(10.0);

        productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setName("Honey");
        productDTO.setPrice(10.0);
    }

    @Test
    void findAll_ShouldReturnProductList() {
        when(productRepository.findAll()).thenReturn(Collections.singletonList(productEntity));
        when(modelMapper.map(productEntity, ProductDTO.class)).thenReturn(productDTO);

        List<ProductDTO> result = productService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Honey", result.get(0).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void findById_ShouldReturnProduct_WhenProductExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(productEntity));
        when(modelMapper.map(productEntity, ProductDTO.class)).thenReturn(productDTO);

        ProductDTO result = productService.findById(1L);

        assertNotNull(result);
        assertEquals("Honey", result.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void save_ShouldSaveProduct() {
        when(productRepository.save(any(ProductEntity.class))).thenReturn(productEntity);

        productService.save(productDTO);

        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }

    @Test
    void update_ShouldUpdateProduct() {
        when(productRepository.save(any(ProductEntity.class))).thenReturn(productEntity);

        ProductDTO result = productService.update(productDTO);

        assertNotNull(result);
        assertEquals(productDTO, result);
        verify(productRepository, times(1)).save(any(ProductEntity.class));
    }

    @Test
    void delete_ShouldDeleteProduct_WhenProductExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(productEntity));
        doNothing().when(productRepository).delete(productEntity);

        productService.delete(productDTO);

        verify(productRepository, times(1)).delete(productEntity);
    }
}
