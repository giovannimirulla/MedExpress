package com.medexpress.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = "/{path:[^\\.]*}") // Gestisce tutte le richieste che non contengono un punto
    public String forward() {
        return "forward:/index.html"; // Reindirizza al file index.html del frontend
    }

    @RequestMapping(value = {"/signup", "/signup/"}) // Gestisce sia con che senza slash finale
    public String signup() {
        return "forward:/signup/index.html"; // Reindirizza al file index.html del frontend
    }

    @RequestMapping(value = {"/login", "/login/"}) // Gestisce sia con che senza slash finale
    public String login() {
        return "forward:/login/index.html"; // Reindirizza al file index.html del frontend
    }

    @RequestMapping(value = {"/dashboard", "/dashboard/"}) // Gestisce sia con che senza slash finale
    public String dashboard() {
        return "forward:/dashboard/index.html"; // Reindirizza al file index.html del frontend
    }
}