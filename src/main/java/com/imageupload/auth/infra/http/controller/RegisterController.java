package com.imageupload.auth.infra.http.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RegisterController {
    
    @GetMapping("/register")
    public String handle() {
        return "pages/auth/register/register";
    }

}
