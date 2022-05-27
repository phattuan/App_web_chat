
var express = require('express');
require('dotenv/config')
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

var listUser = [];
var idUser = 0;
io.on('connection', function (client) {
    var user = '';
    // console.log('client connect ...')
    client.on('join', function (data) {
        // console.log(data);
    });

    client.on('sendName', function (nameUser) {
        var idImageUser = Math.ceil(Math.random() * 10);
        user = nameUser;
        idUser = client.id;
        client.emit('imageUser', idImageUser);
        if (listUser.length == 0) {
            console.log(nameUser + ' ' + client.id + ` connect server !!!`)
            listUser.push({ userName: user, idImageUser: idImageUser, idUser: idUser })
            client.emit('sendName', listUser);
            client.broadcast.emit('sendName', listUser)
            client.emit('Notification', 'Bạn đã tham gia room chat thành công')
            client.emit('nameSuccess');
            console.log(listUser)

        } else {
            let ktr_userName = listUser.filter(e => {
                return e.userName === nameUser
            })
            if (ktr_userName.length !== 0) {
                client.emit('errUserName', idUser)
                console.log(ktr_userName)
                console.log(nameUser)
            } else {
                console.log(nameUser + ` connect server !!!`)
                listUser.push({ userName: user, idImageUser: idImageUser, idUser: idUser })
                client.emit('sendName', listUser);
                client.broadcast.emit('sendName', listUser)
                client.emit('Notification', 'Bạn đã tham gia room chat thành công')
                client.emit('nameSuccess');
                console.log(listUser)
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

        listUser = listUser.filter((remowUser) => {
            return remowUser.idUser !== client.id;
        })
        client.broadcast.emit('sendName', listUser);
        console.log(listUser)

    })
})
server.listen(process.env.PORT || 7788);

