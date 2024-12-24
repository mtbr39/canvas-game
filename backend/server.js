const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

const userData = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('a user disconnected:', socket.id);
        const deleteUserData = userData[socket.id];
        io.emit('userDisconnected', { id: socket.id, data: deleteUserData });
        delete userData[socket.id];

        // id順で偶然最初のuserをisHost=trueにする
        const firstKey = Object.keys(userData)[0];
        if (firstKey) {
            userData[firstKey].isHost = true;
        }

        io.emit('currentUserData', userData);
    });

    // 汎用データを追加するイベント
    socket.on('updateUserData', (data) => {
        if (!userData[socket.id]) {
            userData[socket.id] = {};
        }
        Object.assign(userData[socket.id], data);
        io.emit('userDataUpdated', { socketId: socket.id, data: userData[socket.id] });
    });

    // クライアントに現在の汎用データを送信
    socket.emit('currentUserData', userData);
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
