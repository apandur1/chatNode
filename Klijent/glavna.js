var socket = io();

var form = document.getElementById('forma');
var input = document.getElementById('input');
let poruke = document.getElementById("poruke")

window.onload = function () {
    socket.emit("konekcija")
}

let konektovaniUser

let ajaxDajKorisnika = new XMLHttpRequest()
ajaxDajKorisnika.onreadystatechange = function () {
    if(ajaxDajKorisnika.readyState === 4 && ajaxDajKorisnika.status === 200) {
        let data = JSON.parse(ajaxDajKorisnika.response)
        konektovaniUser = data["korisnik"]
        socket.emit('chat message', "Selam " + konektovaniUser + ", kako si bruda")
    }
    else if(ajaxDajKorisnika.readyState === 4 && ajaxDajKorisnika.status === 404) {

    }
}
ajaxDajKorisnika.open("GET", "/korisnik")
ajaxDajKorisnika.send()

form.addEventListener('input', function (e) {
    if(input.value) {
        // socket.emit('chat message', konektovaniUser + " is typing")
        socket.emit("typing", konektovaniUser + " is typing")
    }
})

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', konektovaniUser + ": " + input.value);
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    poruke.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("typing", (msg) => {
    let typing = document.getElementById("nevidljivTyping")
    typing.id = "vidljivTyping"
    typing.textContent = msg
    setTimeout(function () {
        typing.id = "nevidljivTyping"
    }, 1000)
})

socket.on("konekcija", () => {
    let ajaxDajOnline = new XMLHttpRequest()
    ajaxDajOnline.onreadystatechange = function () {
        if(ajaxDajOnline.readyState === 4 && ajaxDajOnline.status === 200) {
            let data = JSON.parse(ajaxDajOnline.response)
            let lista = document.getElementById("onlineKorisnici")
            lista.innerHTML = ""
            data.forEach(element => {
                let item = document.createElement("li")
                item.textContent = element['nickname']
                lista.appendChild(item)
            })
        }
        else if(ajaxDajOnline.readyState === 4 && ajaxDajOnline.status === 404) {

        }
    }
    ajaxDajOnline.open("GET", "/onlineKorisnici")
    ajaxDajOnline.send()
})