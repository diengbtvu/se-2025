package com.beelifeventures.BeeLifeVentures.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@CrossOrigin(origins = "*", maxAge = 3600)
public class UtilController {
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("name", "BeeLifeVentures");
        return "/source/home";
    }
}