
/* LEXICAL ANALUSIS */
%lex
%options case-sensitive

integer [0-9]+
double {integer}("."{integer})?
stringL (\"[^\"]*\")
charL (\'[^\']*\')
id ([a-zA-Z_])[a-zA-Z0-9_]*

%%
\s+         /* skip whitespace */

/* COMMENTS */
"//".*  return
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] return

/* NATIVE VALUES */
{double}                return 'Double_Number'
{integer}               return 'Integer_Number'
{stringL}               return 'String_Literal'
{charL}                 return 'Char_Literal'
"true"                  return 'true'
"false"                 return 'false'

/* SYMBOLS */

/* ARITMETIC SYMBOLS */
"++"                    return 'S_PLUSPLUS'
"--"                    return 'S_MINUSMINUS'
"^"                     return 'S_POTENCY'
"*"                     return 'S_MULTIPLY'
"/"                     return 'S_DIVISION'
"%"                     return 'S_MODULE'
"+"                     return 'S_PLUS'
"-"                     return 'S_MINUS'

/* RELATIONAL SYMBOLS */
"<="                    return 'S_MINOREQUALS'
">="                    return 'S_MAJOREQUALS'
"=="                    return 'S_EQUALSEQUALS'
"!="                    return 'S_DIFFERENT'
"<"                     return 'S_MINOR'
">"                     return 'S_MAJOR'

/* LOGICAL SYMBOLS */
"||"                    return 'S_OR'
"&&"                    return 'S_AND'
"!"                     return 'S_NOT'

/* GENERAL SYMBOLS */
"="                     return 'S_EQUALS'
";"                     return 'SEMICOLON'
":"                     return 'S_TWOPOINTS'
"{"                     return 'S_OPEN_KEY'
"}"                     return 'S_CLOSE_KEY'
"("                     return 'S_OPEN_PARENTHESIS'
")"                     return 'S_CLOSE_PARENTHESIS'
","                     return 'S_COMMA'

/* RESERVED WORDS */
/* TYPES */
"int"                   return 'WR_INT'
"double"                return 'WR_DOUBLE'
"boolean"               return 'WR_BOOLEAN'
"char"                  return 'WR_CHAR'
"String"                return 'WR_STRING'

/* GENERAL RESERVED WORDS */
"class"                 return 'class'
"import"                return 'import'

/* IFELSE SENTENCE */
"if"                    return 'if'
"else"                  return 'else'

/* SWITCH SENTENCE */
"switch"                return 'switch'
"case"                  return 'case'
"default"               return 'default'
"break"                 return 'break'

/* WHILE SENTENCE */
"while"                 return 'while'

/* DO WHILE SENTECE */
"do"                    return 'do'

/* FOR SENTENCE */
"for"                   return 'for'

/* CONTINUE */
"continue"              return 'continue'

/* RETURN */
"return"                return 'return'

/* MAIN */
"void"                  return 'void'
"main"                  return 'main'

/* PRINT SENTENCE */
"System"                return 'System'
"."                     return 'S_POINT'
"out"                   return 'out'
"print"                 return 'print'
"println"               return 'println'

/* ID */
{id}                    return 'id'
<<EOF>>                 return 'EOF'
.                       { ARRAYMANAGEMENT.pushAr(LexicalErrors, { ERROR: "Caracter invalido no perteneciente al lenguaje: " + yytext, LINE: yylloc.first_line, COLUMN : yylloc.first_column }); }

/lex

%{
    const OPERATION_TYPE            = require("./Instructions/instruction").OPERATIONS;
    const TYPES                     = require("./Instructions/instruction").TYPES;
    const APIinstructions           = require("./Instructions/instruction").APIinstructions;

    const ARRAYMANAGEMENT             = require("./Instructions/instruction").ARRAYMANAGEMENT;

    ARRAYMANAGEMENT.DeleteArrays();

    let LexicalErrors             = ARRAYMANAGEMENT.getLex();
    let SyntacticalErrors         = ARRAYMANAGEMENT.getSyn();
%}

/* PRECEDENCE */
%left 'else'
%left 'S_OR'
%left 'S_AND'
%left 'S_EQUALSEQUALS', 'S_DIFFERENT'
%left 'S_MAJOREQUALS', 'S_MINOREQUALS', 'S_MAJOR', 'S_MINOR'
%left 'S_PLUS', 'S_MINUS'
%left 'S_MULTIPLY', 'S_DIVISION', 'S_MODULE'
%left 'S_POTENCY'
%right 'S_NOT'
%left UMINUS

/* SYNTACTIC ANALYSIS */
%start START

%%


START :   IMPORTLIST CLASSLIST EOF      { return { AST: APIinstructions.root($1, $2), LEXICAL_ERRORS: LexicalErrors, SINTACTICAL_ERRORS: SyntacticalErrors}; }
        | IMPORTLIST EOF                { return { AST: APIinstructions.root($1, undefined), LEXICAL_ERRORS: LexicalErrors, SINTACTICAL_ERRORS: SyntacticalErrors}; }
        | CLASSLIST EOF                 { return { AST: APIinstructions.root(undefined, $1), LEXICAL_ERRORS: LexicalErrors, SINTACTICAL_ERRORS: SyntacticalErrors}; }
        | ERRORSENTENCE SEMICOLON START {
            ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                {
                    ERROR: "Se esperaba import o clase, se encontro '" + $1 + "'", 
                    LINE: this._$.first_line, 
                    COLUMN: this._$.first_column 
                }
            );            
        }
        | ERRORSENTENCE S_OPEN_KEY ERRORSENTENCE S_CLOSE_KEY START     {
            ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                {
                    ERROR: "Se esperaba import o clase, se encontro '" + $1 + "'", 
                    LINE: this._$.first_line, 
                    COLUMN: this._$.first_column 
                }
            );            
        }
        | EOF                           { return { AST: 'Vacio', LEXICAL_ERRORS: undefined, SINTACTICAL_ERRORS: undefined }; }        
            ;

