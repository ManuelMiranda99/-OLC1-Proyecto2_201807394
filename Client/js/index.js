// INFO: AST only for the main code
// INFO: Errors for both codes
var countOfTabs = 0;
var copyEditorList = new Array();
var filesList = new Array();
var actualEditor;
var actualName = "";
var nameOfMainFile = "";

function getCount(){
    return this.countOfTabs++;
}

var focusTab = "";
function getActualTab(){
    return focusTab;
}

function setActualTab(tab){
    focusTab = tab;
    actualEditor = copyEditorList[tab];
    actualName = filesList[tab];
}

function newTab(name){    
    if(name === 'Tab'){
        name = 'Tab' + countOfTabs + '.java';
    }    
    $('<li class="nav-item copyTabDefault"><a href="#tab'+countOfTabs+'" data-toggle="tab" class="nav-link copyTabDefault" onclick="setActualTab(' + countOfTabs + ')" id="selectTab' + countOfTabs + '">' + name + '</a></li>').appendTo('#tabsS');    
    
    $('<div class="tab-pane" id="tab' + countOfTabs + '"style="font-size: 17px;width: 100%;height: 277px;"><div class="list-group Editor" id="tab' + countOfTabs + '"></div></div>').appendTo('.tab-content');

    $('#tabsS a:last').tab('show');

    var newEditor = ace.edit("tab" + countOfTabs);
    newEditor.setTheme("ace/theme/twilight");
    newEditor.session.setMode("ace/mode/java");
    newEditor.setFontSize("17px");

    copyEditorList.push(newEditor);
    filesList.push(name);

    setActualTab(countOfTabs);

    countOfTabs++;
}

function openFile(files){
    var file = files[0];
    newTab(file.name);
    var reader = new FileReader();
    reader.onload = function(e){        
        actualEditor.setValue(e.target.result);
    };
    reader.readAsText(file);
    file.clear;
}

function openMainFile(files){
    var file = files[0];
    nameOfMainFile = file.name;
    var reader = new FileReader();
    reader.onload = function(e){
        mainEditor.setValue(e.target.result);        
    };
    reader.readAsText(file);
    file.clear;
}

