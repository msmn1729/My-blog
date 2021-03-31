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

    // 관리자권한 안씀
//    @Secured("ROLE_ADMIN")
//    @GetMapping("/admin")
//    public String admin(Model model, @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        model.addAttribute("username", userDetails.getUsername());
//        model.addAttribute("admin", true);
//        return "index";
//    }

    @GetMapping("/post.html")
    public String post(Model model, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            model.addAttribute("message","null" );
            return "index";
        }
        model.addAttribute("username", userDetails.getUsername());
        return "post";
    }
}