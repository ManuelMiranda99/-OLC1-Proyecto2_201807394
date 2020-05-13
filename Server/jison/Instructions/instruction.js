const TYPES = {
    INTEGER         :           "INTEGER",
    DOUBLE          :           "DOUBLE",
    CHAR            :           "CHAR",
    STRING          :           "STRING",
    BOOLEAN         :           "BOOLEAN",
    ID              :           "ID"
}

const OPERATIONS = {
    
    /* ARITMETIC SYMBOLS */
    NEGATE              :           "NEGATIVE",                 // - x
    
    ADDITION            :           "ADDITION",                 // x + y
    SUBTRACTION         :           "SUBTRACTION",              // x - y
    MULTIPLICATION      :           "MULTIPLICATION",           // x * y
    DIVISION            :           "DIVISION",                 // x / y
    MODULE              :           "MODULE",                   // x % y
    POTENCY             :           "POTENCY",                  // x ^ y

    INCREMENT           :           "INCREMENT",                // x++
    DECREMENT           :           "DECREMENT",                // x--

    /* RELATIONAL SYMBOLS */    
    MAJOR_THAN          :           "MAJOR_THAN",               // x > y
    LESS_THAN           :           "LESS_THAN",                // x < y
    MAJOR_EQUALS_THAN   :           "MAJOR_EQUALS_THAN",        // x >= y
    LESS_EQUALS_THAN    :           "LESS_EQUALS_THAN",         // x <= y
    EQUALS_EQUALS       :           "EQUALS_EQUALS",            // x == y
    DIFFERENT           :           "DIFFERENT",                // x != y

    /* LOGICAL SYMBOLS */
    OR                  :           "OR",                       // x || y
    AND                 :           "AND",                      // x && y
    NOT                 :           "NOT"                      // !x
}

const INSTRUCTIONS = {
    IMPORT              :           "IMPORT",
    CLASS               :           "CLASS",
    DECLARATION         :           "DECLARATION",
    ASSIGNMENT          :           "ASSIGNMENT",
    CALL_FUNCTION       :           "CALL_FUNCTION",
    FUNCTION            :           "FUNCTION",
    METHOD              :           "METHOD",
    PARAMS              :           "PARAMS",
    PRINT               :           "PRINT",
    IF                  :           "IF",
    ELSE_IF             :           "ELSE_IF",
    ELSE                :           "ELSE",
    SWITCH              :           "SWITCH",
    FOR                 :           "FOR",
    WHILE               :           "WHILE",
    DO_WHILE            :           "DO_WHILE",
    CONTINUE            :           "CONTINUE",
    BREAK               :           "BREAK",
    RETURN              :           "RETURN"
}

const OPT_SWITCH = {
    CASE                :           "CASE",
    DEFAULT             :           "DEFAULT"
}

function newOp(left, right, type){
    return{
        left: left,
		right: right,
		type: type
    };
}

const APIinstructions = {

    /* ROOT */
    root : function(listOfImports, listOfClases){
        return {
            listOfImports: listOfImports,
            listOfClases: listOfClases
        };
    },

    newImportList: function(imports, _import){
        return{
            imports: imports,
            import: _import
        }
    },

    newImport: function(id){
        return{
            type: INSTRUCTIONS.IMPORT,
            id: id
        };
    },

    newClassList: function(classes, _class){
        return{
            classes: classes,
            class: _class
        };
    },

    newClass: function(id, instructions){
        return {
            type: INSTRUCTIONS.CLASS,
            id: id,
            instructions: instructions
        };
    },    

    newListInsideClass: function(insides, inside){
        return{
            insides: insides,
            inside: inside
        };
    },

    newBinaryOP: function(left, right, type){
        return newOp(left, right, type);
    },

    newUnaryOP : function(operand, type){
        return newOp(operand, undefined, type);
    },

    newValue: function(value, type){
        return{
            type: type,
            value: value
        };
    },

    newMethod: function(id, params, instructions){
        return{
            type: INSTRUCTIONS.METHOD,
            id: id,
            params: params,
            instructions: instructions
        };
    },

    newFunction: function(type, id, params, instructions){
        return{
            type: INSTRUCTIONS.FUNCTION,
            function_type: type,
            id: id,
            params: params,
            instructions: instructions
        };
    },

    newParamsList: function(params, param){
        return{
            params: params,
            param: param
        };
    },

    newParam: function(type, id){
        return{
            type: INSTRUCTIONS.PARAMS,
            data_type: type,
            id: id
        };
    },

    newSententenceList: function(sentences, sentence){
        return{
            sentences: sentences,
            sentence: sentence
        };
    },

    newDeclaration: function(type, ids){
        return{
            type: INSTRUCTIONS.DECLARATION,
            data_type: type,
            ids: ids
        }
    },

    newDecAs: function(type, ids, exp){
        return{
            type: INSTRUCTIONS.DECLARATION,
            data_type: type,
            ids: ids,
            expression: exp
        };
    },

    newAssignation: function(id, exp){
        return{
            type: INSTRUCTIONS.ASSIGNMENT,
            id: id,
            expression: exp
        };
    },

    newCallFun: function(id, params){
        return{
            type: INSTRUCTIONS.CALL_FUNCTION,
            id: id,
            params: params
        };
    },



    newPrint: function(exp){
        return{
            type: INSTRUCTIONS.PRINT,
            expression: exp
        };
    },

    newIf: function(exp, instructions){
        return{
            type: INSTRUCTIONS.IF,
            condition: exp,
            instructions: instructions
        };
    },

    newElse: function(instructions){
        return{
            type: INSTRUCTIONS.ELSE,
            instructions: instructions
        };
    },

    newSwitch: function(exp, cases){
        return{
            type: INSTRUCTIONS.SWITCH,
            expression: exp,
            cases: cases
        };
    },

    newListCases: function(c){
        let cases = [];
        cases.push(c);
        return cases;
    },

    newCase: function(exp, instructions){
        return{
            type: OPT_SWITCH.CASE,
            expression: exp,
            instructions: instructions
        };
    },

    newDefault: function(instructions){
        return{
            type: OPT_SWITCH.DEFAULT,
            instructions: instructions
        };
    },

    newFor: function(variables, exp, next, instructions){
        return{
            type: INSTRUCTIONS.FOR,
            variables: variables,
            condition: exp,
            next: next,
            instructions: instructions
        };
    },

    newWhile: function(condition, instructions){
        return{
            type: INSTRUCTIONS.WHILE,
            condition: condition,
            instructions: instructions
        };
    },

    newDoWhile: function(condition, instructions){
        return{
            type: INSTRUCTIONS.DO_WHILE,
            condition: condition,
            instructions: instructions
        };
    },

    newContinue: function(){
        return{
            type: INSTRUCTIONS.CONTINUE
        };
    },

    newBreak: function(){
        return{
            type: INSTRUCTIONS.BREAK
        };
    },

    newReturn: function(exp){
        return{
            type: INSTRUCTIONS.RETURN,
            expression: exp
        };
    }

}

module.export.OPERATIONS = OPERATIONS;
module.export.TYPES = TYPES;
module.export.APIinstructions = APIinstructions;