package com.sparta.myblog.service;

import com.sparta.myblog.domain.Board;
import com.sparta.myblog.domain.BoardRepository;
import com.sparta.myblog.domain.BoardRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    @Transactional
    public Long update(Long id, BoardRequestDto requestDto) {
        Board board = boardRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("찾으려는 ID가 없습니다.")
        );
        board.update(requestDto);
        return id;
    }
}
