
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

var tabList = new Array();
function linkedList(tab, name){
    var obj = new Object();
    obj.tab = tab;
    obj.name = name;
}

function changeTab(tabs, tab){
    var id = tab.replace('Nueva', '');
    setActualTab('copyCode' + id);

    var tab1 = document.getElementById(tab);
    var listOfTabs = document.getElementById(tabs);
    var cTab = document.getElementById('c' + tab);
    var listCTabs = document.getElementById('copyContent' + tabs);

    var i=0;
    while(typeof listCTabs.getElementsByTagName('div')[i] != 'undefined'){
        $(document).ready(function(){
            $(listCTabs.getElementsByTagName('div')[i]).css('display', 'none');
            $(listCTabs.getElementsByTagName('li')[i]).css('background', '');
            $(listCTabs.getElementsByTagName('li')[i]).css('padding-bottom', '');
        });
        i++;
    }
}

function newTab(){    

    $('<li class="nav-item copyTabDefault"><a href="#tab'+countOfTabs+'" data-toggle="tab" class="nav-link copyTabDefault" onclick="setActualTab(' + countOfTabs + ')">Tab ' + countOfTabs + '</a></li>').appendTo('#tabsS');    

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

function compareCode(){    
    var mainText = mainEditor.getValue();
    if(copyEditorList.length == 0){
        alert("No hay con que comparar el código principal :(");
    }else{
        var compareText = actualEditor.getValue();
    }
}