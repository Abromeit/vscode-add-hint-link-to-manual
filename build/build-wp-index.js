'use strict';

// open this url in chrome: https://developer.wordpress.org/reference/
// and execute the following code in your browser console.
// it will generate the code for ../data/wp-index.js.
//
// note that the pagination available on the site is incomplete,
// so the generated index will not contain all functions and classes.
// to generate a complete index, use a real crawler instead.

(async function(){

    /*
    * via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
    */
    function rnd(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    async function rnd_sleep(ms_min, ms_max){
        const ms = rnd(ms_min, ms_max);
        return new Promise(function(resolve){
            setTimeout(resolve, ms);
        });
    }

    async function do_next_page(url, collected_results=[]){

        console.log('doing '+url+'...');

        const res = await fetch(url).catch(function(){
            return Response.error();
        });

        if( !res.status || res.status < 200 || res.status > 299 ){
            return collected_results;
        }

        const html = await res.text(),
        doc = (new DOMParser()).parseFromString(html, 'text/html'),
        doc_main = doc.querySelector('#main'),
        result_links = doc_main.querySelectorAll('article h1 a');

        collected_results = Array.from(result_links)
            .map(function(el){ return el.innerText.replace(/\(\)$/,''); })
            .concat(collected_results)
        ;

        const next_page_link = doc_main.querySelector('nav.pagination .next');
        if( next_page_link && next_page_link.href ){
            await rnd_sleep(500, 5000);
            return do_next_page(next_page_link.href, collected_results);
        }

        return collected_results;
    }

    const all_functions = new Set(
        await do_next_page('https://developer.wordpress.org/reference/functions/page/1/')
    );
    const all_classes = new Set(
        await do_next_page('https://developer.wordpress.org/reference/classes/page/1/')
    );

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
        '};'
    ;

    console.log(result);
    if( typeof copy === 'function' ){
        copy(result);
    }

})();
