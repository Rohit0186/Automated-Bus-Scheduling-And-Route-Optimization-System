package com.upsrtc.smartbus;

import com.upsrtc.smartbus.service.DataBootstrapService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartBusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartBusApplication.class, args);
    }

    @Bean
    public CommandLineRunner bootstrapData(DataBootstrapService bootstrapService) {
        return args -> {
            try {
                bootstrapService.bootstrap();
            } catch (Exception e) {
                System.err.println(">>> Bootstrap Failed: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
