/////////////////index.html의 JS
$(document).ready(function () {
    // HTML 문서를 로드할 때마다 실행합니다.
    getMessages();
})

// 메모를 불러와서 보여줍니다.
function getMessages() {
    $.ajax({
        type: "GET",
        url: "/board",
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                let board = response[i]
                let id = board.id;
                let title = board.title;
                let username = board.username;
                let contents = board.contents;
                let modifiedAt = board.modifiedAt.split('T');
                modifiedAt[1] = modifiedAt[1].split('.')[0];
                addHTML(id, title, username, contents, modifiedAt);
            }
        }
    })
}

// 저장된 글을 볼 수 있도록 HTML로 그려줌
function addHTML(id, title, username, contents, modifiedAt) {
    let tempHtml = `<tr>
                                <td class="title">
                                    <a href="/detail.html?${id}">${title}</a>
                                </td>
                                <td class="name">${username}</td>
                                <td class="date">${modifiedAt[0]}<br>${modifiedAt[1]}</td>
                                <td class="hit">1234</td>
                            </tr>`;
    $('#board-box').append(tempHtml);
}

function onClickMovePostpage() {
    window.location.href = "/post.html";
}


/////////////////post.html의 JS

// 사용자가 내용을 올바르게 입력하였는지 확인합니다.
function isValidContents(contents) {
    if (contents === '') {
        alert('내용을 입력해주세요');
        return false;
    }
    if (contents.trim().length > 140) {
        alert('공백 포함 140자 이하로 입력해주세요');
        return false;
    }
    return true;
}

// 메모를 생성합니다.
function onClickWritePost() {
    let title = $('#title').val();
    let username = $('#username').val();
    let contents = $('#contents').val();

    if (isValidContents(contents) === false) {
        return;
    }

    let data = {'title': title, 'username': username, 'contents': contents};

    $.ajax({
        type: "POST",
        url: "/board",
        contentType: "application/json", // JSON 형식으로 전달함을 알리기
        data: JSON.stringify(data),
        success: function (response) {
            alert("게시글 등록성공!");
            window.location.href = "/index.html";
        }
    })
}

// 수정 버튼을 눌렀을 때, 기존 작성 내용을 textarea 에 전달합니다.
// 숨길 버튼을 숨기고, 나타낼 버튼을 나타냅니다.
function editPost(id) {
    showEdits(id);
    let contents = $(`#${id}-contents`).text().trim();
    $(`#${id}-textarea`).val(contents);
}

function showEdits(id) {
    $(`#${id}-editarea`).show();
    $(`#${id}-submit`).show();
    $(`#${id}-delete`).show();

    $(`#${id}-contents`).hide();
    $(`#${id}-edit`).hide();
}

function hideEdits(id) {
    $(`#${id}-editarea`).hide();
    $(`#${id}-submit`).hide();
    $(`#${id}-delete`).hide();

    $(`#${id}-contents`).show();
    $(`#${id}-edit`).show();
}

function onClickMainPage() {
    window.location.href = "/index.html";
}

///////////////////detail.html JS
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
                            <p style="text-align: left">${username}</p>
                            <p style="text-align: right">${modifiedAt[0]}<br>${modifiedAt[1]}</p>
                            <br><br>
                            <h3>${contents}</h3>
                            <br><br>
                            <p style="text-align: right">
                                <button type="button" class="btn btn-info" onclick="onClickMoveEditpage(${id})">수정하기</button>
                                <button type="button" class="btn btn-danger" onclick="onClickArticleDelete(${id})">삭제하기</button>
                            </p>`;
    $('#post-box').append(tempHtml);
}


// 게시글 수정페이지로 이동
function onClickMoveEditpage(id) {
    window.location.href = "/edit.html?" + id;
}

// 게시글 삭제
function onClickArticleDelete(id) {
    $.ajax({
        type: "DELETE",
        url: "/board/" + id,
        success: function (response) {
            alert("삭제 완료!");
            window.location.href = "/index.html";
        }
    });
}


//////////////////////////////// edit.html JS
function getEdit(id) {
    $.ajax({
        type: "GET",
        url: "/board/" + id,
        success: function (response) {
            let board = response;
            let id = board.id;
            let title = board.title;
            let username = board.username;
            let contents = board.contents;
            let modifiedAt = board.modifiedAt;
            addEditHTML(id, title, username, contents, modifiedAt);
        }
    })
}

// 저장된 글을 볼 수 있도록 HTML로 그려줌
function addEditHTML(id, title, username, contents, modifiedAt) {
    let tempHtml = `<div class="form-group">
                        <input id="title" class="form-control" value=${title}>
                    </div>
                    <div class="form-group">
                        <input id="username" class="form-control" value=${username}>
                    </div>
                    <div class="form-group">
                        <textarea id="contents" class="form-control" rows="3">${contents}</textarea>
                    </div>
                    <div style="text-align: right">
                        <button type="button" class="btn btn-success" onclick="onClickMainPage()">목록으로 이동</button>
                        <button type="button" class="btn btn-primary" onclick="onClickArticleEdit(${id})">수정완료</button>
                    </div>`;
    $('#post-box').append(tempHtml);
}

function onClickArticleEdit(id) {
    let title = $('#title').val();
    let username = $('#username').val();
    let contents = $('#contents').val();

    if (isValidContents(contents) === false) return;

    let data = {'title': title, 'username': username, 'contents': contents};

    $.ajax({
        type: "PUT",
        url: "/board/" + id,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (response) {
            alert("수정 완료!");
            window.location.href = "/index.html";
        }
    })
}
