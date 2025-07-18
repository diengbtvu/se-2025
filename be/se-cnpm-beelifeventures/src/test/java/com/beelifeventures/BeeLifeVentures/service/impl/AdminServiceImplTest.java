package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.AdminUserManagementDTO;
import com.beelifeventures.BeeLifeVentures.repository.CustomerRepository;
import com.beelifeventures.BeeLifeVentures.repository.UserAccountRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.UserAccountEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceImplTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private AdminServiceImpl adminService;

    private UserAccountEntity adminAccount;

    @BeforeEach
    void setUp() {
        adminAccount = new UserAccountEntity();
        adminAccount.setUserName("admin");
        adminAccount.setRole("ADMIN");
    }

    @Test
    void initializeAdminAccount_ShouldCreateAdmin_WhenAdminDoesNotExist() {
        when(userAccountRepository.findByUserName("admin")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("admin")).thenReturn("encodedPassword");

        adminService.initializeAdminAccount();

        verify(userAccountRepository, times(1)).save(any(UserAccountEntity.class));
        verify(customerRepository, times(1)).save(any(CustomerEntity.class));
    }

    @Test
    void initializeAdminAccount_ShouldNotCreateAdmin_WhenAdminExists() {
        when(userAccountRepository.findByUserName("admin")).thenReturn(Optional.of(adminAccount));

        adminService.initializeAdminAccount();

        verify(userAccountRepository, never()).save(any(UserAccountEntity.class));
        verify(customerRepository, never()).save(any(CustomerEntity.class));
    }

    @Test
    void isAdmin_ShouldReturnTrue_WhenUserIsAdmin() {
        when(userAccountRepository.findByUserName("admin")).thenReturn(Optional.of(adminAccount));
        assertTrue(adminService.isAdmin("admin"));
    }

    @Test
    void isAdmin_ShouldReturnFalse_WhenUserIsNotAdmin() {
        UserAccountEntity userAccount = new UserAccountEntity();
        userAccount.setUserName("user");
        userAccount.setRole("USER");
        when(userAccountRepository.findByUserName("user")).thenReturn(Optional.of(userAccount));
        assertFalse(adminService.isAdmin("user"));
    }

    @Test
    void isAdmin_ShouldReturnFalse_WhenUserDoesNotExist() {
        when(userAccountRepository.findByUserName("nonexistent")).thenReturn(Optional.empty());
        assertFalse(adminService.isAdmin("nonexistent"));
    }
}
