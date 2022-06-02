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
 * @return {string|false} - the matching text on success, false on failure.
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
    if( PHP_INDEX.all_functions.has(text) ){
        return text;
    }

    return false;
}


/**
 * check if text under cursor is likely a php control structure.
 * 
 * @param document
 * @param {vscode.Position} position
 * @return {string|false} - the matching text on success, false on failure.
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
    if( PHP_INDEX.all_controlstructures.has(text) ){
        return text;
    }

    return false;
}


/**
 * check if text under cursor is likely a wordpress function.
 * 
 * @param document
 * @param {vscode.Position} position
 * @return {string|false} - the matching text on success, false on failure.
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
    if( WP_INDEX.all_functions.has(text) ){
        return text;
    }

    return false;
}


vscode.languages.registerHoverProvider('php', {
    provideHover: function phpHoverProvider(document, position){

        const documentation_links = [],
        documentation_texts = [],
        
        likelyPurePhpFunctionText = isLikelyPurePhpFunction(document, position),
        likelyPhpControlStructureText = isLikelyPhpControlStructure(document, position),
        likelyWpFunctionText = isLikelyWpFunction(document, position);

        if( likelyPurePhpFunctionText ){
            const link = '[php.net](https://www.php.net/search.php?show=quickref&pattern=' + likelyPurePhpFunctionText + ')';
            documentation_links.push(link);
            documentation_texts.push(likelyPurePhpFunctionText);
        }

        if( likelyPhpControlStructureText ){
            const link = '[php.net](https://www.php.net/search.php?show=quickref&pattern=' + likelyPhpControlStructureText + ')';
            if( !documentation_links.contains(link) ){
                documentation_links.push(link);
                documentation_texts.push(likelyPhpControlStructureText);
            }
        }

        if( likelyWpFunctionText ){
            documentation_links.push('[wordpress.org](https://developer.wordpress.org/reference/functions/' + likelyWpFunctionText + '/)');
            documentation_texts.push(likelyWpFunctionText);
        }

        // nothing found? stop here.
        if( !documentation_links.length ){
            return;
        }

        // everything is fine. build the output.
        const unique_documentation_texts = [...new Set(documentation_texts)];
        let hint_text = BOOK_EMOJI + ' Lookup ';

        if( unique_documentation_texts.length === 1 ){
            // "Lookup foo at example1.com or example2.com or ..."
            hint_text += text + ' at ' + documentation_links.join(' or ');
        }
        else{
            // "Lookup foo at example1.com or bar at example2.com or ..."
            const hint_texts = [];
            for(const [key, link] of documentation_links){
                hint_texts.push(documentation_texts[key] + ' at ' + link);
            }
            hint_text += hint_texts.join(' or ');
        }

        return {contents: hint_text};
    }
});


exports.activate = function(context){
    /* nothing to do! */
};


exports.deactivate = function(context){
    /* nothing to do! */
};