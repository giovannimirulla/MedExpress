package com.medexpress;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedexpressApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedexpressApplication.class, args);
        openBrowser();
    }

    private static void openBrowser() {
        String os = System.getProperty("os.name").toLowerCase();
        String url = "http://localhost:8080";

        try {
            if (os.contains("win")) {
                new ProcessBuilder("cmd", "/c", "start", url).start();
            } else if (os.contains("mac")) {
                new ProcessBuilder("open", url).start();
            } else {
                new ProcessBuilder("xdg-open", url).start(); // For Linux
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}