let ASTMAIN, ASTCOPY;
let MainLexicalErrors, MainSintacticalErrors, CopyLexicalErrors, CopySintacticalErrors;
let Reports;
function compareCode(){    
    document.getElementById("copias").disabled = false;
    document.getElementById("ReportsButton").disabled = false;
    var Texts;
    // Parse Files
    let URLT = 'http://localhost:3000/parse';    
    if(copyEditorList.length == 0){
        Texts = {
            main: mainEditor.getValue(),
            copy: ""
        };        
        alert("No hay con que comparar el código principal :(. Solo se realizará análisis del código Main");
    }else{        
        Texts = {
            main: mainEditor.getValue(),
            copy: actualEditor.getValue()
        };
    }

    fetch(URLT, {
        method: "POST",
        body: JSON.stringify(Texts),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .catch(error => console.error("Error: ", error))
    .then(response => {
        console.log("Exito");
        ASTMAIN = response.Main.AST;
        MainLexicalErrors = response.Main.LE;
        MainSintacticalErrors = response.Main.SE;
        ASTCOPY = response.Copy.AST;
        CopyLexicalErrors = response.Copy.LE;
        CopySintacticalErrors = response.Copy.SE;
        Reports = response.Reports;
    })
}

let txtClasses = "VACIO", txtMethods = "VACIO", txtVariables = "VACIO";
function ShowCopy(){
    let classes = Reports.ClassReport;
    let methods = Reports.MethodsReport;
    let variables = Reports.VariablesReport;
    
    let txt;
    txtClasses = "//////////  CLASES COPIA ENCONTRADAS  //////////\n";
    
    for(let i=0; i < classes.length; i++){
        if(i == 0){
            txt = "//////////  CLASES COPIA ENCONTRADAS  //////////\n";
        }
        let aux = classes[i];
        txt += "Clase copia: " + aux.NOMBRE + " | Cantidad de métodos/funciones: " + aux.NUMERO_FUN_MET + " \n";
        txtClasses += "Clase copia: " + aux.NOMBRE + " | Cantidad de métodos/funciones: " + aux.NUMERO_FUN_MET + " \n";
    }

    txtMethods = "//////////  Metodos/Funciones COPIA ENCONTRADAS  //////////\n";
    for(let i=0; i < methods.length; i++){
        if(i == 0){
            txt += "\n//////////  Metodos/Funciones COPIA ENCONTRADAS  //////////\n";
        }
        let aux = methods[i];
        txt += "Tipo: " + aux.TIPO + " | Nombre: " + aux.NOMBRE + " | PARAMETROS: " + aux.PARAMETROS + " | CLASE: " + aux.CLASE + "\n";
        txtMethods += "Tipo: " + aux.TIPO + " | Nombre: " + aux.NOMBRE + " | PARAMETROS: " + aux.PARAMETROS + " | CLASE: " + aux.CLASE + "\n";
    }

    txtVariables = "//////////  Variables COPIA ENCONTRADAS  //////////\n";
    for(let i=0; i < variables.length; i++){
        if(i==0){
            txt += "\n//////////  Variables COPIA ENCONTRADAS  //////////\n";
        }
        let aux = variables[i];
        txt += "Tipo: " + aux.TIPO + " | Nombre: " + aux.NOMBRE + " | Funcion/Metodo: " + aux.FUN_MET + " | Clase: " + aux.CLASE + "\n";
        txtVariables += "Tipo: " + aux.TIPO + " | Nombre: " + aux.NOMBRE + " | Funcion/Metodo: " + aux.FUN_MET + " | Clase: " + aux.CLASE + "\n";
    }

    exitEditor.setValue(txt);
}

function PassAST(){
    window.location.href = "http://localhost:8000/reports"
    localStorage.setItem("AST", JSON.stringify(ASTMAIN, null, ' '));
    localStorage.setItem("CLASSES", txtClasses);
    localStorage.setItem("METHODS", txtMethods);
    localStorage.setItem("VARIABLES", txtVariables);
}

function GetAST(){
    ASTMAIN = localStorage.getItem("AST");
    txtClasses = localStorage.getItem("CLASSES");
    txtMethods = localStorage.getItem("METHODS");
    txtVariables = localStorage.getItem("VARIABLES");
    if(ASTMAIN === "undefined"){
        jsonEditor.setValue("No ha cargado ningun archivo para generar el AST :c");
    }else{
        jsonEditor.setValue(ASTMAIN); 
    }

}    

    
function Save(){
    let text = mainEditor.getValue();
    if(text != ''){
        if(nameOfMainFile === ''){
            nameOfMainFile = 'Main.java';
        }
        saveFile(text, nameOfMainFile);
    }

    if(copyEditorList.length != 0){
        text = actualEditor.getValue();
        saveFile(text, actualName);
    }
}

function SaveAs(){

}

function DownloadErrors(){

}

function DownloadClasses(){
    saveFile(txtClasses, "ClasesCopia.txt");
}

function DownloadFunctions(){
    saveFile(txtMethods, "FuncionesCopia.txt");
}

function DownloadVariables(){
    saveFile(txtVariables, "VariablesCopia.txt");
}

function DownloadAST(){    
    let text = jsonEditor.getValue();
    saveFile(text, "AST.json");
}

function saveFile(text, name){  
    let txtFileBlob = new Blob([text], {type: 'text/plain'});
    
    let downloadLink = document.createElement("a");

    downloadLink.download = name;

    downloadLink.innerHTML = "GG?";

    window.URL = window.URL || window.webkitURL;

    downloadLink.href = window.URL.createObjectURL(txtFileBlob);

    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);

    downloadLink.click();    
}