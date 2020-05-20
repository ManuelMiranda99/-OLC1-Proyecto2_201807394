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
    NEGATE              :           "-",                 // - x
    
    ADDITION            :           "+",                 // x + y
    SUBTRACTION         :           "-",              // x - y
    MULTIPLICATION      :           "*",           // x * y
    DIVISION            :           "/",                 // x / y
    MODULE              :           "%",                   // x % y
    POTENCY             :           "^",                  // x ^ y

    INCREMENT           :           "++",                // x++
    DECREMENT           :           "--",                // x--

    /* RELATIONAL SYMBOLS */    
    MAJOR_THAN          :           ">",               // x > y
    LESS_THAN           :           "<",                // x < y
    MAJOR_EQUALS_THAN   :           ">=",        // x >= y
    LESS_EQUALS_THAN    :           "<=",         // x <= y
    EQUALS_EQUALS       :           "==",            // x == y
    DIFFERENT           :           "!=",                // x != y

    /* LOGICAL SYMBOLS */
    OR                  :           "||",                       // x || y
    AND                 :           "&&",                      // x && y
    NOT                 :           "!"                      // !x
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
        IZQ: left,
        OP: type,
		DER: right		
    };
}

const APIinstructions = {

    /* ROOT */
    root : function(listOfImports, listOfClases){
        return {
            LISTA_IMPORTS: listOfImports,
            LISTA_CLASES: listOfClases
        };
    },

    newImportList: function(imports, _import){
        return{
            IMPORT: _import,
            IMPORTS: imports            
        }
    },

    newImport: function(id){
        return{
            IMPORT: 'import',
            ID: id,
            PC: ';'
        };
    },

    newClassList: function(classes, _class){
        return{
            CLASE: _class,
            CLASES: classes            
        };
    },

    newClass: function(id, instructions){
        return {
            CLASS: 'class',
            ID: id,
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}'
        };
    },    

    newListInsideClass: function(insides, inside){
        return{
            SENTENCIA: inside,
            SENTENCIAS: insides            
        };
    },

    newBinaryOP: function(left, right, type){
        return newOp(left, right, type);
    },

    newUnaryOP : function(operand, type){
        return newOp(undefined, operand, type);
    },

    newValue: function(value, type){
        return{
            TIPO: type,
            VALOR: value
        };
    },

    newMethod: function(id, params, instructions){
        return{
            TIPO: 'void',            
            ID: id,
            O_P: '(',
            PARAMETROS: params,
            C_P: ')',
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}'
        };
    },

    newFunction: function(type, id, params, instructions){
        return{            
            TIPO: type,
            ID: id,
            O_P: '(',
            PARAMETROS: params,
            C_P: ')',
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}'
        };
    },

    newParamsList: function(params, param){
        if(params == undefined){
            return{
                PARAMETRO: param
            }
        }
        return{
            PARAMETRO: param,
            C: ',',
            PARAMETROS: params                        
        };
    },

    newParam: function(type, id){
        return{
            TIPO_DATO: type,
            ID: id
        };
    },

    newSententenceList: function(sentences, sentence){
        return{
            SENTENCIA: sentence,
            SENTENCIAS: sentences
        };
    },

    newListIDs: function(ids, id){
        return{
            ID: id,
            C: ',',
            IDS: ids            
        };
    },

    newDeclaration: function(type, ids){
        return{
            TIPO_DATO: type,
            IDS: ids,
            PC: ';'
        }
    },

    newDecAs: function(type, ids, exp){
        return{            
            TIPO_DATO: type,
            IDS: ids,
            I: '=',
            EXPRESSION: exp,
            PC: ';'
        };
    },

    newAssignation: function(id, exp){
        return{            
            ID: id,
            I: '=',
            EXPRESSION: exp,
            PC: ';'
        };
    },

    newCallFun: function(id, params){
        return{            
            ID: id,
            O_P: '(',
            PARAMETROS: params,
            C_P: ')',
            PC: ';'
        };
    },

    newPrint: function(print, exp){
        return{
            PRINT: print,
            O_P: '(',
            EXPRESSION: exp,
            C_P: ')',
            PC: ';'
        };
    },

    newIf: function(exp, instructions, elseif, _else){
        return{
            TIPO: INSTRUCTIONS.IF,
            O_P : '(',   
            CONDICION: exp,
            C_P: ')',
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}',
            ELSEIF: elseif,
            ELSE: _else
        };
    },

    newElseIf: function(_if){
        return{
            IF: _if
        };
    },

    newElse: function(instructions){
        return{
            ELSE: 'else',
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}'
        };
    },

    newSwitch: function(exp, cases, _default){
        return{
            SWITCH: 'switch',
            O_P: '(',
            EXPRESSION: exp,
            C_P: ')',
            O_K: '{',
            CASOS: cases,
            DEFAULT: _default,
            C_K: '}'
        };
    },

    newListCases: function(cases, _case){
        return{
            CASO: _case,
            CASOS: cases            
        };
    },

    newCase: function(exp, instructions){
        return{
            CASE: 'case',
            EXPRESSION: exp,
            DP: ':',
            INSTRUCCIONES: instructions
        };
    },

    newDefault: function(instructions){
        return{
            DEFAULT: 'default',
            DP: ':',
            INSTRUCCIONES: instructions
        };
    },

    newDeclarationFor: function(type, id, exp){
        return{
            TIPO_DATO: type,
            ID: id,
            I: '=',
            EXPRESSION: exp            
        };
    },

    newNextFor: function(exp, incdec){
        return{
            EXPRESSION: exp,
            INDODEC: incdec            
        };
    },

    newFor: function(variables, exp, next, instructions){
        return{
            FOR: 'for',
            O_P: '(',
            ASIGNACION: variables,
            PC: ';',
            CONDICION: exp,
            PC: ';',
            SIGUIENTE: next,
            C_P: ')',
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}'            
        };
    },

    newWhile: function(condition, instructions){
        return{
            WHILE: 'while',
            O_P: '(',            
            CONDICION: condition,
            C_P: ')',
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}'
        };
    },

    newDoWhile: function(condition, instructions){
        return{
            DO: 'do',
            O_K: '{',
            INSTRUCCIONES: instructions,
            C_K: '}',
            WHILE: 'while',
            O_P: '(',
            CONDICION: condition,            
            C_P: ')',
            PC: ';'
        };
    },

    newContinue: function(){
        return{
            CONTINUE: 'continue;'
        };
    },

    newBreak: function(){
        return{
            BREAK: 'break;'
        };
    },

    newReturn: function(exp){
        return{
            RETURN: 'return',
            EXPRESSION: exp,
            PC: ';'
        };
    },

    newListExpression: function(expressions, exp){
        return{
            EXPRESSION: exp,
            C: ',',
            EXPRESSIONES: expressions
        };
    }

}

module.exports.OPERATIONS = OPERATIONS;
module.exports.TYPES = TYPES;
module.exports.APIinstructions = APIinstructions;