package com.sparta.myblog.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentReqeustDto {

    private Long article_id;
    private String username;
    private String contents;
}
