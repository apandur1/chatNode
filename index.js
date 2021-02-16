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
    fs.readFile("./korisnik.txt", async function (error, data) {
        sadrzaj = String(data).split(/[\n\r]+/g).filter(s => s !== "")
        res.json({korisnik: sadrzaj[0]})
    })

})

app.post("/korisnik", function (req, res) {
    let tijelo = req.body
    fs.writeFile('./korisnik.txt', tijelo['korisnik'],function (error, data) {
        if(error)
            throw error
    })
    res.json({message: "Valja"})
})

app.delete("/korisnik", function (req, res) {
    fs.writeFile('./korisnik.txt', "",function (error, data) {
        if(error)
            throw error
    })
    res.json({message: "Valja"})
})

io.on('connection', (socket) => {
    console.log('Konektovan')
    socket.broadcast.emit('hi');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    });
})

http.listen(3000)

module.exports = app