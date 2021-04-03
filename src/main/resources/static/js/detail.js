$(document).ready(function () {
    // HTML 문서를 로드할 때마다 실행합니다.
    let id = window.location.search.substring(1); // 쿼리스트링 맨 앞에 ?제거
    getDetail(id);
    getComment(id);
})


/////////////////// 이전 detail.html JS
// 메모를 불러와서 보여줍니다.
function getDetail(id) {
    $.ajax({
        type: "GET",
        url: "/board/" + id,
        success: function (response) {
            let board = response;
            let id = board.id;
            let title = board.title;
            let username = board.username;
            let contents = board.contents;
            let modifiedAt = board.modifiedAt.split('T');
            modifiedAt[1] = modifiedAt[1].split('.')[0];
            addDetailHTML(id, title, username, contents, modifiedAt);
        }
    })
}

// 저장된 글을 볼 수 있도록 HTML로 그려줌
function addDetailHTML(id, title, username, contents, modifiedAt) {
    let tempHtml = `<h1>${title}</h1>
                    <p id="writername" style="text-align: left">${username}</p>
                    <p style="text-align: right">${modifiedAt[0]}<br>${modifiedAt[1]}</p>
                    <br><br>
                    <h3>${contents}</h3>
                    <br><br>
                    <p style="text-align: right">
                    <button type="button" class="btn btn-success" onclick="window.location.href = '/'">목록으로 이동</button>
                    <button type="button" class="btn btn-info" onclick="onClickMoveEditpage(${id})">수정하기</button>
                    <button type="button" class="btn btn-danger" onclick="onClickArticleDelete(${id})">삭제하기</button>
                    </p>`;
    $('#post-box').append(tempHtml);
}


// 댓글
function getComment(id) {
    $.ajax({
        type: 'GET',
        url: `/comment/${id}`,
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                console.log(response[i]);
                let comment = response[i];
                let tempHtml = addComments(comment)
                $('.comment__card-box').append(tempHtml);
            }
        }
    });
}

function addComments(comment) {
    let modifiedAt = comment.modifiedAt.split('T');
    modifiedAt[1] = modifiedAt[1].split('.')[0];
    modifiedAt = modifiedAt[0] + ' ' + modifiedAt[1];

    return `<div class="comment__card">
            <div class="comment__card-header">
              <span id="${comment.id}-comment_user">${comment.username}</span><span class="comment-date">${modifiedAt}</span>
              <div style="text-align: right">
                    <button type="button" class="btn btn-info" onclick="edit_start_comment(${comment.id})">수정</button>
                    <button type="button" class="btn btn-outline-info" onclick="edit_comment(${comment.id})">완료</button>
                    <button type="button" class="btn btn-danger" onclick="delete_comment(${comment.id})">삭제</button>
              </div>
            </div>
            <div class="comment__card-body">
              <div class="edit-comment-wrap">
                <div id="${comment.id}-comment" class="comment">${comment.contents}</div>
                <textarea
                  class="edit-comment-textarea"
                  id="${comment.id}-edit-comment-textarea"
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
            </div>
          </div>`;

}


// 게시글 수정
function onClickMoveEditpage(id) {
    let writername = $('#writername').text() // 글쓴이 아이디
    let username = $('#username').text() // 현재 접속한 아이디
    if (writername !== username) {
        alert("자신이 작성한 글만 수정할 수 있습니다!")
        return;
    }
    window.location.href = "/edit.html?" + id;
}

// 게시글 삭제
function onClickArticleDelete(id) {
    let username = $('#writername').text() // 글쓴이 아이디
    let cur_username = $('#username').text() // 현재 접속한 아이디
    if (cur_username !== username) {
        alert("자신이 작성한 글만 삭제할 수 있습니다!")
        return;
    }
    $.ajax({
        type: "DELETE",
        url: "/board/" + id,
        success: function (response) {
            alert("삭제 완료!");
            window.location.href = "/";
        }
    });
}

function showHide() {
    $('#edit').on('click', function () {
        let writername = $('#writername').text() // 글쓴이 아이디
        let username = $('#username').text() // 현재 접속한 아이디
        if (writername !== username) {
            alert("자신이 작성한 글만 수정할 수 있습니다!")
            return;
        }
        $('.detail').hide()
        $('.detail__edit').show()
        let title = $('.title').text()
        let contents = $('.contents').text().trim()
        let author = $('.post-author').text().trim()
        $('.post-author-edit').text(author)
        $('.detail-input').val(title)
        $('.detail-textarea').val(contents)
    })
    $('.cancel').on('click', function () {
        $('.detail').show()
        $('.detail__edit').hide()
        $('.detail-input').val('')
        $('.detail-textarea').val('')
    })
}

function create_comment() {
    let article_id = location.search.split('?')[1]
    let name = $('#username').text();
    let contents = $('#comment-contents').val();
    if (!name || $('.link-signup').text() === '로그인 하러 가기') {
        alert("로그인을 하셔야 댓글을 달수 있습니다!")
        return;
    }
    if (contents === '') {
        alert("댓글을 적어주세요!!")
        return
    }
    let data = {'article_id': article_id, 'username': name, 'contents': contents};

    $.ajax({
        type: 'POST',
        url: '/comments',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log(data)
            alert('댓글이 성공적으로 작성되었습니다!')
            window.location.reload();
        }

    })
}

function edit_start_comment(id) {
    let comment_writername = $(`#${id}-comment_user`).text() // 댓글쓴이 아이디
    let username = $('#username').text() // 현재 접속한 아이디
    if (comment_writername !== username) {
        alert("자신이 작성한 댓글만 수정할 수 있습니다!")
        return;
    }
    // $(`#${id}-befor`).hide()
    // $(`#${id}-after`).show()
    $(`#${id}-edit-comment-textarea`).show() // 수정창 오픈
    $(`#${id}-comment`).hide()
    $(`#${id}-edit-comment-textarea`).val($(`#${id}-comment`).text())

}

function edit_comment(id) {
    let article_id = location.search.split('?')[1]
    let comment_writername = $(`#${id}-comment_user`).text() // 댓글쓴이 아이디
    let username = $('#username').text() // 현재 접속한 아이디
    if (comment_writername !== username) {
        alert("자신이 작성한 댓글만 수정할 수 있습니다!")
        return;
    }
    let contents = $(`#${id}-edit-comment-textarea`).val()
    let data = {'article_id': article_id, 'username': username, 'contents': contents}

    $.ajax({
        type: 'PUT',
        url: `/comments/${id}`,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            alert('댓글이 수정 되었습니다.')
            window.location.reload();
        }
    })
}


function edit_end_comment(id) {
    $(`#${id}-befor`).show()
    $(`#${id}-after`).hide()

    $(`#${id}-edit-comment-textarea`).hide()
    $(`#${id}-comment`).show()
    $(`#${id}-edit-comment-textarea`).val('')
}

function delete_comment(id) {
    let writername = $('#writername').text() // 글쓴이 아이디
    let username = $('#username').text() // 현재 접속한 아이디
    if (writername !== username) {
        alert("자신이 작성한 댓글만 삭제할 수 있습니다!")
        return;
    }
    $.ajax({
        type: 'DELETE',
        url: `/comments/${id}`,
        success: function (response) {
            alert('댓글이 삭제 되었습니다.')
            window.location.reload();
        }
    })
}

