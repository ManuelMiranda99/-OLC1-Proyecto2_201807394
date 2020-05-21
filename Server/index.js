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
let AuxiliarIDs = new Array();                  // Check if the method isnt already in compare classes or compare methods/fun
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
    let actual = main;
    let mainClass = actual.CLASE;
    while(actual.CLASES != undefined){


        let actualCopy = copy;
        let copyClass = actualCopy.CLASE;
        while(actualCopy.CLASES != undefined){


            actualCopy = actualCopy.CLASES;
            copyClass = actualCopy.CLASE;
        }

        actual = actual.CLASES;
        mainClass = actual.CLASE;
    }
}

function PushClass(_class, _count){
    CopyClasses.push(
        {
            NOMBRE: _class.ID,
            NUMERO_FUN_MET: _count
        }
    );
}

function compareMethods(method, _class){
    CopyMethods.push(
        {
            TIPO: method.TIPO,
            NOMBRE: method.ID,
            PARAMETROS: method.PARAMETROS,
            CLASE: _class
        }
    );
}

function compareVariables(type, variable, method, _class){
    CopyVariables.push(
        {
            TIPO: type,
            NOMBRE: variable.ID,
            FUN_MET: method,
            CLASE: _class
        }
    );
}