IMPORTLIST :  FINALIMPORT IMPORTLIST { $$ = APIinstructions.newImportList($2, $1); }
            | FINALIMPORT           { $$ = APIinstructions.newImportList(undefined, $1); }
            ;

FINALIMPORT:  import id SEMICOLON   { $$ = APIinstructions.newImport($2); }
            | import ERRORSENTENCE SEMICOLON 
            { 
                ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                    { 
                        ERROR: "Se esperaba ID1, se encontro '" + $2 + "'", 
                        LINE: this._$.first_line, 
                        COLUMN: this._$.first_column 
                    }
                );
                $$ = undefined;
            }
            ;

CLASSLIST :   FINALCLASS CLASSLIST  { $$ = APIinstructions.newClassList($2, $1); }
            | FINALCLASS            { $$ = APIinstructions.newClassList(undefined, $1); }
            ;
            
FINALCLASS:   class id S_OPEN_KEY INSIDECLASS S_CLOSE_KEY { $$ = APIinstructions.newClass($2, $4); }
            | class id S_OPEN_KEY S_CLOSE_KEY   { $$ = APIinstructions.newClass($2, undefined); }
            | class ERRORSENTENCE S_OPEN_KEY INSIDECLASS S_CLOSE_KEY { 
                ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                    {
                        ERROR: "Se esperaba ID, se encontro '" + $2 + "'",
                        LINE: this._$.first_line,
                        COLUMN: this._$.first_column
                    }
                );
                $$ = undefined;
             }
            | class S_OPEN_KEY INSIDECLASS S_CLOSE_KEY {
                ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                    {
                        ERROR: "Se esperaba ID, se encontro nada",
                        LINE: this._$.first_line,
                        COLUMN: this._$.first_column
                    }
                );
                $$ = undefined;
            }            
            ;

INSIDECLASS :     FINALINSIDECLASS INSIDECLASS  { $$ = APIinstructions.newListInsideClass($2, $1); }
                | FINALINSIDECLASS   { $$ = APIinstructions.newListInsideClass(undefined, $1); }
            ;
FINALINSIDECLASS :    DECLARATIONSENTENCE { $$ = $1; }
                    | METHODSFUN   { $$ = $1; }
                    | ERRORSENTENCE SEMICOLON {
                        ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                            {
                                ERROR: "Se esperaba declaracion o metodo, se encontro '" + $1 + "'",
                                LINE: this._$.first_line,
                                COLUMN: this._$.first_column
                            }
                        );
                        $$ = undefined;
                    }
                    | ERRORSENTENCE S_OPEN_KEY ERRORSENTENCE S_CLOSE_KEY    {
                        ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                            {
                                ERROR: "Se esperaba declaracion o metodo, se encontro '" + $1 + "'",
                                LINE: this._$.first_line,
                                COLUMN: this._$.first_column
                            }
                        );
                        $$ = undefined;
                    }
            ;

