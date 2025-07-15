package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.ProductDTO;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import com.beelifeventures.BeeLifeVentures.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "*", maxAge = 3600)
public class Product {
    @Autowired
    private ProductService productService;
  
  @CrossOrigin(origins = "*")
  @GetMapping
  @Operation(summary = "Get All Product for user")
    public ResponseEntity<?> getAllProducts() {
      List<ProductDTO> productDTOS= productService.findAll();
      return ResponseEntity.ok(productDTOS);
  }
  /*  

---------------------------- Temporarily disable product POST function, move to admin for posting ------------------
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
      return ResponseEntity.ok("Product added successfully");

  }
  @DeleteMapping
  @CrossOrigin(origins = "*")
  public ResponseEntity<?> deleteProduct(@RequestBody ProductDTO productDTO) {
    productService.delete(productDTO);
    return ResponseEntity.ok("Product deleted successfully");
  }
  @PutMapping
  @CrossOrigin(origins = "*")
  public ResponseEntity<?> putProduct(@RequestBody ProductDTO productDTO){
    ProductDTO found = productService.findById(productDTO.getId());
    if (found == null){
      throw new EntityNotFoundException("Product not found with id: " + productDTO.getId());
    }
    return ResponseEntity.ok(productService.update(productDTO));

  }
------------------------------------------------------------------------------------------
*/
  @CrossOrigin(origins = "*")
@GetMapping("/{id}")
@Operation(summary = "Get Product by ID")
public ResponseEntity<?> getProductById(@PathVariable Long id) {
    try {
        ProductDTO productDTO = productService.findById(id);
        
        if (productDTO == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(productDTO);
    } catch (Exception e) 
    {
        return ResponseEntity.badRequest().body("Error finding product: " + e.getMessage());
    }
}

}

