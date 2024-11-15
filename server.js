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

io.on('connection', (socket) => {
    console.log('User connected');
    
    // Přidání nového uživatele
    socket.on('new user', (username) => {
        users.push({ id: socket.id, name: username });
        io.emit('user list', users);
        io.emit('document update', documentText); // Pošleme dokument novému uživateli
    });

    // Příjem úpravy textu
    socket.on('text change', (data) => {
        documentText = data.text;
        socket.broadcast.emit('document update', documentText);
    });

    // Zpracování odpojení uživatele
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        users = users.filter(user => user.id !== socket.id);
        io.emit('user list', users);
    });

    // Zpracování kurzoru
    socket.on('cursor update', (data) => {
        socket.broadcast.emit('cursor update', { id: socket.id, position: data.position });
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


