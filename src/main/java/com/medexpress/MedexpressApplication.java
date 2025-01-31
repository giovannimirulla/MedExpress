package com.medexpress;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vaadin.flow.theme.Theme;
import com.vaadin.flow.component.page.AppShellConfigurator;

@SpringBootApplication
@RestController
@Theme("my-theme")
public class MedexpressApplication implements AppShellConfigurator {

    public static void main(String[] args) {
        SpringApplication.run(MedexpressApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello, world";
    }

}
