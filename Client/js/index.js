
var countOfTabs = 0;
var copyEditorList = new Array();
var actualEditor;

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
}

function newTab(){    

    $('<li class="nav-item copyTabDefault"><a href="#tab'+countOfTabs+'" data-toggle="tab" class="nav-link copyTabDefault" onclick="setActualTab(' + countOfTabs + ')" id="selectTab' + countOfTabs + '">Tab ' + countOfTabs + '</a></li>').appendTo('#tabsS');    

    $('<div class="tab-pane" id="tab' + countOfTabs + '"style="font-size: 17px;width: 100%;height: 277px;"><div class="list-group Editor" id="tab' + countOfTabs + '"></div></div>').appendTo('.tab-content');

    $('#tabsS a:last').tab('show');

    var newEditor = ace.edit("tab" + countOfTabs);
    newEditor.setTheme("ace/theme/twilight");
    newEditor.session.setMode("ace/mode/java");
    newEditor.setFontSize("17px");

    copyEditorList.push(newEditor);

    setActualTab(countOfTabs)

    countOfTabs++;
}

function openFile(files){
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(e){
        newTab();
        actualEditor.setValue(e.target.result);
    };
    reader.readAsText(file);
    file.clear;
}

function compareCode(){    
    var mainText = mainEditor.getValue();
    if(copyEditorList.length == 0){
        alert("No hay con que comparar el código principal :(");
    }else{
        var compareText = actualEditor.getValue();
    }
}
