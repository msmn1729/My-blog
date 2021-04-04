package com.sparta.myblog.repository;

import com.sparta.myblog.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> , JpaSpecificationExecutor<Comment> {
    List<Comment> findAllByOrderByModifiedAtDesc();
//    Optional<Comment> findAllByArticle_id(Long article_id);
}
