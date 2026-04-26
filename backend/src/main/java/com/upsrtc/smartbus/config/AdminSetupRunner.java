package com.upsrtc.smartbus.config;

import com.upsrtc.smartbus.model.User;
import com.upsrtc.smartbus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Runs on every startup to guarantee the admin user exists
 * with a known password. Safe to run repeatedly.
 */
@Component
public class AdminSetupRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Ensure admin user exists with fixed password
        User admin = userRepository.findByUsername("admin").orElse(null);

        if (admin == null) {
            // Create fresh admin
            admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@upsrtc.com");
            admin.setRole(User.Role.ADMIN);
        }

        // Always reset to known password so login always works
        admin.setPassword(passwordEncoder.encode("admin123"));
        userRepository.save(admin);

        System.out.println(">>> [AdminSetup] Admin user ready. Login: admin / admin123");
    }
}
