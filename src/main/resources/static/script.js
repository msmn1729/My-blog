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
                let modifiedAt = board.modifiedAt;
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
                                <td class="date">${modifiedAt}</td>
                                <td class="hit">1234</td>
                            </tr>`;
    $('#board-box').append(tempHtml);
}

function onClickWritePost() {
    window.location.href = "/post.html";
}


/////////////////post.html의 JS

// 사용자가 내용을 올바르게 입력하였는지 확인합니다.
function isValidContents(contents) {
    if (contents === '') {
        board('내용을 입력해주세요');
        return false;
    }
    if (contents.trim().length > 140) {
        board('공백 포함 140자 이하로 입력해주세요');
        return false;
    }
    return true;
}

// 메모를 생성합니다.
function writePost() {
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
            let modifiedAt = board.modifiedAt;
            addDetailHTML(id, title, username, contents, modifiedAt);
        }
    })
}

// 저장된 글을 볼 수 있도록 HTML로 그려줌
function addDetailHTML(id, title, username, contents, modifiedAt) {
    let tempHtml = `<h1>${title}</h1>
                            <p style="text-align: left">${username}</p>
                            <p style="text-align: right">${modifiedAt}</p>
                            <br><br>
                            <h3>${contents}</h3>
                            <br><br>
                            <p style="text-align: right">
                                <button type="button" class="btn btn-info" onclick="onClickArticleModify(${id})">수정하기</button>
                                <button type="button" class="btn btn-danger" onclick="onClickArticleDelete(${id})">삭제하기</button>
                            </p>`;
    $('#post-box').append(tempHtml);
}


// 게시글 수정
function onClickArticleModify(id) {

    window.location.href = "/edit.html?" + id;

    // // 1. 작성 대상 메모의 username과 contents 를 확인합니다.
    // let username = $(`#${id}-username`).text().trim();
    // let contents = $(`#${id}-textarea`).val().trim();
    //
    // // 2. 작성한 메모가 올바른지 isValidContents 함수를 통해 확인합니다.
    // if (isValidContents(contents) == false) {
    //     return;
    // }
    //
    // // 3. 전달할 data JSON으로 만듭니다.
    // let data = {'username': username, 'contents': contents};
    //
    // // 4. PUT /api/memos/{id} 에 data를 전달합니다.
    // $.ajax({
    //     type: "PUT",
    //     url: "/board/" + id,
    //     data: JSON.stringify(data),
    //     contentType: 'application/json',
    //     success: function (response) {
    //         alert("수정 완료!");
    //         window.location.href = "/index.html";
    //     }
    // })
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
                        <button type="button" class="btn btn-primary" onclick="writePost()">등록하기</button>
                    </div>`;
    $('#post-box').append(tempHtml);
}
