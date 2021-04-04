package com.sparta.myblog.controller;

import com.sparta.myblog.security.UserDetailsImpl;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String home(Model model, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        // 값이 없을 때 예외처리
        if (userDetails == null) {
            model.addAttribute("message","null" );
            return "index";
        }
        model.addAttribute("username", userDetails.getUsername());
        return "index";
    }

    @GetMapping("/post.html")
    public String post(Model model, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            model.addAttribute("message","null" );
            return "index";
        }
        model.addAttribute("username", userDetails.getUsername());
        return "post";
    }

    @GetMapping("/detail.html")
    public String detail(Model model, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            model.addAttribute("message","null" );
            return "detail";
        }
        model.addAttribute("username", userDetails.getUsername());
        return "detail";
    }

    @GetMapping("/edit.html")
    public String edit(Model model, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            model.addAttribute("message","null" );
            return "edit";
        }
        model.addAttribute("username", userDetails.getUsername());
        return "edit";
    }
}