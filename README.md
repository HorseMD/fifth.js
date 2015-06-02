#fifth.js

(because forth.js was already taken)

First attempt at a [Forth](http://www.forth.com/forth/index.html) interpreter, written in Javascript.

There's a lot not yet implemented; this is very much a WIP project.

##Usage

```javascript
var output = document.querySelector("textarea");
var input  = document.querySelector("input");
Fifth.setOut(output).parse(input);
```

Currently only the bare minimum is done for output and input functionality - it's assumed that
the user will clear the value of input after every command, and that the output has a parameter
called `.value`. In the future this will hopefully change so that `setOut` will guess what to do
given a certain object.

##TODO

* Separate output from interpreter.
* Buffer output, rather than appending (will allow for use of console.log as the output object);
* Basically redo most the interpreter logic to allow things like Strings without having to struggle
to fit with the current , etc.