METHODSFUN :  TYPE id S_OPEN_PARENTHESIS PARAMETERDECLARATION S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY { $$ = APIinstructions.newFunction($1, $2, $4, $7); }
            | TYPE id S_OPEN_PARENTHESIS S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY   { $$ = APIinstructions.newFunction($1, $2, undefined, $6) }
            | void id S_OPEN_PARENTHESIS PARAMETERDECLARATION S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY { $$ = APIinstructions.newMethod($2, $4, $7); }
            | void id S_OPEN_PARENTHESIS S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY { $$ = APIinstructions.newMethod($2, undefined, $6); }
            | void main S_OPEN_PARENTHESIS S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY { $$ = APIinstructions.newMethod($2, undefined, $6); }
            ;

TYPE : WR_INT { $$ = $1; } | WR_DOUBLE { $$ = $1; } | WR_CHAR { $$ = $1; } | WR_STRING { $$ = $1; } | WR_BOOLEAN { $$ = $1; }
            ;

PARAMETERDECLARATION :    PARAMETER S_COMMA PARAMETERDECLARATION    { $$ = APIinstructions.newParamsList($3, $1); }
                        | PARAMETER { $$ = APIinstructions.newParamsList(undefined, $1); }
                        | ERRORSENTENCE S_COMMA PARAMETERDECLARATION {
                            ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                                {
                                    ERROR: "Se esperaba parametro, se encontro: '" + $1 + "'",
                                    LINE: this._$.first_line,
                                    COLUMN: this._$.first_column
                                }
                            );
                            $$ = undefined;
                        }
                        | ERRORSENTENCE {
                            ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                                {
                                    ERROR: "Se esperaba parametros, se encontro: '" + $1 + "'",
                                    LINE: this._$.first_line,
                                    COLUMN: this._$.first_column
                                }
                            );
                            $$ = undefined;
                        }
            ;

PARAMETER : TYPE id { $$ = APIinstructions.newParam($1, $2); }
            ;

SENTENCESLIST :   DECLARATIONSENTENCE SENTENCESLIST     { $$ = APIinstructions.newSententenceList($2, $1); }
                | ASSIGNMENTORCALLSENTENCE SENTENCESLIST    { $$ = APIinstructions.newSententenceList($2, $1); }
                | PRINTSENTENCE SENTENCESLIST   { $$ = APIinstructions.newSententenceList($2, $1); }
                | IFELSESENTENCE SENTENCESLIST  { $$ = APIinstructions.newSententenceList($2, $1); }
                | SWITCHSENTENCE SENTENCESLIST  { $$ = APIinstructions.newSententenceList($2, $1); }
                | FORSENTENCE SENTENCESLIST { $$ = APIinstructions.newSententenceList($2, $1); }
                | WHILESENTENCE SENTENCESLIST   { $$ = APIinstructions.newSententenceList($2, $1); }
                | DOWHILESENTENCE SENTENCESLIST { $$ = APIinstructions.newSententenceList($2, $1); }
                | CONTINUESENTENCE SENTENCESLIST    { $$ = APIinstructions.newSententenceList($2, $1); }
                | BREAKSENTENCE SENTENCESLIST   { $$ = APIinstructions.newSententenceList($2, $1); }
                | RETURNSENTENCE SENTENCESLIST  { $$ = APIinstructions.newSententenceList($2, $1); }
                | { $$ = undefined; }
                | ERRORSENTENCE SEMICOLON SENTENCESLIST {
                    ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                        {
                            ERROR: "Se esperaba sentencia, se encontro '" + $1 + "'",
                            LINE: this._$.first_line,
                            COLUMN: this._$.first_column
                        }
                    );
                    $$ = undefined;
                }
                | ERRORSENTENCE S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY SENTENCESLIST  {
                    ARRAYMANAGEMENT.pushAr( SyntacticalErrors,
                        {
                            ERROR: "Se esperaba sentencia, se encontro '" + $1 + "'",
                            LINE: this._$.first_line,
                            COLUMN: this._$.first_column
                        }
                    )
                }
                ;

