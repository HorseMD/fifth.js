var pstack = new Array();
var rstack = new Array();
var input_words = "";
var words       = {
    "+":  function()  { pstack.push(pstack.pop() + pstack.pop()); },
    "-":  function()  { pstack.push(pstack.pop() - pstack.pop()); },
    "*":  function()  { pstack.push(pstack.pop() * pstack.pop()); },
    "/":  function()  { pstack.push(pstack.pop() / pstack.pop()); },
    "=":  function()  { pstack.push(booleanify(pstack.pop() == pstack.pop())); },
    "MOD": function() { pstack.push(pstack.pop() % pstack.pop()); },
    
    "DUP": function()  { var top = pstack.pop(); pstack.push(top); pstack.push(top); }, // can this be improved?
    "SWAP": function() { var a = pstack.pop(); var b = pstack.pop(); pstack.push(a); pstack.push(b); },
    "DROP": function() { pstack.pop(); },

    ">R": function() { rstack.push(pstack.pop()); },
    "R>": function() { pstack.push(rstack.pop()); },

    ".":  function()         { console.log(pstack.pop()); },
    ".S": function()         { console.log("<" + pstack.length + "> " + pstack); },
    "WORDS": function()      { console.log(Object.keys(words)); },
    "CLEARSTACK": function() { pstack.clear(); }
};

input_words = "4 6 + 10 = .s"; // not gonna get the user input from html just yet

// whether or not the given string is actually a number.
var isNumber = function(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
};

// whether or not fifth.js knows about this word.
var isWord = function(str) {
    return str in words;
};

// given a boolean, return -1 if true, 0 otherwise.
var booleanify = function(condition) {
    return condition ? -1 : 0;
};

// parse a single token from the user's input.
var parseToken = function(element, index, arr) {
    if(isNumber(element)) {
        paramstack.push(parseFloat(element));
    } else if(isWord(element)) {
        words[element]();
    } else {
        throw "Word " + element + " isn't in the dictionary.";
    }
};

// parse the entirety of the user's input.
var parse = function(user_input) {
    user_input.forEach(parseToken);
};

parse(input_words.split(" "));

