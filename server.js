require('dotenv').config();

var express = require('express');

var webapp = express();
var server = require('http').createServer(webapp);

var io = require('socket.io')(server);

webapp.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});
//===== router đang phát triển trong tương lai ======
webapp.get('/login', function (req, res) {
    res.sendFile(__dirname + '/view/login.html')
});
//===================================================
webapp.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/view/chat_client.html')
});

webapp.use(express.static(__dirname + '/public'));
webapp.use(express.static(__dirname + '/view'));
webapp.use(express.static(__dirname + '/styles'));
webapp.use(express.static(__dirname + '/js'));

var listuser = [];
io.on('connection', function (client) {
    var user = '';
    // console.log('client connect ...')
    client.on('join', function (data) {
        // console.log(data);
    });

    client.on('sendName', function (nameUser) {
        user = nameUser;
        if (listuser.length == 0) {
            console.log(nameUser + ' ' + client.id + ` connect server !!!`)
            listuser.push({ userName: user })
            client.emit('sendName', listuser);
            client.broadcast.emit('sendName', listuser)
            client.emit('Notification', 'Bạn đã tham gia room chat thành công')
            console.log(listuser)

        } else {
            let ktr_userName = listuser.filter(e => {
                return e.userName === nameUser
            })
            if (ktr_userName.length !== 0) {
                client.emit('errUserName')
            } else {
                console.log(nameUser + ` connect server !!!`)
                listuser.push({ userName: user })
                client.emit('sendName', listuser);
                client.broadcast.emit('sendName', listuser)
                client.emit('Notification', 'Bạn đã tham gia room chat thành công')
                console.log(listuser)
            }
        }

    })

    client.on('sendDataMess', function (data) {
        client.emit('sendDataMess', data);
        client.broadcast.emit('sendDataMess', data)
        console.log(data)
    })
    client.on('disconnect', function (sk) {
        console.log(user + ' ' + client.id + ` disconnect !!!`);
        client.emit('userDisconnect', user);
        client.broadcast.emit('userDisconnect', user);

        listuser = listuser.filter((remowUser) => {
            return remowUser.userName !== user;
        })
        client.broadcast.emit('sendName', listuser);
    })
})
server.listen(7788);

