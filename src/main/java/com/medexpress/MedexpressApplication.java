package com.medexpress;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class MedexpressApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedexpressApplication.class, args);
    }



}
