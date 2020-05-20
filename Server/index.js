const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
let grammar = require("./jison/grammar");

app.use(express.json());

app.use(cors());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
    next();
});

app.listen(port, () => {
    console.log("Backend initialized on port 3000. http://localhost:3000/")
})

app.get('/', function(req, res){
    console.log('Hola mundo desde Servidor');
    res.json({Msg: "Hola mundo desde mensaje"});
});

app.post('/parse', (req, res, next) => {
    var txt = req.body.main;
    var result = parser(txt);

    res.send({AST: result});
});

function parser(txt){
    try {
        return grammar.parse(txt);
    } catch (error) {
        return "Error en compilacion de Entrada " + error.toString();
    }
}