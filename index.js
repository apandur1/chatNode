let express = require("express")
const app = express()
const http = require('http').Server(app);
let bodyParser = require("body-parser")
const io = require("socket.io")(http)
let fs = require('fs');

// app.use(express.static('public'))
app.use('/', express.static(__dirname + '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/Static/pocetna.html")
})

app.get("/korisnik", function (req, res) {
    let sadrzaj = []
    fs.readFile("./Pomocni fileovi/korisnik.txt", async function (error, data) {
        sadrzaj = String(data).split(/[\n\r]+/g).filter(s => s !== "")
        res.json({korisnik: sadrzaj[0]})
    })

})

app.get("/onlineKorisnici", function (req, res) {
    fs.readFile("./Pomocni fileovi/onlineKorisnici.txt", function (error, data) {
        let json = []
        let onlineKorisnici = String(data).split(/[\n\r]+/g).filter(s => s !== "")
        onlineKorisnici.forEach(element => {
            json.push({'nickname': element})
        })
        res.json(json)
    })
})

app.post("/korisnik", function (req, res) {
    let tijelo = req.body
    fs.writeFile('./Pomocni fileovi/korisnik.txt', tijelo['korisnik'],function (error, data) {
        if(error)
            throw error
    })
    fs.appendFile("./Pomocni fileovi/onlineKorisnici.txt", tijelo['korisnik'] + "\n", function (error) {
        if (error)
            throw error
    })
    res.json({message: "Valja"})
})

app.delete("/korisnik", function (req, res) {
    fs.writeFile('./Pomocni fileovi/korisnik.txt', "",function (error, data) {
        if(error)
            throw error
    })
    res.json({message: "Valja"})
})

app.delete("/korisnik/:ime", function (req, res) {
    let tekst = ""
    fs.readFile("./Pomocni fileovi/onlineKorisnici.txt", function (error, data) {
        let korisnici = String(data).split(/[\n\r]+/g).filter(s => s !== "")
        korisnici.filter(s => s !== req.params.ime)
        let niz = korisnici
        niz.forEach(element => {
            tekst += element
        })
    })
    fs.writeFile("./Pomocni fileovi/onlineKorisnici.txt", tekst, function (error, data) {
        if(error)
            throw error
    })
})

io.on('connection', (socket) => {
    console.log('Konektovan')
    socket.on("konekcija", () => {
        io.emit("konekcija")
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    });
    socket.on("typing", (msg) => {
        socket.broadcast.emit("typing", msg)
    })
})

http.listen(6969)

module.exports = app