CONTINUESENTENCE : continue SEMICOLON   { $$ = APIinstructions.newContinue(); }
            ;
BREAKSENTENCE : break SEMICOLON { $$ = APIinstructions.newBreak(); }
            ;
RETURNSENTENCE :  return EXPRESSION SEMICOLON   { $$ = APIinstructions.newReturn($2); }
                | return SEMICOLON  { $$ = APIinstructions.newReturn(undefined); }
            ;
DECLARATIONSENTENCE : TYPE IDLIST SEMICOLON   { $$ = APIinstructions.newDeclaration($1, $2); }
                    | TYPE IDLIST S_EQUALS EXPRESSION SEMICOLON   { $$ = APIinstructions.newDecAs($1, $2, $4); }
            ;
IDLIST :  IDLIST S_COMMA id { $$ = APIinstructions.newListIDs($1, $3); }
        | id    { $$ = APIinstructions.newListIDs(undefined, $1); }
            ; 

ASSIGNMENTORCALLSENTENCE :    id S_EQUALS EXPRESSION SEMICOLON  { $$ = APIinstructions.newAssignation($1, $3); }
                            | id S_OPEN_PARENTHESIS S_CLOSE_PARENTHESIS SEMICOLON   { $$ = APIinstructions.newCallFun($1, undefined); }
                            | id S_OPEN_PARENTHESIS EXPRESSIONLIST S_CLOSE_PARENTHESIS SEMICOLON    { $$ = APIinstructions.newCallFun($1, $3); }
            ;

/* PRINT STATEMENTS */
PRINTSENTENCE : System S_POINT out S_POINT PRINTOPT SEMICOLON   { $$ = $5; }
            ;
PRINTOPT :    print S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS   { $$ = APIinstructions.newPrint("System.out.print", $3); }
            | print S_OPEN_PARENTHESIS S_CLOSE_PARENTHESIS   { $$ = APIinstructions.newPrint("System.out.print", undefined); }
            | println S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS { $$ = APIinstructions.newPrint("System.out.println", $3); }
            | println S_OPEN_PARENTHESIS S_CLOSE_PARENTHESIS { $$ = APIinstructions.newPrint("System.out.println", undefined); }
            ;

/* CONDITIONAL STATEMENTS */
IFELSESENTENCE :  if S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY { $$ = APIinstructions.newIf($3, $6, undefined, undefined); }
                | if S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY else S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY   { $$ = APIinstructions.newIf($3, $6, undefined, APIinstructions.newElse($10)); }
                | if S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY else IFELSESENTENCE { $$ = APIinstructions.newIf($3, $6, APIinstructions.newElseIf($9), undefined); }
            ;

SWITCHSENTENCE :  switch S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY CASELIST OPTDEFAULT S_CLOSE_KEY   { $$ = APIinstructions.newSwitch($3, $6, $7); }
                | switch S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY CASELIST S_CLOSE_KEY  { $$ = APIinstructions.newSwitch($3, $6, undefined); }
                | switch S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY OPTDEFAULT S_CLOSE_KEY    { $$ = APIinstructions.newSwitch($3, undefined, $6); }
                | switch S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY S_CLOSE_KEY   { $$ = APIinstructions.newSwitch($3, undefined, undefined); }
            ;
CASELIST :    CASEFINAL CASELIST    { $$ = APIinstructions.newListCases($2, $1); }
            | CASEFINAL { $$ = APIinstructions.newListCases(undefined, $1); }
            ;
CASEFINAL : case EXPRESSION S_TWOPOINTS SENTENCESLIST   { $$ = APIinstructions.newCase($2, $4); }
            ;

OPTDEFAULT :  default S_TWOPOINTS SENTENCESLIST { $$ = APIinstructions.newDefault($3); }
            ;

/* LOOPING STATEMENTS */
FORSENTENCE : for S_OPEN_PARENTHESIS ASSIGNMENTFOR SEMICOLON EXPRESSION SEMICOLON INCDEC S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY   { $$ = APIinstructions.newFor($3, $5, $7, $10); }
            ;

