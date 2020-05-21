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

let CopyClasses = new Array();
let CopyMethods = new Array();
let CopyVariables = new Array();

app.post('/parse', (req, res, next) => {
    var txtMain = req.body.main;    
    var txtCopy = req.body.copy;

    var resultMain = parser(txtMain);
    var resultCopy = parser(txtCopy);

    compareAll(resultMain.AST.LISTA_CLASES, resultCopy.AST.LISTA_CLASES);

    res.send(
        {
            Main: {
                AST: resultMain.AST,
                LE: resultMain.LEXICAL_ERRORS, 
                SE: resultMain.SINTACTICAL_ERRORS
            },
            Copy: {
                AST: resultCopy.AST,
                LE: resultCopy.LEXICAL_ERRORS, 
                SE: resultCopy.SINTACTICAL_ERRORS
            },
            Reports: {
                ClassReport: CopyClasses,
                MethodsReport: CopyMethods,
                VariablesReport: CopyVariables
            }
        }
    );
});

function parser(txt){
    try {
        return grammar.parse(txt);
    } catch (error) {
        return "Error en compilacion de Entrada " + error.toString();
    }
}

function compareAll(main, copy){
    console.log("Comparando todo");
    let claseMain = main;
}

function compareClasses(mainClass, copyClass){
    console.log("Comparando clases");
}

function compareMethods(mainMethod, copyMethod){
    console.log("Comparando metodos y funciones");
}

function compareVariables(mainVariable, copyVariable){
    console.log("Comparando variables");
}
