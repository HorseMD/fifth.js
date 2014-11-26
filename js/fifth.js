var pstack = new Array();
var rstack = new Array();
var mode = 0; // interptret = 0, compile = 1
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
    ":": function() { mode = 1; },
    ";": function() { compile(); },
    "(": function() { withinComment = true; },
    ")": function() { withinComment = false; },

    // special words
    ".":  function()         { println(pstack.pop()); },
    ".S": function()         { println("<" + pstack.length + "> " + pstack.join(" ")); },
    "PAGE": function()       { document.getElementById("foutput").value = ""; },
    "WORDS": function()      { println(Object.keys(words).join(" ")); },
    "CLEARSTACK": function() { pstack = []; println(""); }
};

// used directly by the input area for commands.
// print the given text + ok to the output (#foutput).
var printStd = function(text) {
    document.getElementById("foutput").value += text + "\n";
}

// used by fifth.js to respond to the user.
// print the given text to the output.
var println = function(text) {
    printStd(text + " ok");
}

// add the word that's currently compiling to the dictionary.
var compile = function() {
    if(mode != 1) {
        throw "Not in compile mode!";
    }
    else if(compiling_word["name"] === "") {
        throw "No name has been declared for the word to be compiled!";
    }
    words[compiling_word["name"]] = compiling_word["data"].trim();
    compiling_word = { name: "", data: "" };
    mode = 0;
}

// whether or not the given string is actually a number.
var isNumber = function(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
};

// whether or not fifth.js knows about this word.
// unless we're in compilation mode, in which case it pretends
// to know everything.
var isWord = function(str) {
    return str in words || mode === 1;
};

// given a boolean, return -1 if true, 0 otherwise.
var booleanify = function(condition) {
    return condition ? -1 : 0;
};

// parse a single token from the user's input.
var parseToken = function(element) {
    if(element.trim() == "") { return; }

    if(mode == 1 && element !== ";")
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
                parse(word);      // word contains words, parse them
            }
        }  else if (!withinComment) {
            println("Word " + element + " isn't in the dictionary.");
        }
    }
};

// parse a whole string.
var parse = function(user_input) {
    var sentence = user_input.split(" ");

    for(var i=0; i<sentence.length; i++) {
        if(sentence[i] === "//") {
            break;
        }
        parseToken(sentence[i]);
    }
};
