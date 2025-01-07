"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');
　
// 投稿ボタンの処理
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {
        method: "POST",
        body: 'name=' + name + '&message=' + message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log(params);
    const url = "/post";
    fetch(url, params)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then((response) => {
            console.log(response);
            document.querySelector('#message').value = "";
        });
});

// 投稿チェックボタンの処理
document.querySelector('#check').addEventListener('click', () => {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch(url, params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            let value = response.number;
            if (number != value) {
                const params = {
                    method: "POST",
                    body: 'start=' + number,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                const url = "/read";
                fetch(url, params)
                    .then(response => {
                        if (!response.ok) throw new Error('Error');
                        return response.json();
                    })
                    .then(response => {
                        number += response.messages.length;
                        for (let mes of response.messages) {
                            let cover = document.createElement('div');
                            cover.className = 'cover';
                        
                            // 投稿IDの表示
                            let id_area = document.createElement('span');
                            id_area.className = 'id';
                            id_area.innerText = `ID: ${mes.id} `;
                        
                            // 名前の表示
                            let name_area = document.createElement('span');
                            name_area.className = 'name';
                            name_area.innerText = mes.name;
                        
                            // メッセージの表示
                            let mes_area = document.createElement('span');
                            mes_area.className = 'mes';
                            mes_area.innerText = mes.message;
                        
                            // リアクションの表示
                            let reactions_area = document.createElement('div');
                            reactions_area.className = 'reactions';
                            reactions_area.innerText = `👍: ${mes.reactions.like} 👎: ${mes.reactions.negative}`;
                        
                            cover.appendChild(id_area);
                            cover.appendChild(name_area);
                            cover.appendChild(mes_area);
                            cover.appendChild(reactions_area); // リアクションを追加
                        
                            bbs.appendChild(cover);
                        }
                        
                    });
            }
        });
});

// 削除ボタンの処理
document.querySelector('#delete').addEventListener('click', () => {
    const postId = document.querySelector('#delete-id').value;

    const params = {
        method: "POST",
        body: 'postId=' + postId,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    fetch("/delete", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            console.log(response);
            alert("削除しました: " + JSON.stringify(response.post));
        });
});

// 返信ボタンの処理
document.querySelector('#reply').addEventListener('click', () => {
    const parentId = document.querySelector('#reply-id').value;
    const name = document.querySelector('#reply-name').value;
    const message = document.querySelector('#reply-message').value;

    const params = {
        method: "POST",
        body: `parentId=${parentId}&name=${name}&message=${message}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    fetch("/reply", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            console.log(response);
            alert("返信が投稿されました: " + JSON.stringify(response.reply));
        });
});

// リアクションボタンの処理
document.querySelector('#react').addEventListener('click', () => {
    const postId = document.querySelector('#react-id').value;
    const reaction = document.querySelector('#reaction').value;

    const params = {
        method: "POST",
        body: `postId=${postId}&reaction=${reaction}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    fetch("/react", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            console.log(response);

            // 対象の投稿のリアクション数を更新
            const postElement = Array.from(document.querySelectorAll('.cover'))
                .find(el => el.querySelector('.id').innerText.includes(`ID: ${postId}`));

            if (postElement) {
                const reactionsArea = postElement.querySelector('.reactions');
                reactionsArea.innerText = `👍: ${response.reactions.like} 👎: ${response.reactions.negative}`;
            }

            alert("リアクションが更新されました");
        });
});

