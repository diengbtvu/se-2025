package com.beelifeventures.BeeLifeVentures;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.beelifeventures")
public class BeeLifeVenturesApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeeLifeVenturesApplication.class, args);
	}

}
