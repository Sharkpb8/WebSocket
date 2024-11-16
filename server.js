const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];
let documentText = "";

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html
});


//při připojení
io.on('connection', (socket) => {
    console.log('User connected');

    //odchozí
    // přijme nového uživatele přidá do listu a ten pošle
    socket.on('new user', (username) => {
        users.push({ id: socket.id, name: username });
        io.emit('user list', users);
        io.emit('document update', documentText); // Pošleme dokument novému uživateli
    });

    //odchozí
    // přijme upravený text a rozešle ho
    socket.on('text change', (data) => {
        documentText = data.text;
        socket.broadcast.emit('document update', documentText);
    });

    //odchozí
    // při odpojení smaže usera z listu a ten pošle
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users = users.filter(user => user.id !== socket.id);
        io.emit('user list', users);
    });

    //odchozí
    // přijme pozici myši a tu pošle
    socket.on('cursor update', (data) => {
        socket.broadcast.emit('cursor update', { userid: data.cursor, position: data.position });
    });

    socket.on('create cursor', (data) => {
        socket.broadcast.emit('create cursor', { userid: data.cursor });
    });
});


server.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});


