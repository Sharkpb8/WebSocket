const socket = io();
const editorContainer = document.getElementById('editorContainer');
const status = document.getElementById('status');
const connectedUsers = document.getElementById('connectedUsers');
const cursor = document.getElementById('cursor');
let username;

document.getElementById('join').onclick = function() {
    username = document.getElementById('username').value;
    if (username) {
        socket.emit('new user', username);
    }
};

editorContainer.addEventListener('input', () => {
    socket.emit('text change', { text: editorContainer.innerText });
});

socket.on('document update', (text) => {
    editorContainer.innerText = text;
});

socket.on('user list', (users) => {
    connectedUsers.innerHTML = 'Připojení uživatelé: ' + users.map(user => user.name).join(', ');
});

socket.on('connect', () => {
    status.innerText = 'Připojeno ke serveru';
});

socket.on('disconnect', () => {
    status.innerText = 'Odpojeno od serveru';
});

editorContainer.addEventListener('mousemove', (event) => {
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    cursor.style.display = 'block';
    socket.emit('cursor update', { position: { x: event.clientX, y: event.clientY } });
});

socket.on('cursor update', (data) => {
    if (data.id !== socket.id) {
        cursor.style.left = data.position.x + 'px';
        cursor.style.top = data.position.y + 'px';
        cursor.style.display = 'block';
    }
});