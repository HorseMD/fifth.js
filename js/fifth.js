var pstack = [];
var rstack = [];
var isCompiling    = false; // interptret = false, compile = true
var withinComment  = false;
var input_words    = "";
var compiling_word = { name: "", data: ""};
var words          = {
    // arithmetic words
    "+":  function()    { pstack.push(pstack.pop() + pstack.pop()); },
    "-":  function()    { pstack.push(pstack.pop() - pstack.pop()); },
    "*":  function()    { pstack.push(pstack.pop() * pstack.pop()); },
    "/":  function()    { pstack.push(pstack.pop() / pstack.pop()); },
    "=":  function()    { pstack.push(booleanify(pstack.pop() == pstack.pop())); },
    "MOD": function()   { pstack.push(pstack.pop() % pstack.pop()); },
    "ABS": function()   { pstack.push(Math.abs(pstack.pop())); },
    "MIN": function()   { pstack.push(Math.min(pstack.pop(), pstack.pop())); },
    "MAX": function()   { pstack.push(Math.max(pstack.pop(), pstack.pop())); },
    "FLOOR": function() { pstack.push(Math.floor(pstack.pop())); },
    "ROUND": function() { pstack.push(Math.round(pstack.pop())); },

    // stack manipulation words
    "DUP": function()  { var top = pstack.pop(); pstack.push(top); pstack.push(top); },
    "SWAP": function() { var a = pstack.pop(); var b = pstack.pop(); pstack.push(a); pstack.push(b); },
    "DROP": function() { pstack.pop(); },
    "ROT": function()  { var a = pstack.pop(); var b = pstack.pop(); var c = pstack.pop(); pstack.push(b); pstack.push(a); pstack.push(c); },
    "NIP": function()  { pstack.splice(-2, 1); },
    "TUCK": function() { var top = pstack[pstack.length - 1]; pstack.splice(-2, 0, top); },
    "OVER": function() { pstack.push(pstack[pstack.length - 2]); },
    "ROLL": function() { pstack.push(pstack.splice(-(pstack.pop() + 1), 1)); },
    "PICK": function() { var dist = pstack.pop() + 1; pstack.push(pstack[pstack.length - dist]); },
    "2DROP": "DROP DROP",

    // return-stack related words
    ">R": function() { rstack.push(pstack.pop()); },
    "R>": function() { pstack.push(rstack.pop()); },
    "R@": function() { pstack.push(rstack[rstack.length - 1]); },
    "J": function()  { pstack.push(rstack[rstack.length - 3]); },
    "I": "R@",
    
    // compiling-related words
    ":": function() { isCompiling = true; },
    ";": function() { compile(); },
    "(": function() { withinComment = true; },
    ")": function() { withinComment = false; },

    // special words
    ".":  function()         { printReturn(pstack.pop()); },
    ".S": function()         { printReturn("<" + pstack.length + "> " + pstack.join(" ")); },
    "PAGE": function()       { document.getElementById("foutput").value = ""; },
    "WORDS": function()      { printReturn(Object.keys(words).join(" ")); },
    "CLEARSTACK": function() { pstack = []; },
    "EMIT": function()       { printReturn(String.fromCharCode(pstack.pop())); },
    "CR": function()         { printReturn("\n"); }
};

// provide a means by which to display text to the user.
var printStd = function(text) {
    document.getElementById("foutput").value += text;
};

// when a word returns text to display, it should go through here.
var printReturn = function(text) {
    printStd(" " + text);
};

// say that the line has been evaluated sucessfully.
// should only be called by the parser.
var printOk = function() {
    printStd("  ok\n");
};

// print an error.
// should only be called by the parser.
var printErr = function(text) {
    printStd("\nError: " + text + "\n");
};

// add the word that's currently compiling to the dictionary.
var compile = function() {
    if(!isCompiling) {
        throw "Not in compile mode!";
    }
    else if(compiling_word["name"] === "") {
        throw "No name has been declared for the word to be compiled!";
    }
    words[compiling_word["name"]] = compiling_word["data"].trim();
    compiling_word = { name: "", data: "" };
    isCompiling = false;
};

// whether or not the given string is actually a number.
var isNumber = function(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
};

// whether or not fifth.js knows about this word.
// unless we're in compilation mode, in which case it pretends
// to know everything.
var isWord = function(str) {
    return str in words || isCompiling;
};

// given a boolean, return -1 if true, 0 otherwise.
var booleanify = function(condition) {
    return condition ? -1 : 0;
};

// parse a single token from the user's input.
var parseToken = function(element) {
    if(element.trim() == "") { return; }

    if(isCompiling && element !== ";")
    {
        if(compiling_word["name"] === "") {
            compiling_word["name"] = element;
        } else {
            compiling_word["data"] += element + " ";
        }
    } else {
        if(isNumber(element)) {
            pstack.push(parseFloat(element));
        } else if(isWord(element)) {
            var word = words[element];
            if(word instanceof Function) {
                words[element](); // execute the word
            } else {
                parseLine(word);  // word contains words, parse them
            }
        } else if (!withinComment) {
            throw "Undefined word >" + element + "<";
        }
    }
};

// parse an entire line of words.
var parseLine = function(line, echo_success) {
    var sentence = line.split(" ");

    try {
        for(var i=0; i<sentence.length; i++) {
            if(sentence[i] === "//") {
                break;
            }
            parseToken(sentence[i]);
        }
        if(echo_success) {
            printOk();   
        }
    } catch (e) {
        printErr(e);
    }
};

// parse input from the user.
var parseUserInput = function(user_input) {
    user_input = user_input.trim();
    
    printStd(user_input);
    parseLine(user_input, true);
};
