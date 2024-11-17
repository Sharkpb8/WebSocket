const socket = io();
const editorContainer = document.getElementById('editorContainer');
const connectedUsers = document.getElementById('connectedUsers');
let cursor;
let username;
let userid;
let curtext;

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
        socket.emit('create cursor',{cursor:userid})
        const status = document.getElementById("status");
        status.innerText = "Připojeno";
        editorContainer.setAttribute('contenteditable', 'true');
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

socket.on('create cursor', (data) => {
    newcursor(data.userid);
});


//odchozí
//vezme pozici myši a pošle ji
editorContainer.addEventListener('mousemove', (event) => {
    if(userid){
        cursor.style.left = event.clientX + 'px';
        cursor.style.top = event.clientY + 'px';
        cursor.style.display = 'block';
        socket.emit('cursor update', { position: { x: event.clientX, y: event.clientY },cursor: userid });
    }
});


//příchozí
//updatuje pozicic miši
socket.on('cursor update', (data) => {
    console.log(data.userid)
    othercursor  = document.getElementById(data.userid);
    othercursor.style.left = data.position.x + 'px';
    othercursor.style.top = data.position.y + 'px';
    othercursor.style.display = 'block';
});

//vytvoří nový cursor
function newcursor(color){
    const newDiv = document.createElement("div");
    document.body.appendChild(newDiv);
    if(!color){
        color = generate_color();
        console.log("color created")
        newDiv.className = "cursor";
        newDiv.style["background-color"]= color;
        newDiv.setAttribute('id',color)
        userid = color;
    }else{
        console.log("color created")
        newDiv.className = "cursor";
        newDiv.style["background-color"]= color;
        newDiv.setAttribute('id',color)
    }
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