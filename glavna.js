var socket = io();

var form = document.getElementById('forma');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    poruke.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});