package com.sparta.myblog.dto;

import lombok.Getter;

@Getter
public class BoardRequestDto {
    private Long Id;
    private String title;
    private String username;
    private String contents;
}
