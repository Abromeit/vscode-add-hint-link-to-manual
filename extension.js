'use strict';


const vscode = require('vscode');
const Position = vscode.Position;
const Range = vscode.Range;

const php_index = require(__dirname + '/data/php-function-index');

const book_emoji = '\uD83D\uDCD6';


/**
* @todo: 
*
* - improve implementation for php_index.all_controlstructures, 
*   to allow detection of control structures, which do not utilize a "(" / ")".
*
* - implement functionality 
*   to make use of php_index.all_classes
*
**/
vscode.languages.registerHoverProvider('php', {
    provideHover(document, position){
        const wordRange = document.getWordRangeAtPosition(
            position, /[a-zA-Z_]\w*(?=\s*\()/
        ),
        text = document.getText(wordRange);

        // text is empty.
        if( !text ){
            return;
        }
        
        // text is too long.
        if( text.length > 99 ){
            return;
        }

        // notice: this can probably be removed, 
        // when the detection for native classes is done.
        if( wordRange.start.character > 2 ){
            const before_start_character = wordRange.start.character - 2,
            before_start_line = wordRange.start.line,
            before_end_character = before_start_character + 2,
            before_end_line = wordRange.end.line,
            before_Range = new Range(
                new Position(before_start_line, before_start_character), 
                new Position(before_end_line, before_end_character)
            ),
            before_text = document.getText(before_Range);
            
            // text is a class, a method or something invalid.
            if( /\w\\|-\>|\:\:|\d/.test(before_text) ){
                return;
            }
        }

        
        if( 
            // text is not a native function.
            !php_index.all_functions.has(text) &&
            
            // text is not a native control structure (IMPROVE ME)
            !php_index.all_controlstructures.has(text) 
        ){
            return;
        }
        
        // everything is fine.
        return {
            contents: [book_emoji+' Lookup ['+text+' at php.net](https://www.php.net/search.php?show=quickref&pattern='+text+')']
        };
    }
});


exports.activate = (context) => {
};


exports.deactivate = (context) => {
};