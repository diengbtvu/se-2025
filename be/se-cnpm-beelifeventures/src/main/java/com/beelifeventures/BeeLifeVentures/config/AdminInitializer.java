package com.beelifeventures.BeeLifeVentures.config;

import com.beelifeventures.BeeLifeVentures.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    @Override
    public void run(String... args) throws Exception {
        // Khởi tạo admin account khi ứng dụng start
        adminService.initializeAdminAccount();
        System.out.println("=== Admin account initialized ===");
        System.out.println("Username: admin");
        System.out.println("Password: admin");
        System.out.println("================================");
    }
}
