package com.imageupload.image.infra.http.controller.tools;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ImageRemensioning {
    
    @GetMapping("/redmensioning")
    public String showRedimensioningPage() {
        return "pages/redmensioning-tool/redmensioning";
    }

}
