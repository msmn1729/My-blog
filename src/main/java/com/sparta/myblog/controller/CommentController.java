package com.sparta.myblog.controller;

import com.sparta.myblog.domain.Comment;
import com.sparta.myblog.dto.CommentReqeustDto;
import com.sparta.myblog.repository.CommentRepository;
import com.sparta.myblog.service.CommentService;
import com.sparta.myblog.util.CommentSpecs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CommentController {

    private final CommentRepository commentRepository;
    private final CommentService commentService;

    @GetMapping("/comments")
    public List<Comment> getComment() {
        return commentRepository.findAllByOrderByModifiedAtDesc();
    }


    @GetMapping("/comment/{article_id}")
    public List<Comment> getComment(@PathVariable Long article_id) {
        return commentRepository.findAll(CommentSpecs.withArticle_id(article_id));
    }


    @PostMapping("/comments")
    public Comment createComment(@RequestBody CommentReqeustDto commentReqeustDto) {
        Comment comment = new Comment(commentReqeustDto);
        return commentRepository.save(comment);
    }

    @PutMapping("/comments/{id}")
    public Long updateComment(@PathVariable Long id, @RequestBody CommentReqeustDto commentReqeustDto) {
        return commentService.update_comment(id, commentReqeustDto);
    }

    @DeleteMapping("/comments/{id}")
    public Long deleteComment(@PathVariable Long id) {
        commentRepository.deleteById(id);
        return id;
    }
}
