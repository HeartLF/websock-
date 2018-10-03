const http = require('http').createServer();
const io = require('socket.io')(http);
var arr = [];
http.listen(8080);
io.on('connection', (socket) => {
    /*是否是新用户标识*/
    var isNewPerson = true;
    /*当前登录用户*/
    var username = null;
    /*监听登录*/
    socket.on('login', function(data) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].username === data.username) {
                isNewPerson = false
                break;
            } else {
                isNewPerson = true
            }
        }
        if (isNewPerson) {
            username = data.username
            arr.push({
                    username: data.username
                })
                /*登录成功*/
            socket.emit('loginSuccess', data)
                /*向所有连接的客户端广播add事件*/
            io.sockets.emit('add', data)
        } else {
            /*登录失败*/
            socket.emit('loginFail', '')
        }
    });
    socket.on('sendMessage', (data) => {
        io.sockets.emit('receiveMessage', data);
    })
    socket.on('disconnect', () => {
        io.sockets.emit('leave', username)
        arr.map((val, index) => {
            if (val.username === username) {
                arr.splice(index, 1);
            }
        })
    })
})