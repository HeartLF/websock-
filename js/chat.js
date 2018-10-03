var socket = io('ws://localhost:8080');
var name = null;

var login = document.getElementById('btn');

login.addEventListener('click', () => {
    name = document.querySelector('#loginName').value;
    if (name) {
        socket.emit('login', {
            username: name
        })
    } else {
        alert('请输入昵称');
    }
})
socket.on('loginSuccess', (data) => {
    if (data.username == name) {
        document.querySelector('.login-wrap').style.display = 'none';
        document.getElementsByClassName('chat-wrap')[0].style.display = 'block';
    } else {
        alert('用户名不匹配，请重新输入');
    }
})
socket.on('loginFail', (data) => {
    alert('昵称重复');
})

socket.on('add', (data) => {
    var html = '<p>系统消息:' + data.username + '已加入群聊</p>';
    document.querySelector('.chat-con').innerHTML += html;
})

document.querySelector('.sendBtn').addEventListener('click', () => {

    var txt = document.querySelector('#sendtxt').value;

    document.querySelector('#sendtxt').value = '';
    if (txt) {
        socket.emit('sendMessage', {
            username: name,
            message: txt
        })
    }
})
socket.on('receiveMessage', function(data) {
    showMessage(data)
})
socket.on('leave', (name) => {
    if (name != null) {
        var html = '<p>FBI warning:' + name + '已退出群聊</p>';
        document.querySelector('.chat-con').innerHTML += html;
    }
})

function showMessage(data) {
    var html
    if (data.username === name) {
        html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">' + data.message + '</span></div>'
    } else {
        html = '<div class="chat-item item-left clearfix rela"><span class="abs uname">' + data.username + '</span><span class="img fl"></span><span class="fl message">' + data.message + '</span></div>'
    }
    document.querySelector('.chat-con').innerHTML += html;
}