ASSIGNMENTFOR :   TYPE id S_EQUALS EXPRESSION   { $$ = APIinstructions.newDeclarationFor($1, $2, $4); }
                | id S_EQUALS EXPRESSION    { $$ = APIinstructions.newDeclarationFor(undefined, $1, $3); }
            ;
INCDEC :  EXPRESSION S_PLUSPLUS { $$ = APIinstructions.newNextFor($1, $2); }
        | EXPRESSION S_MINUSMINUS   { $$ = APIinstructions.newNextFor($1, $2); }
        | EXPRESSION    { $$ = APIinstructions.newNextFor($1, undefined); }
            ;
WHILESENTENCE : while S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY    { $$ = APIinstructions.newWhile($3, $6); }
            ;

DOWHILESENTENCE : do S_OPEN_KEY SENTENCESLIST S_CLOSE_KEY while S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS SEMICOLON { $$ = APIinstructions.newDoWhile($7, $3); }
            ;

EXPRESSION :  S_MINUS EXPRESSION %prec UMINUS   { $$ = APIinstructions.newUnaryOP($2, OPERATION_TYPE.NEGATE); }
            | S_NOT EXPRESSION  { $$ = APIinstructions.newUnaryOP($2, OPERATION_TYPE.NOT); }
            | EXPRESSION S_PLUS EXPRESSION  { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.ADDITION) }
            | EXPRESSION S_MINUS EXPRESSION { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.SUBTRACTION) }
            | EXPRESSION S_MULTIPLY EXPRESSION  { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.MULTIPLICATION) }
            | EXPRESSION S_DIVISION EXPRESSION  { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.DIVISION) }
            | EXPRESSION S_MODULE EXPRESSION    { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.MODULE) }
            | EXPRESSION S_POTENCY EXPRESSION   { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.POTENCY) }
            | EXPRESSION S_MAJOR EXPRESSION { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.MAJOR_THAN) }
            | EXPRESSION S_MINOR EXPRESSION { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.LESS_THAN) }
            | EXPRESSION S_MAJOREQUALS EXPRESSION   { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.MAJOR_EQUALS_THAN) }
            | EXPRESSION S_MINOREQUALS EXPRESSION   { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.LESS_EQUALS_THAN) }
            | EXPRESSION S_EQUALSEQUALS EXPRESSION  { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.EQUALS_EQUALS) }
            | EXPRESSION S_DIFFERENT EXPRESSION { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.DIFFERENT) }
            | EXPRESSION S_OR EXPRESSION    { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.OR) }
            | EXPRESSION S_AND EXPRESSION   { $$ = APIinstructions.newBinaryOP($1, $3, OPERATION_TYPE.AND) }
            | S_OPEN_PARENTHESIS EXPRESSION S_CLOSE_PARENTHESIS { $$ = $2; }
            | id S_OPEN_PARENTHESIS EXPRESSIONLIST S_CLOSE_PARENTHESIS  { $$ = APIinstructions.newCallFun($1, $3); }
            | id S_OPEN_PARENTHESIS S_CLOSE_PARENTHESIS { $$ = APIinstructions.newCallFun($1, undefined); }
            | id    { $$ = APIinstructions.newValue($1, TYPES.ID); }
            | Double_Number { $$ = APIinstructions.newValue($1, TYPES.DOUBLE); }
            | Integer_Number    { $$ = APIinstructions.newValue($1, TYPES.INTEGER); }            
            | String_Literal    { $$ = APIinstructions.newValue($1, TYPES.STRING); }
            | Char_Literal  { $$ = APIinstructions.newValue($1, TYPES.CHAR); }
            | true  { $$ = APIinstructions.newValue($1, TYPES.BOOLEAN); }
            | false { $$ = APIinstructions.newValue($1, TYPES.BOOLEAN); }
            ;

EXPRESSIONLIST :  EXPRESSION S_COMMA EXPRESSIONLIST { $$ = APIinstructions.newListExpression($3, $1); }
                | EXPRESSION    { $$ = APIinstructions.newListExpression(undefined, $1); }
            ;

ERRORSENTENCE :   ERRORSENTENCE FINALERROR  { $$ = $1 + " " + $2; }
                | FINALERROR    { $$ = $1; }
            ;
FINALERROR : error
            ;