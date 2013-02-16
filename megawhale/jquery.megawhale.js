/*!
 * jQuery MegaWhale
 * Like Superfish, but for mega menus!
 *
 * @author Micky Hulse
 * @link http://hulse.me
 * @docs https://github.com/registerguard/jquery-megawhale
 * @copyright Copyright (c) 2013 Micky Hulse.
 * @license Released under the Apache License, Version 2.0.
 * @version 1.0.0
 * @date 2013/02/16
 */

//----------------------------------

// Notes to self:
//console.profile('profile foo');
// ... code here ...
//console.profileEnd('profile foo');
// ... or:
// console.time('timing foo');
// ... code here ...
// console.timeEnd('timing foo');

//----------------------------------

// @TODO:
// All vars that are objects use $xxxx.
// Test for memory leaks.
// Check usage of this: Does it need to be $(this) when passed?
// Make open/close methods "more" public.
// What's the best thing to return via callback methods (i.e. the menu `<ul>` or the current item.)?
// Use ((this instanceof jQuery) ? this : $(this)) where $(this) is uncertain. <rgne.ws/NbAsvY>

//----------------------------------

;(function($, window, document, undefined) {
	
	/**
	 * Function-level strict mode syntax.
	 *
	 * @see rgne.ws/XcZgn8
	 */
	
	'use strict';
	
	//--------------------------------------------------------------------------
	//
	// Local "globals":
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Javascript console.
	 *
	 * @see rgne.ws/12p2bvl
	 */
	
	var console = window.console || { log : function() {}, warn : function() {} },
	
	//----------------------------------
	
	/**
	 * Detects if it's a touch device.
	 * Used in constants object literal.
	 *
	 * @see rgne.ws/N9c4uV
	 * @see rgne.ws/Nq086y
	 */
	
	touch = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)),
	
	//----------------------------------
	
	/**
	 * Settings object.
	 *
	 * @type { object }
	 */
	
	settings = {}, // Initialize config object.
	
	//--------------------------------------------------------------------------
	//
	// Constants:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Commonly used variables.
	 *
	 * @type { object }
	 * @const
	 */
	
	constants = {
		
		NS     : 'megawhale',                     // Namespace identifier.
		PREFIX : 'mw',                            // Class prefix.
		TOUCH  : touch,                           // Touch capable?
		TYPE   : (touch ? 'touchstart' : 'click') // rgne.ws/NaVbjk
		
	}, // constants
	
	//--------------------------------------------------------------------------
	//
	// Public methods:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Methods object.
	 *
	 * @type { object }
	 */
	
	methods = {
		
		/**
		 * Init constructor.
		 *
		 * @type { function }
		 * @param { object } opts Options object literal.
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		init : function(opts) {
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Declare/initialize:
				//----------------------------------
				
				var $this = $(this),                  // Target object.
				    data  = $this.data(constants.NS), // Namespace instance data.
				    options,
				    $divs,
				    $lis,
				    $hrefs;
				
				//----------------------------------
				// Data?
				//----------------------------------
				
				if ( ! data) {
					
					//----------------------------------
					// Initialize:
					//----------------------------------
					
					options = $.extend({}, settings.external, $.fn[constants.NS].defaults, opts); // Merge settings, defaults and opts.
					$divs   = $this.children('li').children('div');                               // `<div>`s whom are the immediate children of `<li>`s.
					$lis    = $divs.parent('li');                                                 // `<li>`s that are the direct parent of `<div>`s.
					$hrefs  = $lis.children('a');                                                 // `<a>`s whom are the immediate children of `<li>`s.
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					$this.data(constants.NS, {
						
						divs    : $divs,
						hrefs   : $hrefs,
						init    : false,
						lis     : $lis,
						options : options,
						outside : false,
						target  : $this
						
					});
					
					//----------------------------------
					// Easy access:
					//----------------------------------
					
					data = $this.data(constants.NS);
					
				}
				
				//----------------------------------
				// Data initialization check:
				//----------------------------------
				
				if ( ! data.init) {
					
					//----------------------------------
					// Call main:
					//----------------------------------
					
					_main.call($this, data);
					
				} else {
					
					//----------------------------------
					// Ouch!
					//----------------------------------
					
					console.warn('jQuery.' + constants.NS, 'thinks it\'s already initialized on', this);
					
					//return this; // Needed?
					
				}
				
			});
			
		}, // init
		
		//----------------------------------
		
		/**
		 * Open menu.
		 *
		 * @type { function }
		 * @param { object.jquery } $elem An `<li>` element.
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		open : function($elem) {
			
			//----------------------------------
			// Handle API invoked method:
			//----------------------------------
			
			if (typeof $elem == 'undefined') {
				
				$elem = this;
				
			}
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return $elem.each(function() {
				
				//----------------------------------
				// Declare/initialize:
				//----------------------------------
				
				var $this = $(this),
				    data  = $this.parent().data(constants.NS),
				    $div;
				
				//----------------------------------
				// Already open?
				//----------------------------------
				
				if ( ! $this.hasClass(data.options.openClass)) {
					
					//data.hrefs.not($this.children('a')).blur(); // Removes focus from other hrefs if there's focus and a hover; commented out for now because it seems like overkill.
					
					//----------------------------------
					// Get child `<div>`:
					//----------------------------------
					
					$div = $this.children('div');
					
					$this
						
						//----------------------------------
						// Add hover class:
						//----------------------------------
						
						.addClass(data.options.openClass)
						
						//----------------------------------
						// Remove adjacent "openClass"es:
						//----------------------------------
						
						.siblings()
						.removeClass(data.options.openClass)
						
						//----------------------------------
						// Adjacent `<div>`s:
						//----------------------------------
						
						.children('div')
						
						//----------------------------------
						// Stop animation and clear queue:
						//----------------------------------
						
						.stop(true) // Required & very important!
						
						//----------------------------------
						// Hide `<div>`s:
						//----------------------------------
						
						.hide()
						.css('visibility', 'hidden'); // Fixes an IE<8 bug.
					
					//----------------------------------
					// Open menu:
					//----------------------------------
					
					$div
						
						//----------------------------------
						// If it's hidden:
						//----------------------------------
						
						.filter(':hidden')
						
						//----------------------------------
						// Make it visible:
						//----------------------------------
						
						.css('visibility', 'visible'); // Fixes an IE<8 bug.
					
					//----------------------------------
					// Callback:
					//----------------------------------
					
					data.options.onBeforeShow.call($div);
					
					//----------------------------------
					// Animate open:
					//----------------------------------
					
					$div.animate(data.options.animIn, data.options.speedIn, data.options.easeIn, function() {
						
						//----------------------------------
						// Callback:
						//----------------------------------
						
						data.options.onShow.call($(this));
						
					});
					
				}
				
			});
			
		}, // open
		
		//----------------------------------
		
		/**
		 * Close menu.
		 *
		 * @type { function }
		 * @param { object.jquery } $elem An `<li>` object.
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		close : function($elem) {
			
			//----------------------------------
			// Handle API invoked method:
			//----------------------------------
			
			if (typeof $elem == 'undefined') {
				
				$elem = this;
				
			}
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return $elem.each(function() {
				
				//----------------------------------
				// Declare/initialize:
				//----------------------------------
				
				var $this = $(this),
				    data  = $this.parent().data(constants.NS),
				    $div;
				
				//----------------------------------
				// Open?
				//----------------------------------
				
				if ($this.hasClass(data.options.openClass)) {
					
					//----------------------------------
					// Get child `<div>`:
					//----------------------------------
					
					$div = $this.children('div');
					
					$this
						
						//----------------------------------
						// Remove click class:
						//----------------------------------
						
						.children('a')
						.removeClass(settings.internal.clickClass)
						
						//----------------------------------
						// Aid CSS and blur:
						//----------------------------------
						
						.blur();
					
					//----------------------------------
					// Callback:
					//----------------------------------
					
					data.options.onBeforeHide.call($div);
					
					//----------------------------------
					// Animate close:
					//----------------------------------
					
					$div.animate(data.options.animOut, data.options.speedOut, data.options.easeOut, function() {
						
						//----------------------------------
						// Declare/initialize:
						//----------------------------------
						
						var $$ = $(this);
						
						$$
							
							//----------------------------------
							// Hide `<div>`s:
							//----------------------------------
							
							.hide()
							.css('visibility', 'hidden') // Fixes an IE<8 bug.
							
							//----------------------------------
							// Remove `openClass`:
							//----------------------------------
							
							.parent()
							.removeClass(data.options.openClass);
						
						//----------------------------------
						// Callback:
						//----------------------------------
						
						data.options.onHide.call($$);
						
					});
					
				}
				
			});
			
		}, // close
		
		//----------------------------------
		
		/**
		 * Removes plugin from element.
		 *
		 * @type { function }
		 * @this { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		destroy : function() {
			
			//----------------------------------
			// Loop & return each this:
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Declare/initialize:
				//----------------------------------
				
				var $this = $(this),
				    data  = $this.data(constants.NS);
				
				if (data) {
					
					//----------------------------------
					// Hide menus:
					//----------------------------------
					
					data.divs.removeAttr('style');
					
					//----------------------------------
					// Close buttons (touch only)?
					//----------------------------------
					
					if (((data.options.eventType === 'click') || constants.TOUCH) && data.options.close) {
						
						data.divs
							
							//----------------------------------
							// Find `<div>`'s button HTML:
							//----------------------------------
							
							.find('.' + settings.internal.closeClass)
							
							//----------------------------------
							// Remove:
							//----------------------------------
							
							.remove();
						
					}
					
					//--------------------------------------------------------------------
					
					//----------------------------------
					// Remove event handler(s):
					//----------------------------------
					
					data.hrefs.off('.' + constants.NS);
					
					//----------------------------------
					// Link arrows?
					//----------------------------------
					
					if (data.options.arrow) {
						
						data.hrefs
							
							//----------------------------------
							// Remove anchor class:
							//----------------------------------
							
							.removeClass(settings.internal.anchorClass)
							
							//----------------------------------
							// Find `<a>`'s arrow HTML:
							//----------------------------------
							
							.find('.' + settings.internal.arrowClass)
							
							//----------------------------------
							// Remove:
							//----------------------------------
							
							.remove(); // All bound events and jQuery data associated with the elements are removed: rgne.ws/LqMnF5
						
					}
					
					//----------------------------------
					// Remove click class from hrefs:
					//----------------------------------
					
					data.hrefs.removeClass(settings.internal.clickClass);
					
					//--------------------------------------------------------------------
					
					data.lis
						
						//----------------------------------
						// Event type?:
						//----------------------------------
						
						.removeData(constants.NS + '.mousedown')
						
						//----------------------------------
						// Remove event handler(s):
						//----------------------------------
						
						.off('.' + constants.NS);
					
					//--------------------------------------------------------------------
					
					//----------------------------------
					// Root menu CSS class:
					//----------------------------------
					
					data.target.removeClass(settings.internal.menuClass);
					
					//----------------------------------
					// Namespaced instance data:
					//----------------------------------
					
					$this.removeData(constants.NS);
					
				}
			
			});
			
		} // destroy
		
	}, // methods
	
	//--------------------------------------------------------------------------
	//
	// Private methods:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Called after plugin initialization.
	 *
	 * @private
	 * @type { function }
	 * @this { object.jquery }
	 */
	
	_main = function(data) {
		
		//----------------------------------
		// Data?
		//----------------------------------
		
		if (typeof data == 'undefined') {
			
			//----------------------------------
			// Attempt to determine data:
			//----------------------------------
			
			data = this.data(constants.NS);
			
		}
		
		//----------------------------------
		// Data?
		//----------------------------------
		
		if (data) {
			
			//----------------------------------
			// Yup!
			//----------------------------------
			
			data.init = true; // Data initialization flag.
			
			//----------------------------------
			// Callback:
			//----------------------------------
			
			data.options.onInit.call(data.target);
			
			//----------------------------------
			// Check for object(s):
			//----------------------------------
			
			if ((data.divs.length === data.hrefs.length)) { // There will always be one `<li>` per `<div>`, so we compare `<div>`s equivalency to it's `<a>` siblings.
				
				//----------------------------------
				// Root menu CSS class:
				//----------------------------------
				
				data.target.addClass(settings.internal.menuClass);
				
				//----------------------------------
				// Hide menus:
				//----------------------------------
				
				data.divs.hide();
				
				//----------------------------------
				// Normalize event type:
				//----------------------------------
				
				data.options.eventType = (/^(?:click|hover|hoverIntent)$/).test(data.options.eventType) ? data.options.eventType : 'hover'; // rgne.ws/Mxhw5C
				
				//----------------------------------
				// Link arrows?
				//----------------------------------
				
				if (data.options.arrow) {
					
					data.hrefs
						
						//----------------------------------
						// Add anchor class:
						//----------------------------------
						
						.addClass(settings.internal.anchorClass)
						
						//----------------------------------
						// Append arrow HTML to `<a>`s:
						//----------------------------------
						
						.append(data.options.arrow);
					
				}
				
				//----------------------------------
				// Close buttons (touch/click only)?
				//----------------------------------
				
				if (((data.options.eventType === 'click') || constants.TOUCH) && data.options.close) {
					
					//----------------------------------
					// Create new DOM element:
					//----------------------------------
					
					$(data.options.close)
						
						//----------------------------------
						// Append button HTML to `<div>`s:
						//----------------------------------
						
						.appendTo(data.divs)
						
						//----------------------------------
						// Attach event handler(s):
						//----------------------------------
						
						.on(constants.TYPE + '.' + constants.NS, function(e) {
							
							//----------------------------------
							// Declare/initialize:
							//----------------------------------
							
							var $li = $(this).parent('div').parent('li'); // Save a var and move this line to call()?
							
							//----------------------------------
							// Close menu:
							//----------------------------------
							
							methods.close.call($li);
							
							//----------------------------------
							// Prevent default & stop bubbling:
							//----------------------------------
							
							e.preventDefault(); // Probably not needed here?
							e.stopPropagation();
							
						});
					
				}
				
				//----------------------------------
				// Attach event handler(s):
				//----------------------------------
				
				data.hrefs.on('mousedown.' + constants.NS + ' mouseup.' + constants.NS + ' focus.' + constants.NS, function(e) { // rgne.ws/O0PD7y
					
					//----------------------------------
					// Declare/initialize:
					//----------------------------------
					
					var $this = $(this),
					    $li   = $this.parent('li');
					
					//----------------------------------
					// Event type?:
					//----------------------------------
					
					switch (e.type) {
						
						case 'mousedown':
							
							//----------------------------------
							// Mouse is down (add mousedown):
							//----------------------------------
							
							$li.data(constants.NS + '.mousedown', true); // rgne.ws/NIZSit
							
							break;
						
						case 'mouseup':
							
							//----------------------------------
							// Mouse is up (remove mousedown):
							//----------------------------------
							
							$li.removeData(constants.NS + '.mousedown');
							
							break;
						
						case 'focus':
							
							//----------------------------------
							// Link has focus:
							//----------------------------------
							
							if ( ! $li.data(constants.NS + '.mousedown')) {
								
								//----------------------------------
								// Touch or click?
								//----------------------------------
								
								if (constants.TOUCH || (data.options.eventType === 'click')) {
									
									//----------------------------------
									// Override focus:
									//----------------------------------
									
									$this.click();
									
								} else {
									
									//----------------------------------
									// Start outside events?
									//----------------------------------
									
									if (data.options.eventOutside) {
										
										_startOutside(data);
										
									}
									
									//----------------------------------
									// Open menu:
									//----------------------------------
									
									methods.open.call($li);
									
								}
								
							}
							
							break;
						
					}
					
					//----------------------------------
					// Prevent default & stop bubbling:
					//----------------------------------
					
					e.preventDefault();
					e.stopPropagation();
					
				});
				
				//----------------------------------
				// Is it a click or touch?
				//----------------------------------
				
				if (constants.TOUCH || (data.options.eventType === 'click')) {
					
					//----------------------------------
					// Attach event handler(s):
					//----------------------------------
					
					data.hrefs.on(constants.TYPE + '.' + constants.NS, function(e) {
						
						//----------------------------------
						// Declare/initialize:
						//----------------------------------
						
						var $this = $(this),
						    $li   = $this.parent('li'),
						    uri;
						
						//----------------------------------
						// A click, but is it first click?
						//----------------------------------
						
						if ($this.hasClass(settings.internal.clickClass)) {
							
							//----------------------------------
							// End outside events?
							//----------------------------------
							
							if (data.options.eventOutside) {
								
								_endOutside(data);
								
							}
							
							//----------------------------------
							// Close menu:
							//----------------------------------
							
							methods.close.call($li); // Fixes issue when back button is clicked and `window.location` is called again.
							
							//----------------------------------
							// Get link:
							//----------------------------------
							
							uri = _getUri.call($this);
							
							//----------------------------------
							// Follow link?
							//----------------------------------
							
							if (uri) {
								
								window.location = uri;
								
							}
							
						} else {
							
							//----------------------------------
							// Start outside events?
							//----------------------------------
							
							if (data.options.eventOutside) {
								
								_startOutside(data);
								
							}
							
							//----------------------------------
							// Remove `clickClass` from `hrefs`:
							//----------------------------------
							
							data.hrefs.removeClass(settings.internal.clickClass);
							
							//----------------------------------
							// Add `clickClass` to `this`:
							//----------------------------------
							
							$this.addClass(settings.internal.clickClass);
							
							//----------------------------------
							// Open menu:
							//----------------------------------
							
							methods.open.call($li);
							
						}
						
						//----------------------------------
						// Prevent default & stop bubbling:
						//----------------------------------
						
						e.preventDefault();
						e.stopPropagation();
						
					});
					
				} else {
					
					//----------------------------------
					// Attach event handler(s):
					//----------------------------------
					
					data.lis.on('mouseenter.' + constants.NS + ' mouseleave.' + constants.NS, function(e) {
						
						//----------------------------------
						// Declare/initialize:
						//----------------------------------
						
						var $this = $(this);
						
						//----------------------------------
						// Event type?:
						//----------------------------------
						
						switch (e.type) {
							
							case 'mouseenter':
								
								//----------------------------------
								// End outside events?
								//----------------------------------
								
								if (data.options.eventOutside) {
									
									_endOutside(data);
									
								}
								
								//----------------------------------
								// Hover open:
								//----------------------------------
								
								$.fn[constants.NS].hoverEnter.call($this);
								
								break;
							
							case 'mouseleave':
								
								//----------------------------------
								// Hover close:
								//----------------------------------
								
								$.fn[constants.NS].hoverLeave.call($this);
								
								break;
							
						}
						
					});
					
				}
				
				//----------------------------------
				// Callback:
				//----------------------------------
				
				data.options.onAfterInit.call(data.target);
				
			} else {
				
				//----------------------------------
				// Problemos:
				//----------------------------------
				
				console.warn('jQuery.' + constants.NS, 'thinks there\'s a problem with your markup');
				
			}
			
		}
		
	}, // _main
	
	//----------------------------------
	
	/**
	 * Determine if click/touch/focus "outside" detection is needed.
	 *
	 * @private
	 * @see rgne.ws/LRzBkh
	 * @see rgne.ws/PX2ITp
	 * @type { function }
	 * @param { object } data Data object literal.
	 */
	
	_startOutside = function(data) {
		
		//----------------------------------
		// Declare:
		//----------------------------------
		
		var $doc;
		
		//----------------------------------
		// Check if we're not already setup:
		//----------------------------------
		
		if ( ! data.outside) { // Should I check for data before doing anything?
			
			//----------------------------------
			// Switch flag:
			//----------------------------------
			
			data.outside = true;
			
			//----------------------------------
			// Callback:
			//----------------------------------
			
			data.options.onStartOutside.call(data.target); // Best spot for this? What object should I pass?
			
			//----------------------------------
			// Cache the document:
			//----------------------------------
			
			$doc = $(document); // rgne.ws/OvKeU6
			
			//----------------------------------
			// Detach event handler(s):
			//----------------------------------
			
			$doc.off('.' + constants.NS);
			
			//----------------------------------
			// Attach event handler(s):
			//----------------------------------
			
			$doc.on('focusin.' + constants.NS + ' ' + constants.TYPE + '.' + constants.NS, function(e) { // Mac OS X/Firefox: `focusin` required for `focus` outside nav.
				
				//----------------------------------
				// Make sure we're not our target:
				//----------------------------------
				
				if ($(e.target).closest(data.target).length === 0) {
					
					//----------------------------------
					// End outside events?
					//----------------------------------
					
					_endOutside(data);
					
					//----------------------------------
					// Close menu:
					//----------------------------------
					
					methods.close.call(data.lis);
					
				} else {
					
					// @TODO: Remove?
					return true; // rgne.ws/NBP2qS
					
				}
				
			});
			
		}
		
	}, // _startOutside
	
	//--------------------------------------------------------------------
	
	/**
	 * Remove click/touch/focus outside detection.
	 *
	 * @private
	 * @type { function }
	 * @param { object } data Data object literal.
	 */
	
	_endOutside = function(data) {
		
		//----------------------------------
		// Check if we're already setup:
		//----------------------------------
		
		if (data.outside) {
			
			//----------------------------------
			// Callback:
			//----------------------------------
			
			data.options.onEndOutside.call(data.target); // Best spot for this? What object should I pass?
			
			//----------------------------------
			// Switch flag:
			//----------------------------------
			
			data.outside = false;
			
			//----------------------------------
			// Detach event handler(s):
			//----------------------------------
			
			$(document).off('.' + constants.NS);
			
		}
		
	}, // _endOutside
	
	//--------------------------------------------------------------------
	
	/**
	 * Get URI from `<a>`s href attribute.
	 *
	 * @private
	 * @type { function }
	 * @this { object.jquery } An `<a>` with href.
	 * @return { string|boolean } An `<a>` href value or false.
	 */
	
	_getUri = function() {
		
		//----------------------------------
		// Declare/initialize:
		//----------------------------------
		
		var uri = this.attr('href'); // Get link from href attribute.
		
		//----------------------------------
		// Return link or false:
		//----------------------------------
		
		return (uri && (uri !== '#')) ? uri : false; // @TODO: Improve URI validation?
		
	}; // _getUri
	
	//--------------------------------------------------------------------------
	//
	// Method calling logic:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Boilerplate plugin logic.
	 *
	 * @constructor
	 * @see rgne.ws/OvKpPc
	 * @type { function }
	 * @param { string } method String method identifier.
	 * @return { method } Calls plugin method with supplied params.
	 */
	
	$.fn[constants.NS] = function(method) {
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method == 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('jQuery.' + constants.NS + ' thinks that ' + method + ' doesn\'t exist'); // Should I override? rgne.ws/MwgkP8
			
		}
		
	}; // $.fn[constants.NS]
	
	//--------------------------------------------------------------------------
	//
	// Public access to secondary functions:
	// rgne.ws/OvKvX5
	// rgne.ws/P8v8IQ
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Called when mouse enters `<li>`.
	 *
	 * @type { function }
	 * @this { object.jquery }
	 * @return { object.jquery } Returns target object(s) for chaining purposes.
	 */
	
	$.fn[constants.NS].hoverEnter = function() {
		
		//----------------------------------
		// Loop & return each this:
		//----------------------------------
		
		return this.each(function() {
			
			//----------------------------------
			// Declare/initialize:
			//----------------------------------
			
			var $this = $(this),
			    data  = $this.parent().data(constants.NS);
			
			//----------------------------------
			// Just open or open with intent?
			//----------------------------------
			
			if (( ! $.fn.doTimeout) || (data.options.eventType !== 'hoverIntent')) {
				
				//----------------------------------
				// Open menu:
				//----------------------------------
				
				methods.open.call($this); // $.fn[constants.NS]('open', $this);
				
			} else {
				
				//----------------------------------
				// With intent:
				//----------------------------------
				
				$this.doTimeout('hover', data.options.delayIn, function() {
					
					//----------------------------------
					// Open menu:
					//----------------------------------
					
					methods.open.call($(this)); // $.fn[constants.NS]('open', $(this));
					
				});
				
			}
			
		});
		
	}; // hoverEnter()
	
	//--------------------------------------------------------------------
	
	/**
	 * Called when mouse leaves `<li>`.
	 *
	 * @type { function }
	 * @this { object.jquery }
	 * @return { object.jquery } Returns target object(s) for chaining purposes.
	 */
	
	$.fn[constants.NS].hoverLeave = function() {
		
		//----------------------------------
		// Loop & return each `this`:
		//----------------------------------
		
		return this.each(function() {
			
			//----------------------------------
			// Declare/initialize:
			//----------------------------------
			
			var $this = $(this),
			    data  = $this.parent().data(constants.NS);
			
			//----------------------------------
			// Just close or close with intent?
			//----------------------------------
			
			if (( ! $.fn.doTimeout) || (data.options.eventType !== 'hoverIntent')) {
				
				//----------------------------------
				// Close menu:
				//----------------------------------
				
				methods.close.call($this); // $.fn[constants.NS]('close', $this);
				
			} else {
				
				//----------------------------------
				// With intent:
				//----------------------------------
				
				$this.doTimeout('hover', data.options.delayOut, function() {
					
					//----------------------------------
					// Close menu:
					//----------------------------------
					
					methods.close.call($(this)); // $.fn[constants.NS]('close', $(this));
					
				});
				
			}
		
		});
		
	}; // hoverLeave
	
	//--------------------------------------------------------------------------
	//
	// Default settings:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Private settings.
	 *
	 * @type { object }
	 */
	
	settings.internal = {
		
		anchorClass : constants.PREFIX + '-a-with-div', // The `<a>`s with `<div>` siblings.
		arrowClass  : constants.PREFIX + '-arrow',      // Link arrows.
		clickClass  : constants.PREFIX + '-a-clicked',  // First or second click?
		closeClass  : constants.PREFIX + '-close',      // Close buttons.
		menuClass   : constants.PREFIX + '-js-enabled'  // Target menu.
		
	}; // settings.internal
	
	//----------------------------------
	
	/**
	 * Public settings.
	 *
	 * @type { object }
	 */
	
	settings.external = {
		
		animIn       : { opacity: 'show' },                                                // What animation object to use to show the submenus.
		animOut      : { opacity: 'hide' },                                                // IBID, but for hiding.
		arrow        : '<span class="' + settings.internal.arrowClass + '">&#187;</span>', // Markup to use for sub-menu arrow indicators; set to false to disable this feature.
		close        : '<span class="' + settings.internal.closeClass + '">(X)</span>',    // Markup to use for close buttons when eventType is click or it's a touch device; set to false to disable this feature.
		delayIn      : 400,                                                                // The delay in milliseconds that the mouse can hover "inside" the menu before it opens.
		delayOut     : 700,                                                                // The delay in milliseconds that the mouse can hover "outside" the menu before it closes.
		easeIn       : 'swing',                                                            // Easing function in.
		easeOut      : 'swing',                                                            // Easing function out.
		eventOutside : true,                                                               // Detect click outside events?
		eventType    : 'hover',                                                            // One of "click", "hover" or "hoverIntent".
		openClass    : constants.PREFIX + '-open',                                         // Applied to opened `<li>`s.
		speedIn      : 'normal',                                                           // Animation speed in.
		speedOut     : 'normal',                                                           // Animation speed out.
		
		// Callbacks:
		
		onInit         : $.noop, // After plugin data initialized.
		onAfterInit    : $.noop, // After plugin initialization.
		onBeforeShow   : $.noop, // Before reveal animation begins.
		onShow         : $.noop, // After reveal animation ends.
		onBeforeHide   : $.noop, // Before hide animation begins.
		onHide         : $.noop, // After hide animation ends.
		onStartOutside : $.noop, // When outside events start.
		onEndOutside   : $.noop  // When outside events end.
		
	}; // settings.external
	
	//----------------------------------
	
	/**
	 * Assign defaults to external.
	 *
	 * @type { object }
	 */
	
	$.fn[constants.NS].defaults = settings.external; // rgne.ws/Mxifnq
	
}(jQuery, window, document));