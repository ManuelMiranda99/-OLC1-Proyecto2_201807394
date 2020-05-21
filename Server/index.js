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

    compareClasses(resultMain.AST.LISTA_CLASES, resultCopy.AST.LISTA_CLASES);

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

function compareClasses(main, _copy){
    /* DECLARATION OF VARIABLES */
    let actual, Mclass, copy, Cclass, AuxiliarIDs, auxMI, auxCI, Mmethod, Cmethod, COUNT=0;
    console.log("Comparando clases...");

    /* Start variables to loop through the main classes */
    actual = main;
    if(actual != undefined){
        Mclass = main.CLASE;
    }
    /* Traveling through each main class */
    while(actual != undefined){
        
        /* Start variables to loop through the copy classes */
        copy = _copy;
        if(copy != undefined){
            Cclass = copy.CLASE;
        }
        /* Traveling through each copy class */
        while(copy != undefined){
            if(Mclass.ID === Cclass.ID){
                if(CountMethodsAndFunctions(Mclass.INSTRUCCIONES) === CountMethodsAndFunctions(Cclass.INSTRUCCIONES)){
                    AuxiliarIDs = new Array();                  // Check if the method isnt already in compare classes or compare methods/fun
                    // Compare Classes Methods
                    console.log("Misma cantidad de metodos/funciones");
                    
                    COUNT = 0;
                    auxMI = Mclass.INSTRUCCIONES;
                    if(auxMI != undefined){
                        Mmethod = auxMI.SENTENCIA;
                    }                    
                    while(auxMI != undefined){

                        if(IsFunOrMet(Mmethod)){

                            auxCI = Cclass.INSTRUCCIONES;
                            if(auxCI != undefined){
                                Cmethod = auxCI.SENTENCIA;
                            }

                            while(auxCI != undefined){

                                if(IsFunOrMet(Cmethod)){
                                    // Compare types and ID
                                    if(Cmethod.ID === Mmethod.ID && Cmethod.TIPO === Mmethod.TIPO && !AuxiliarIDs.includes(Mmethod.ID)){                                        
                                        COUNT++;
                                        AuxiliarIDs.push(Cmethod.ID);                                        
                                        // Copy method
                                        break;
                                    }
                                }

                                auxCI = auxCI.SENTENCIAS;
                                if(auxCI != undefined){
                                    Cmethod = auxCI.SENTENCIA;
                                }
                            }

                        }                        

                        auxMI = auxMI.SENTENCIAS;
                        if(auxMI != undefined){
                            Mmethod = auxMI.SENTENCIA;
                        }

                    }                    
                    if(COUNT === CountMethodsAndFunctions(Mclass.INSTRUCCIONES)){
                        PushClass(Mclass, COUNT);
                    }
                }
            }
            copy = copy.CLASES;
            if(copy != undefined){
                Cclass = copy.CLASE;
            }
        }

        actual = actual.CLASES;
        if(actual != undefined){
            Mclass = actual.CLASE;
        }
    }
}

function compareMethods(main, _copy, classID){

}

function compareVariables(main, _copy, classID, methodID){

}

function CountMethodsAndFunctions(Minstructions){
    if(Minstructions == undefined){
        return 0;
    }
    let actual = Minstructions, method = Minstructions.SENTENCIA;    
    let count = 0;
    while(actual != undefined){
        if(IsFunOrMet(method))
            count++;
        actual = actual.SENTENCIAS;
        if(actual != undefined)
            method = actual.SENTENCIA;
    }
    return count;
}

function IsFunOrMet(sentence){
    if(sentence.TIPO_SENTENCIA === "METHOD" || sentence.TIPO_SENTENCIA === "FUNCTION"){
        return true;
    }
    return false;
}

function PushClass(_class, _count){
    CopyClasses.push(
        {
            NOMBRE: _class.ID,
            NUMERO_FUN_MET: _count
        }
    );
}

function PushMethod(method, _class){
    CopyMethods.push(
        {
            TIPO: method.TIPO,
            NOMBRE: method.ID,
            PARAMETROS: method.PARAMETROS,
            CLASE: _class
        }
    );
}

function PushVariable(type, variable, method, _class){
    CopyVariables.push(
        {
            TIPO: type,
            NOMBRE: variable.ID,
            FUN_MET: method,
            CLASE: _class
        }
    );
}
