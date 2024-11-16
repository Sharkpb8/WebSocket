const socket = io();
const editorContainer = document.getElementById('editorContainer');
const connectedUsers = document.getElementById('connectedUsers');
let cursor;
let username;
let userid;

//odchozí
// přidá k do listu users user se zadaným jmenem
document.getElementById('join').onclick = function() {
    username = document.getElementById('username').value;
    if (username) {
        socket.emit('new user', username);
        const inputfield = document.getElementById("username");
        inputfield.remove();
        const button = document.getElementById("join");
        button.remove();
        newcursor();
        cursor = document.getElementById(userid);
    }
};

//odchozí
//pošle editovaný text 
editorContainer.addEventListener('input', () => {
    socket.emit('text change', { text: editorContainer.innerText });
});

//příchozí
//update textu podle příchozího
socket.on('document update', (text) => {
    editorContainer.innerText = text;
});

//příchozí
//upraví list useru
socket.on('user list', (users) => {
    connectedUsers.innerHTML = 'Připojení uživatelé: ' + users.map(user => user.name).join(', ');
});


//odchozí
//vezme pozici myši a pošle ji
editorContainer.addEventListener('mousemove', (event) => {
    if(userid){
        cursor.style.left = event.clientX + 'px';
        cursor.style.top = event.clientY + 'px';
        cursor.style.display = 'block';
        socket.emit('cursor update', { position: { x: event.clientX, y: event.clientY } });
    }
});


//příchozí
//updatuje pozicic miši
socket.on('cursor update', (data) => {
    if (data.id !== socket.id) {
        cursor.style.left = data.position.x + 'px';
        cursor.style.top = data.position.y + 'px';
        cursor.style.display = 'block';
    }
});

//vytvoří nový cursor
function newcursor(){
    const newDiv = document.createElement("div");
    document.body.appendChild(newDiv);
    color = generate_color();
    newDiv.className = "cursor";
    newDiv.style["background-color"]= color;
    newDiv.setAttribute('id',color)
    userid = color;
}

//generuje barvu
function generate_color(){
    var letters = "0123456789ABCDEF"; 
    var color = '#';
    for(let i = 0; i<6;i++){
        color += letters[(Math.floor(Math.random() * 16))]; 
    }
    console.log(color);
    return color;
}