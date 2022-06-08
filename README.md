[twitter-shield]: https://img.shields.io/twitter/follow/der_abro?style=social
[twitter-url]: https://twitter.com/der_abro

[![Follow Daniel Abromeit on Twitter][twitter-shield]][twitter-url]

# Goto Documentation – just one click away

This extension was created to complement the existing PHP IntelliSense-style plugins.

While in CSS, for example, it is quite easy to extend VSCode so that you get a direct link to <abbr title="MDN Web Docs, formerly Mozilla Developer Network, is the Mozilla Foundation's official developer documentation for Web technologies, with active participation from browser vendors.">MDN</abbr> when hovering over a property, the situation in the PHP language is a bit more difficult.

For this reason, this lightweight extension provides an easy solution to look up a function in the official documentation on [php.net](https://www.php.net/manual/en/) or [wordpress.org](https://developer.wordpress.org/reference/).

<br  />

## Screenshots / Preview

Lookup native PHP functions on php.net:

![Screenshot 1: Example PHP Code, where the language construct 'isset()' is under the cursor.](https://raw.githubusercontent.com/Abromeit/vscode-add-hint-link-to-manual/main/img/screenshot-1.png)

Lookup WordPress core functions on the WP Codex:

![Screenshot 2: WordPress PHP Code, where the function 'is_ssl()' is under the cursor. Help ist then provided in a layer, which floats above the function name.](https://raw.githubusercontent.com/Abromeit/vscode-add-hint-link-to-manual/main/img/screenshot-2.png)

Plays well with other VSCode extensions. Here, PHP IntelliSense added a parameter hint and a short function description. We then added our link to the functions documentation on php.net:

![Screenshot 3: PHP code, where hinting is already provided via other Visual Studio Code Extensions. The function 'parse_url()' is under the cursor. In the tooltip we see the functions definition, a short descrition and as last entry (closest to the cursor) the link to the corresponding php.net manual page.](https://raw.githubusercontent.com/Abromeit/vscode-add-hint-link-to-manual/main/img/screenshot-3-annotated.png)

<br  />


## Changelog

### v1.0.1 | 2022-06-08 ###

Introduces a custom logo. No code changes.

This release fixes a possible licensing issue 
where the previously used graphic was not allowed to be used as a logo 
despite being purchased. We have not perceived the icon used as a logo so far, 
but we want to be on the safe side with this change. Special thanks to 
Thorsten Franke for the nice illustration.

### v1.0.0 | 2022-06-03 ###

Initial release.


## License

MIT – see https://ke.mit-license.org/
