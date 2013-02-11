# Changelog

## v1.0.0
#### February 11, 2013

* Bumped version number to `v1.0.0`.
* Updated `CHANGELOG.md` (this file).
* Removed `GPL-LICENSE` and `MIT-LICENSE` and replaced them with [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
* Removed `TODO.md` and moved its contents into [this repo's WIKI](https://github.com/registerguard/jquery-megawhale/issues).
* Moved source Photoshop and Illustrator files into the images folder.
* Build:
	* Added `/build` for [Grunt.js](http://gruntjs.com/) building.
	* Moved all source `.js`, `.css` and images into `/build/src`.
	* Removed version number from file names.
* Changes to `jquery.megawhale.js`:
	1. Changed all callback functions, in `settings.external` to `$.noop`.
	1. Closure updated: `;(function($, window, document, undefined) { … }(jQuery, window, document));`.
	1. Updated syntax that handles the javascript `console` calls.
	1. Consistently using `data` object after initialization.
	1. Added markdown `code` back ticks to things that need it in the comments.
* Modifications to `/demo/index.html`:
	1. Updated links to `jquery.megawhale.min.js` and `jquery.megawhale.min.css`.
	1. Updated `respond.min.js` to latest version.
	1. Updated `html5shiv.js` to latest version.
	1. Updated `jquery.ba-dotimeout.min.js` to the latest version.
	1. Removed `ios-orientationchange-fix.js` as, FWIK, `iOS6` has fixed this bug.
	1. Updated jQuery to the latest version (1.7.2 > 1.9.1).
* Updated `README.md`.

---

## v0.1.1
#### September 6, 2012

* Updated retina display media queries.
    * Fixes [issue #1](https://github.com/registerguard/jquery-megawhale/issues/1).
* Looked at `\9` hacks.
    * No fix appears to be needed in this case; IE9 does fine using a whole number.
    * Closed [issue #2](https://github.com/registerguard/jquery-megawhale/issues/2).
* Bumped version number to `v0.1.1`.
* Updated demo html to link to latest versions of CSS/JS.
* Updated change log.

---

## v0.1.0
#### July 15, 2012

* Initial public release.

---

## vX.X.X
#### Mmmmm [D]D, YYYY

* ...

---