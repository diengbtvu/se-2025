package com.beelifeventures.BeeLifeVentures.api.v1;

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
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userAccountRepository.save(user);

        // Thêm đoạn này để lưu CustomerEntity
        CustomerEntity customer = new CustomerEntity();
        customer.setUserAccount(user);
        customer.setName(userAccountDTO.getName());
        customer.setPhoneNumber(userAccountDTO.getPhoneNumber());
        customer.setEmail(userAccountDTO.getEmail());
        customerRepository.save(customer);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> login(@RequestBody UserAccountDTO user) {
        Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(user.getUserName());
        if (userAccount.isPresent() && passwordEncoder.matches(user.getPassword(), userAccount.get().getPassword())) {
            String token = jwtUtil.generateToken(user.getUserName());
            return ResponseEntity.ok("Bearer: " + token);
        }
        return ResponseEntity.badRequest().body("Invalid username or password");
    }
}
