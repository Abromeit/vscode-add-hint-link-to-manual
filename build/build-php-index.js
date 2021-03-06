'use strict';

// open this url in chrome: https://www.php.net/manual/en/indexes.functions.php
// and execute the following code in your browser console.
// it will generate the code for ../data/php-index.js.

(function(){

    const links = document.querySelectorAll('#indexes\\.functions a.index'),
    all_classes = new Set(),
    all_functions = new Set(),
    all_controlstructures = new Set();

    Array.from(links).forEach(function(a){
        const anchortext = a.innerText,
        colon_position = anchortext.indexOf(':');

        if( colon_position !== -1 ){
            const classname = anchortext.substring(0, colon_position);
            all_classes.add(classname);
        }
        else{
            all_functions.add(anchortext);
        }
    });

    // note that https://www.php.net/manual/en/language.control-structures.php
    // is not contained within https://www.php.net/manual/en/indexes.functions.php
    // so lets add control structures manually:
    all_controlstructures.add('if');
    all_controlstructures.add('else');
    all_controlstructures.add('elseif');
    all_controlstructures.add('while');
    all_controlstructures.add('do');
    all_controlstructures.add('for');
    all_controlstructures.add('foreach');
    all_controlstructures.add('switch');
    all_controlstructures.add('match');
    all_controlstructures.add('declare');
    // the following are currently disabled, since they don't use "(" / ")":
    /*
    all_controlstructures.add('break'); 
    all_controlstructures.add('continue');
    all_controlstructures.add('return');
    all_controlstructures.add('require');
    all_controlstructures.add('include');
    all_controlstructures.add('require_once');
    all_controlstructures.add('include_once');
    all_controlstructures.add('goto');
    */

    const result = ''+
        '/**\n'+ 
        '* list of all php functions, classes and control structures\n'+
        '* generated from https://www.php.net/manual/en/indexes.functions.php\n'+
        '* at '+(new Date()).toISOString()+'\n'+
        '**/\n'+
        'module.exports = {\n' +
            'all_classes: new Set(JSON.parse(\'' + 
                JSON.stringify( Array.from(all_classes) ).replace(/\\/g,'\\\\') + 
            '\')),\n' +
            'all_controlstructures: new Set(JSON.parse(\'' + 
                JSON.stringify( Array.from(all_controlstructures) ).replace(/\\/g,'\\\\') + 
            '\')),\n' + 
            'all_functions: new Set(JSON.parse(\'' + 
                JSON.stringify( Array.from(all_functions) ).replace(/\\/g,'\\\\') + 
            '\'))\n' + 
        '};'
    ;

    console.log(result);
    copy(result);

})();