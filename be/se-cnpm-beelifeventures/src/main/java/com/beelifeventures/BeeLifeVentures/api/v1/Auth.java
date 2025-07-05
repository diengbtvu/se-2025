package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.CustomerUpdateDTO;
import com.beelifeventures.BeeLifeVentures.model.dto.LoginDTO;
import com.beelifeventures.BeeLifeVentures.model.dto.UserAccountDTO;
import com.beelifeventures.BeeLifeVentures.repository.CustomerRepository;
import com.beelifeventures.BeeLifeVentures.repository.UserAccountRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.UserAccountEntity;
import com.beelifeventures.BeeLifeVentures.security.JwtUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class Auth {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    @Qualifier("customPasswordEncoder")
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerRepository customerRepository;

    ModelMapper modelMapper = new ModelMapper();

    @PostMapping("/register")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> register(@RequestBody UserAccountDTO userAccountDTO) {
        UserAccountEntity user = new UserAccountEntity();
        modelMapper.map(userAccountDTO, user);


        if (userAccountRepository.findByUserName(user.getUserName()).isPresent()) {
            return ResponseEntity.badRequest().body("ten da duoc su dung hay chon ten khac");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userAccountRepository.save(user);
        //
        CustomerEntity customer = new CustomerEntity();
        customer.setUserAccount(user);
        customer.setName(userAccountDTO.getName());
        customer.setPhoneNumber(userAccountDTO.getPhoneNumber());
        customer.setEmail(userAccountDTO.getEmail());
        customerRepository.save(customer);

        return ResponseEntity.ok("tai khoan da duoc tao thanh cong");
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> login(@RequestBody LoginDTO user) {
        Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(user.getUserName());
        if (userAccount.isPresent() && passwordEncoder.matches(user.getPassword(), userAccount.get().getPassword())) {
            // Kiểm tra trạng thái account
            if (!"ACTIVE".equals(userAccount.get().getStatus())) {
                return ResponseEntity.badRequest().body("Tài khoản đã bị khóa hoặc không hoạt động");
            }
            
            // Cập nhật last login
            userAccount.get().setLastLogin(java.time.LocalDateTime.now());
            userAccountRepository.save(userAccount.get());
            
            String token = jwtUtil.generateToken(user.getUserName());
            
            // Trả về thông tin bổ sung cho admin
            if ("ADMIN".equals(userAccount.get().getRole())) {
                return ResponseEntity.ok(new LoginResponse("Bearer: " + token, userAccount.get().getRole(), "Admin login successful"));
            } else {
                return ResponseEntity.ok(new LoginResponse("Bearer: " + token, userAccount.get().getRole(), "User login successful"));
            }
        }
        return ResponseEntity.badRequest().body("nhap sai ten dang nhap hoac mat khau");
    }    @GetMapping("/profile")
    @CrossOrigin(origins = "*")
    @Operation(summary = "Get user profile", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Token không hợp lệ");
            }

            String token = authHeader.substring(7);
            

            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
            }
            
            String userName = jwtUtil.extractUsername(token);
            if (userName == null) {
                return ResponseEntity.badRequest().body("Không thể lấy thông tin user từ token");
            }

            Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(userName);
            if (!userAccount.isPresent()) {
                return ResponseEntity.badRequest().body("Không tìm thấy thông tin người dùng");
            }

            Optional<CustomerEntity> customer = customerRepository.findByUserAccount(userAccount.get());
            if (!customer.isPresent()) {
                return ResponseEntity.badRequest().body("Không tìm thấy thông tin khách hàng");
            }

           
            UserProfileResponse profile = new UserProfileResponse();
            profile.setId(customer.get().getId());
            profile.setUserName(userAccount.get().getUserName());
            profile.setName(customer.get().getName());
            profile.setEmail(customer.get().getEmail());
            profile.setPhoneNumber(customer.get().getPhoneNumber());
            profile.setAddress(customer.get().getAddress());
            profile.setRole(userAccount.get().getRole());

            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy thông tin người dùng: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    @CrossOrigin(origins = "*")
    @Operation(summary = "Update user profile", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> updateProfile(@RequestBody CustomerUpdateDTO updateDTO, HttpServletRequest request) {
        try {
            
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Token không hợp lệ");
            }

            String token = authHeader.substring(7); 
            
            //kiemtra token
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
            }
            // Lấy thông tin user từ token
            String userName = jwtUtil.extractUsername(token);
            if (userName == null) {
                return ResponseEntity.badRequest().body("Không thể lấy thông tin user từ token");
            }

            // Tìm thông tin user
            Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(userName);
            if (!userAccount.isPresent()) {
                return ResponseEntity.badRequest().body("Không tìm thấy thông tin người dùng");
            }

            // Tìm thông tin customer
            Optional<CustomerEntity> customerOpt = customerRepository.findByUserAccount(userAccount.get());
            if (!customerOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Không tìm thấy thông tin khách hàng");
            }

            // Cập nhật thông tin customer
            CustomerEntity customer = customerOpt.get();
            if (updateDTO.getName() != null && !updateDTO.getName().trim().isEmpty()) {
                customer.setName(updateDTO.getName().trim());
            }
            if (updateDTO.getPhoneNumber() != null && !updateDTO.getPhoneNumber().trim().isEmpty()) {
                customer.setPhoneNumber(updateDTO.getPhoneNumber().trim());
            }
            if (updateDTO.getEmail() != null && !updateDTO.getEmail().trim().isEmpty()) {
                customer.setEmail(updateDTO.getEmail().trim());
            }
            if (updateDTO.getAddress() != null && !updateDTO.getAddress().trim().isEmpty()) {
                customer.setAddress(updateDTO.getAddress().trim());
            }

            // Lưu cập nhật
            customerRepository.save(customer);

            // Trả về thông tin đã cập nhật
            UserProfileResponse profile = new UserProfileResponse();
            profile.setId(customer.getId());
            profile.setUserName(userAccount.get().getUserName());
            profile.setName(customer.getName());
            profile.setEmail(customer.getEmail());
            profile.setPhoneNumber(customer.getPhoneNumber());
            profile.setAddress(customer.getAddress());
            profile.setRole(userAccount.get().getRole());

            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật thông tin người dùng: " + e.getMessage());
        }
    }

    // Helper method để extract customer từ JWT token
    private CustomerEntity getCurrentCustomerFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token không hợp lệ");
        }

        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }
        
        String userName = jwtUtil.extractUsername(token);
        if (userName == null) {
            throw new RuntimeException("Không thể lấy thông tin user từ token");
        }

        Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(userName);
        if (!userAccount.isPresent()) {
            throw new RuntimeException("Không tìm thấy thông tin người dùng");
        }

        Optional<CustomerEntity> customer = customerRepository.findByUserAccount(userAccount.get());
        if (!customer.isPresent()) {
            throw new RuntimeException("Không tìm thấy thông tin khách hàng");
        }

        return customer.get();
    }

    // DTO class cho profile response
    public static class UserProfileResponse {
        private Long id;
        private String userName;
        private String name;
        private String email;
        private String phoneNumber;
        private String address;
        private String role;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // DTO class cho login response
    public static class LoginResponse {
        private String token;
        private String role;
        private String message;

        public LoginResponse(String token, String role, String message) {
            this.token = token;
            this.role = role;
            this.message = message;
        }

        // Getters and Setters
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
