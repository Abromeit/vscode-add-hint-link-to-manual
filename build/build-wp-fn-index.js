'use strict';

/**
 * @TODO THIS FILE IS WORK IN PROGRESS 
 */

// open this url in chrome: https://developer.wordpress.org/reference/
// and execute the following code in your browser console.
// it will generate the code for ../data/wp-function-index.js.

(function(){

    const all_classes = new Set(),
    all_functions = new Set();

    /*
    TODO! Paginate through these pages to fill our Sets:
    - https://developer.wordpress.org/reference/classes/
    - https://developer.wordpress.org/reference/functions/
    */

    const result = ''+
    '/**\n'+ 
    '* list of all wordpress php functions and classes\n'+
    '* generated from https://developer.wordpress.org/reference/\n'+
    '* at '+(new Date()).toISOString()+'\n'+
    '**/\n'+
    'module.exports = {\n' +
        'all_classes: new Set(JSON.parse(\'' + 
            JSON.stringify( Array.from(all_classes) ).replace(/\\/g,'\\\\') + 
        '\')),\n' +
        'all_functions: new Set(JSON.parse(\'' + 
            JSON.stringify( Array.from(all_functions) ).replace(/\\/g,'\\\\') + 
        '\'))\n' + 
    '};';
    console.log(result);
    copy(result);

})();