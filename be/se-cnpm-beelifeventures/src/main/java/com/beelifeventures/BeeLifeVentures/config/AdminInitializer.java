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
        //  khởi tạo tài khoản quản trị viên nếu chưas tồn tại admimmm
        adminService.initializeAdminAccount();
        
    }
}
