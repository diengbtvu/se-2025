package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.OrdersDTO;
import com.beelifeventures.BeeLifeVentures.service.OrdersService;
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
        ordersDTO.setId(null); // Đảm bảo tạo mới, không update
        return ResponseEntity.ok(ordersService.save(ordersDTO));
    }

    @CrossOrigin(origins = "*")
    @PutMapping
    public ResponseEntity<OrdersDTO> updateOrder(@RequestBody OrdersDTO ordersDTO) {
        return ResponseEntity.ok(ordersService.update(ordersDTO));
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        ordersService.delete(id);
        return ResponseEntity.ok("Da huy dat hang thanh cong");
    }


}
