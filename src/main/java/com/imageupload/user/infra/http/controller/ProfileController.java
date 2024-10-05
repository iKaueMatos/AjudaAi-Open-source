package com.imageupload.user.infra.http.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfileController {
    @GetMapping("/profile")
    public String handle() {
        return "pages/profile/profile";
    }
}
