# Changelog

## v1.0.0
#### February 11, 2013

* Bumped version number to `v1.0.0`.
* Updated `CHANGELOG.md` (this file).
	* New: Browser tests guide.
* Removed `GPL-LICENSE` and `MIT-LICENSE` and replaced them with [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
* Removed `TODO.md` and moved its contents into [this repo's WIKI](https://github.com/registerguard/jquery-megawhale/issues).
* Moved source Photoshop and Illustrator files into the images folder.
* Build:
	* Added `/build` for [Grunt.js](http://gruntjs.com/) building.
	* Moved all source `.js`, `.css` and images into `/build/src`.
	* Removed version number from file names.
	* Added `.jshintrc` file (used for linting).
		* Updated `Gruntfile.js` to point to the new `.jshintrc`.
	* Added `use strict` and a few other small tweaks.
* Changes to `jquery.megawhale.js`:
	1. Changed all callback functions, in `settings.external` to `$.noop`.
	1. Closure updated: `;(function($, window, document, undefined) { … }(jQuery, window, document));`.
	1. Updated syntax that handles the javascript `console` calls.
	1. Consistently using `data` object after initialization.
	1. Added markdown `code` back ticks to things that need it in the comments.
	1. Lint: Single variable per scope.
	1. Comment tweaks.
* Modifications to `/demo/index.html`:
	1. Updated links to `jquery.megawhale.min.js` and `jquery.megawhale.min.css`.
	1. Updated `respond.min.js` to latest version.
	1. Updated `html5shiv.js` to latest version.
	1. Updated `jquery.ba-dotimeout.min.js` to the latest version.
	1. Removed `ios-orientationchange-fix.js` as, FWIK, `iOS6` has fixed this bug.
	1. Updated jQuery to the latest version (1.7.2 > 1.9.1).
	1. Added IE-specific classes.
	1. Small adjustments to embedded JS.
* `jquery.megawhale.css`:
	* Fixed issue with css minification.
	* Added overrides for `respond.js` bug where IE will load retina when it really shouldn't.
* Updated `README.md`:
	* Added default values.
	* Added note about Firefox Responsive Design View.
	* A few small adjustments.

##### Browser tests:

* MAC Snow Leopard:
	* xFirefox `18.0.2`, xSafari `6.0.2 (8536.26.17)`, xOpera `12.14 (1738)`, xChrome `24.0.1312.57`
* PC Windows 7:
	* xFirefox `18.0.2`
	* xIE `9.0.8112.16421`
* PC Vista:
	* xFirefox `3.6.2.8`, xChrome `24.0.1312.57 m`, xSafari `5.1.7 (7534.57.2)`, xOpera `12.14 (1738)`
	* xIE `7.0.6002.18005`
* PC XP:
    * xIE `8.0.6001.18702`, xIE `6.0.2900.5512.xpsp_sp3_gdr.120504-1619`
* iPhone (Retina 4-inch), iOS `6.1`:
	* xSafari (simulated)
* iPhone (Retina 3.5-inch), iOS `6.1`:
	* xSafari (simulated), xSafari, xChrome `23.0.1271.100`, xOpera Mini `7.0.5.45389`, xDolphin `v7.1`
* iPhone, iOS `6.1`:
	* xSafari (simulated)
* iPad (Retina), iOS `6.1`:
	* xSafari (simulated), xSafari
* iPad, iOS `6.1`:
	* xSafari (simulated)
* Motorola Droid 4, Android 4.0.4
	* xBrowser, xDolphin 9.3.1

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