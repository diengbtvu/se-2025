package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.OrdersDTO;
import com.beelifeventures.BeeLifeVentures.service.OrdersService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class Orders {
    @Autowired
    private OrdersService ordersService;
    //get orders
    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    public ResponseEntity<OrdersDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ordersService.findById(id));
    }

    @CrossOrigin(origins = "*")
    @PostMapping
    public ResponseEntity<OrdersDTO> createOrder(@RequestBody OrdersDTO ordersDTO) {
        try {
            ordersDTO.setId(null); // Đảm bảo tạo mới
            OrdersDTO savedOrder = ordersService.save(ordersDTO);
            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping
    public ResponseEntity<OrdersDTO> updateOrder(@RequestBody OrdersDTO ordersDTO) {
        return ResponseEntity.ok(ordersService.update(ordersDTO));
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            ordersService.delete(id);
            return ResponseEntity.ok("Đã xóa đơn hàng và hoàn số lượng về kho thành công");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa đơn hàng: " + e.getMessage());
        }
    }


}
