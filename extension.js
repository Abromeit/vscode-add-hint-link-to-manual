'use strict';


const vscode = require('vscode');
const Position = vscode.Position;
const Range = vscode.Range;

const PHP_INDEX = require(__dirname + '/data/php-index');
const WP_INDEX = require(__dirname + '/data/wp-index');

const BOOK_EMOJI = '\uD83D\uDCD6';

const RE_WORDRANGE_PHP_FUNCTION = /[a-zA-Z_]\w*(?=\s*\()/;
const TEXT_UNDER_CURSOR_MAXLENGTH = 99;


/**
* @todo: implement functionality to make use of `PHP_INDEX.all_classes`.
* @todo: implement functionality to make use of `WP_INDEX.all_classes`.
**/


/**
* check if text under cursor is empty.
* @param {string} text
* @return {boolean}
*/
function isEmpty(text){
    return !text || text.trim() === '';
}


/**
* check if text under cursor is too long to be valid.
* @param {string} text
* @return {boolean}
*/
function isTooLong(text){
    return text && text.length > TEXT_UNDER_CURSOR_MAXLENGTH;
}


/**
 * check if the characters in front of a selected word range
 * disallow the word range to be a valid, 
 * non-namespaced php function or control structure. 
 * i.e. this excludes classes, methods, namespaced functions, etc.
 * 
 * notice: this can probably be removed, 
 * when the detection for native classes is done.
 *   
 * @param document
 * @param {vscode.Range} wordRange
 * @return {boolean}
 */
function charsBeforeMatchSeemInvalid(document, wordRange){
    if( wordRange.start.character <= 2 ){
        return false;
    }

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
    return /\w\\|-\>|\:\:|\d/.test(before_text);
}


/**
 * check if text under cursor is likely a pure php function.
 * 
 * @param document
 * @param {vscode.Position} position
 * @return {boolean}
 */
function isLikelyPurePhpFunction(document, position){
    const wordRange = document.getWordRangeAtPosition(
        position, RE_WORDRANGE_PHP_FUNCTION
    ),
    text = document.getText(wordRange);

    if( 
        isEmpty(text) ||
        isTooLong(text) ||
        charsBeforeMatchSeemInvalid(document, wordRange)
    ){
        return false;
    }

    // text is a native function.
    return PHP_INDEX.all_functions.has(text);
}


/**
 * check if text under cursor is likely a php control structure.
 * 
 * @param document
 * @param {vscode.Position} position
 * @return {boolean}
 */
function isLikelyPhpControlStructure(document, position){
    const wordRange = document.getWordRangeAtPosition(
        position, RE_WORDRANGE_PHP_FUNCTION
    ),
    text = document.getText(wordRange);

    if( 
        isEmpty(text) ||
        isTooLong(text) ||
        charsBeforeMatchSeemInvalid(document, wordRange)
    ){
        return false;
    }

    // text is a native control structure
    // notice: `PHP_INDEX.all_controlstructures` only contains entries, which 
    // utilize "(" / ")". i.e. this behaves just like our functions do.
    return PHP_INDEX.all_controlstructures.has(text);
}


/**
 * check if text under cursor is likely a wordpress function.
 * 
 * @param document
 * @param {vscode.Position} position
 * @return {boolean}
 */
function isLikelyWpFunction(document, position){
    const wordRange = document.getWordRangeAtPosition(
        position, RE_WORDRANGE_PHP_FUNCTION
    ),
    text = document.getText(wordRange);

    if( 
        isEmpty(text) ||
        isTooLong(text) ||
        charsBeforeMatchSeemInvalid(document, wordRange)
    ){
        return false;
    }

    // text is a wordpress function.
    return WP_INDEX.all_functions.has(text);
}


vscode.languages.registerHoverProvider('php', 
    function phpHoverProvider(document, position){

        const documentation_links = [];

        if(
            isLikelyPurePhpFunction(document, position) ||
            isLikelyPhpControlStructure(document, position)
        ){
            documentation_links.push('[php.net](https://www.php.net/search.php?show=quickref&pattern='+text+')');
        }

        if( isLikelyWpFunction(document, position) ){
            documentation_links.push('[wordpress.org](https://developer.wordpress.org/reference/functions/'+text+'/)');
        }

        // nothing found? stop here.
        if( !documentation_links.length ){
            return;
        }

        // everything is fine.
        return {
            contents: [BOOK_EMOJI+' Lookup '+text+' at '+documentation_links.join(' or ')]
        };
    }
);


exports.activate = function(context){
    /* nothing to do! */
};


exports.deactivate = function(context){
    /* nothing to do! */
};