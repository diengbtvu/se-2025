package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.ProductDTO;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import com.beelifeventures.BeeLifeVentures.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class Product {
    @Autowired
    private ProductService productService;
  
  @CrossOrigin(origins = "*")
  @GetMapping
    public ResponseEntity<?> getAllProducts() {
      List<ProductDTO> productDTOS= productService.findAll();
      return ResponseEntity.ok(productDTOS);
  }
  @PostMapping
  @CrossOrigin(origins = "*")
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO) {
      ProductEntity productEntity = new ProductEntity();
      productEntity.setName(productDTO.getName());
      productEntity.setDescription(productDTO.getDescription());
      productEntity.setPrice(productDTO.getPrice());
      productEntity.setProductType(productDTO.getProductType());
      productEntity.setExpiryDate(productDTO.getExpiryDate());
      productEntity.setPrice(productDTO.getPrice());
      productEntity.setStockQuantity(productDTO.getStockQuantity());
      productEntity.setImageUrl(productDTO.getImageUrl());
      productService.save(productDTO);
      return ResponseEntity.ok("Đã thêm sản phẩm thành công");

  }
  @DeleteMapping
  @CrossOrigin(origins = "*")
  public ResponseEntity<?> deleteProduct(@RequestBody ProductDTO productDTO) {
    productService.delete(productDTO);
    return ResponseEntity.ok("đã xóa sản phẩm thành công");
  }
  @PutMapping
  @CrossOrigin(origins = "*")
  public ResponseEntity<?> putProduct(@RequestBody ProductDTO productDTO){
    ProductDTO tim = productService.findById(productDTO.getId());
    if (tim == null){
      throw new EntityNotFoundException("ko tìm thấy sản phẩm với id: " + productDTO.getId());
    }
    return ResponseEntity.ok(productService.update(productDTO));

  }


}
