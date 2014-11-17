var pstack = new Array();
var rstack = new Array();
var mode = 0; // interptret = 0, compile = 1
var withinComment  = false;
var input_words    = "";
var compiling_word = { name: "", data: ""};
var words          = {
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

    ":": function() { mode = 1; },
    ";": function() { compile(); },
    "(": function() { withinComment = true; },
    ")": function() { withinComment = false; },

    ".":  function()         { println(pstack.pop()); },
    ".S": function()         { println("<" + pstack.length + "> " + pstack.join(" ")); },
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

// add the word that's currently compiling to the dictionary
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
var isWord = function(str) {
    return str in words || mode === 1;
};

// given a boolean, return -1 if true, 0 otherwise.
var booleanify = function(condition) {
    return condition ? -1 : 0;
};

// parse a single token from the user's input.
var parseToken = function(element, index, arr) {
    if(element === "//") { return; }

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
                words[element]();
            } else {
                parse(word);
            }
        }  else if (!withinComment) {
            throw "Word " + element + " isn't in the dictionary.";
        }
    }
};

// parse a whole string.
var parse = function(user_input) {
    user_input.split(" ").forEach(parseToken);
};
