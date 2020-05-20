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
function compareCode(){    

    // Parse Files
    URL = 'http://localhost:3000/parse';
    var mainText = {
        main: mainEditor.getValue()
    };
    if(copyEditorList.length == 0){
        AssignAST(ASTMAIN, mainText);
        alert("No hay con que comparar el código principal :(. Solo se realizará análisis del código Main");
    }else{        
        var compareText = {
            main: actualEditor.getValue()
        };
        AssignAST(ASTMAIN, mainText);
        AssignAST(ASTCOPY, compareText);
    }
}

function AssignAST(_AST, text){
    fetch(URL, {
        method: "POST",
        body: JSON.stringify(text),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .catch(error => console.error("Error: ", error))
    .then(response => {
        console.log("Exito");
        _AST = response;    
    })
}

function Save(){
    let text = mainEditor.getValue();
    if(text === ''){

    }else{
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

function DownloadErrors(){

}

function DownloadClasses(){

}

function DownloadFunctions(){

}

function DownloadVariables(){

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