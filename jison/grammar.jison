
/* LEXICAL ANALUSIS */
%lex
%options case-sensitive

integer [0-9]+
double {integer}("."{integer})?
/* TODO: ADD ESCAPE SENTENCES \n, \t... */
stringL (\"[^"]*\")
charL (\'[^']*\')
id ([a-zA-Z_])[a-zA-Z0-9_]*

%%
\s+         /* skip whitespace */

/* COMMENTS */
"//".*
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]

/* NATIVE VALUES */
{integer}               return 'Integer Number'
{double}                return 'Double Number'
{stringL}               return 'String Literal'
{charL}                 return 'Char Literal'
"true"                  return 'true'
"false"                 return 'false'

/* SYMBOLS */

/* ARITMETIC SYMBOLS */
"^"                     return '^'
"*"                     return '*'
"/"                     return '/'
"%"                     return '%'
"+"                     return '+'
"-"                     return '-'

/* RELACIONAL SYMBOLS */
"<"                     return '<'
">"                     return '>'
"<="                    return '<='
">="                    return '>='
"=="                    return '=='
"!="                    return '!='

/* LOGICAL SYMBOLS */
"||"                    return '||'
"&&"                    return '&&'
"!"                     return '!'

/* GENERAL SYMBOLS */
"="                     return '='
";"                     return ';'
"{"                     return '{'
"}"                     return '}'
"("                     return '('
")"                     return ')'
","                     return ','

/* RESERVED WORDS */
/* TYPES */
"int"                   return 'int'
"double"                return 'double'
"boolean"               return 'boolean'
"char"                  return 'char'
"String"                return 'String'

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
"."                     return '.'
"out"                   return 'out'
"print"                 return 'print'
"println"               return 'println'