/**
 * jQuery MegaWhale
 *
 * @author    Micky Hulse
 * @link      http://hulse.me
 * @docs      https://github.com/registerguard/jquery-megawhale
 * @copyright Copyright (c) 2012 Micky Hulse.
 * @license   Dual licensed under the MIT or GPL Version 2 licenses.
 * @version   1.0.0
 * @date      2012/07/07
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
// Check usage of "this": Does it need to be $(this) when passed?
// Learn proper syntax/style for JS docs.
// Make open/close methods "more" public.
// What's the best thing to return via callback methods (i.e. the menu UL or the current item.)?
// Use ((this instanceof jQuery) ? this : $(this)) where $(this) is uncertain. <rgne.ws/NbAsvY>

//----------------------------------

;(function($) {
	
	//--------------------------------------------------------------------------
	//
	// Global variables:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Detects if it's a touch device.
	 * Used in "constants" object literal.
	 *
	 * @link rgne.ws/N9c4uV
	 * @link rgne.ws/Nq086y
	 */
	
	var touch = (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)),
	
	//--------------------------------------------------------------------------
	//
	// Constants:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Commonly used variables.
	 *
	 * @type { object }
	 *
	 * @const
	 */
	
	constants = {
		
		C      : ((typeof console !== 'undefined') ? true : false), // Check if the javascript console is available.
		NS     : 'megawhale',                                       // Namespace identifier.
		PREFIX : 'mw',                                              // Class prefix.
		TOUCH  : touch,                                             // Touch capable?
		TYPE   : (touch ? 'touchstart' : 'click')                   // rgne.ws/NaVbjk
		
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
		 * @type   { function }
		 * @param  { object } opts Options object literal.
		 * @this   { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		init : function(opts) {
			
			//----------------------------------
			// Loop & return each "this":
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Local variable(s):
				//----------------------------------
				
				var $this = $(this),                                                            // Target object.
				data      = $this.data(constants.NS),                                           // Namespace instance data.
				options   = $.extend({}, settings.external, $.fn[constants.NS].defaults, opts); // Merge settings, defaults and options.
				
				//----------------------------------
				// Initialize data:
				//----------------------------------
				
				if ( ! data) {
					
					//----------------------------------
					// Select primary objects:
					//----------------------------------
					
					var $divs = $this.children('li').children('div'), // <div>s whom are the immediate children of <li>s.
					$lis      = $divs.parent('li'),                   // <li>s that are the direct parent of <div>s.
					$hrefs    = $lis.children('a');                   // <a>s whom are the immediate children of <li>s.
					
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
					// Easy access for later:
					//----------------------------------
					
					data = $this.data(constants.NS);
					
				}
				
				//----------------------------------
				// Data initialization check:
				//----------------------------------
				
				if ( ! data.init) {
					
					//----------------------------------
					// Data initialization flag:
					//----------------------------------
					
					data.init = true;
					
					//----------------------------------
					// Callback:
					//----------------------------------
					
					options.onInit.call($this);
					
					//----------------------------------
					// Check for object(s):
					//----------------------------------
					
					if (($divs.length === $hrefs.length)) { // There will always be one <li> per <div>, so we compare <div>s equivalency to it's <a> siblings.
						
						//----------------------------------
						// Root menu CSS class:
						//----------------------------------
						
						$this.addClass(settings.internal.menuClass);
						
						//----------------------------------
						// Hide menus:
						//----------------------------------
						
						$divs.hide();
						
						//----------------------------------
						// Normalize event type:
						//----------------------------------
						
						options.eventType = (/^(?:click|hover|hoverIntent)$/).test(options.eventType) ? options.eventType : 'hover'; // rgne.ws/Mxhw5C
						
						//----------------------------------
						// Link arrows?
						//----------------------------------
						
						if (options.arrow) {
							
							$hrefs
								
								//----------------------------------
								// Add anchor class:
								//----------------------------------
								
								.addClass(settings.internal.anchorClass)
								
								//----------------------------------
								// Append arrow HTML to <a>s:
								//----------------------------------
								
								.append(options.arrow);
								
						}
						
						//----------------------------------
						// Close buttons (touch/click only)?
						//----------------------------------
						
						if (((options.eventType === 'click') || constants.TOUCH) && options.close) {
							
							//----------------------------------
							// Create new DOM element:
							//----------------------------------
							
							$(options.close)
								
								//----------------------------------
								// Append button HTML to <div>s:
								//----------------------------------
								
								.appendTo($divs)
								
								//----------------------------------
								// Attach event handler(s):
								//----------------------------------
								
								.on(constants.TYPE + '.' + constants.NS, function(e) {
									
									//----------------------------------
									// Local variable(s):
									//----------------------------------
									
									var $li = $(this).parent('div').parent('li');
									
									//----------------------------------
									// Close menu:
									//----------------------------------
									
									methods.close.call($li);
									
									//----------------------------------
									// Prevent default & stop bubbling:
									//----------------------------------
									
									e.preventDefault(); // Probably not needed here.
									e.stopPropagation();
									
								});
							
						}
						
						//----------------------------------
						// Attach event handler(s):
						//----------------------------------
						
						// rgne.ws/O0PD7y
						$hrefs.on('mousedown.' + constants.NS + ' mouseup.' + constants.NS + ' focus.' + constants.NS, function(e) {
							
							//----------------------------------
							// Local variable(s):
							//----------------------------------
							
							var $$ = $(this),
							$li = $$.parent('li');
							
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
										
										if (constants.TOUCH || (options.eventType === 'click')) {
											
											//----------------------------------
											// Override focus:
											//----------------------------------
											
											$$.click();
											
										} else {
											
											//----------------------------------
											// Start outside events?
											//----------------------------------
											
											if (options.eventOutside) startOutside(data);
											
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
						
						if (constants.TOUCH || (options.eventType === 'click')) {
							
							//----------------------------------
							// Attach event handler(s):
							//----------------------------------
							
							$hrefs.on(constants.TYPE + '.' + constants.NS, function(e) {
								
								//----------------------------------
								// Local variable(s):
								//----------------------------------
								
								var $$ = $(this),
								$li    = $$.parent('li');
								
								//----------------------------------
								// A click, but is it first click?
								//----------------------------------
								
								if ($$.hasClass(settings.internal.clickClass)) {
									
									//----------------------------------
									// End outside events?
									//----------------------------------
									
									if (options.eventOutside) endOutside(data);
									
									//----------------------------------
									// Close menu:
									//----------------------------------
									
									methods.close.call($li); // Fixes issue when back button is clicked and window.location is called again.
									
									//----------------------------------
									// Get link:
									//----------------------------------
									
									var uri = getUri.call($$);
									
									//----------------------------------
									// Follow link?
									//----------------------------------
									
									if (uri) window.location = uri;
									
								} else {
									
									//----------------------------------
									// Start outside events?
									//----------------------------------
									
									if (options.eventOutside) startOutside(data);
									
									//----------------------------------
									// Remove click class from hrefs:
									//----------------------------------
									
									$hrefs.removeClass(settings.internal.clickClass);
									
									//----------------------------------
									// Add click class to this:
									//----------------------------------
									
									$$.addClass(settings.internal.clickClass);
									
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
							
							$lis.on('mouseenter.' + constants.NS + ' mouseleave.' + constants.NS, function(e) {
								
								//----------------------------------
								// Local variable(s):
								//----------------------------------
								
								var $$ = $(this);
								
								//----------------------------------
								// Event type?:
								//----------------------------------
								
								switch (e.type) {
									
									case 'mouseenter':
										
										//----------------------------------
										// End outside events?
										//----------------------------------
										
										if (options.eventOutside) endOutside(data);
										
										//----------------------------------
										// Hover open:
										//----------------------------------
										
										$.fn[constants.NS].hoverEnter.call($$);
										
										break;
									
									case 'mouseleave':
										
										//----------------------------------
										// Hover close:
										//----------------------------------
										
										$.fn[constants.NS].hoverLeave.call($$);
										
										break;
									
								}
								
							});
							
						}
						
						//----------------------------------
						// Callback:
						//----------------------------------
						
						options.onAfterInit.call($this);
						
					} else {
						
						if (constants.C) console.warn('there was a problem with your markup');
						
						return this;
						
					}
					
				} else {
					
					if (constants.C) console.warn(constants.NS, 'already initialized on', this);
					
					return this;
					
				}
				
			});
			
		}, // init()
		
		//--------------------------------------------------------------------
		
		/**
		 * Open menu.
		 *
		 * @type   { function }
		 * @param  { object.jquery } $elem An <li> element.
		 * @this   { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		open : function($elem) {
			
			//----------------------------------
			// Handle API invoked method:
			//----------------------------------
			
			if (typeof $elem === 'undefined') $elem = this; // Remove var.
			
			//----------------------------------
			// Loop & return each "this":
			//----------------------------------
			
			return $elem.each(function() {
				
				//----------------------------------
				// Local variable(s):
				//----------------------------------
				
				var $$  = $(this),
				data    = $$.parent().data(constants.NS),
				options = data.options;
				
				//----------------------------------
				// Already open?
				//----------------------------------
				
				if ( ! $$.hasClass(options.openClass)) {
					
					//data.hrefs.not($$.children('a')).blur(); // Removes focus from other hrefs if there's focus and a hover; commented out for now because it seems like overkill.
					
					//----------------------------------
					// Get child <div>:
					//----------------------------------
					
					var $div = $$.children('div');
					
					$$
						
						//----------------------------------
						// Add hover class:
						//----------------------------------
						
						.addClass(options.openClass)
						
						//----------------------------------
						// Remove adjacent open classes:
						//----------------------------------
						
						.siblings()
						.removeClass(options.openClass)
						
						//----------------------------------
						// Adjacent <div>s:
						//----------------------------------
						
						.children('div')
						
						//----------------------------------
						// Stop animation and clear queue:
						//----------------------------------
						
						.stop(true) // Required/important!
						
						//----------------------------------
						// Hide <div>s:
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
					
					options.onBeforeShow.call($div);
					
					//----------------------------------
					// Animate open:
					//----------------------------------
					
					$div.animate(options.animIn, options.speedIn, options.easeIn, function() {
						
						//----------------------------------
						// Callback:
						//----------------------------------
						
						options.onShow.call($div);
						
					});
					
				}
				
			});
			
		}, // open()
		
		//--------------------------------------------------------------------
		
		/**
		 * Close menu.
		 *
		 * @type   { function }
		 * @param  { object.jquery } $elem An <li> object.
		 * @this   { object.jquery }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		close : function($elem) {
			
			//----------------------------------
			// Handle API invoked method:
			//----------------------------------
			
			if (typeof $elem === 'undefined') $elem = this;
			
			//----------------------------------
			// Loop & return each "this":
			//----------------------------------
			
			return $elem.each(function() {
				
				//----------------------------------
				// Local variable(s):
				//----------------------------------
				
				var $$  = $(this),
				data    = $$.parent().data(constants.NS),
				options = data.options;
				
				//----------------------------------
				// Open?
				//----------------------------------
				
				if ($$.hasClass(options.openClass)) {
					
					//----------------------------------
					// Get child <div>:
					//----------------------------------
					
					var $div = $$.children('div');
					
					$$
						
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
					
					options.onBeforeHide.call($div);
					
					//----------------------------------
					// Animate close:
					//----------------------------------
					
					$div.animate(options.animOut, options.speedOut, options.easeOut, function() {
						
						$(this)
						
							//----------------------------------
							// Hide <div>s:
							//----------------------------------
							
							.hide()
							.css('visibility', 'hidden') // Fixes an IE<8 bug.
							
							//----------------------------------
							// Remove open class:
							//----------------------------------
							
							.parent()
							.removeClass(options.openClass);
						
						//----------------------------------
						// Callback:
						//----------------------------------
						
						options.onHide.call($div);
						
					});
					
				}
				
			});
			
		}, // close()
		
		//--------------------------------------------------------------------
		
		/**
		 * Removes plugin from element.
		 *
		 * @type   { function }
		 * @return { object.jquery } Returns target object(s) for chaining purposes.
		 */
		
		destroy : function() {
			
			//----------------------------------
			// Loop & return each "this":
			//----------------------------------
			
			return this.each(function() {
				
				//----------------------------------
				// Local variable(s):
				//----------------------------------
				
				var $$ = $(this),
				data   = $$.data(constants.NS);
				
				if (data) {
					
					//----------------------------------
					// Local variable(s):
					//----------------------------------
					
					var options = data.options;
					
					//--------------------------------------------------------------------
					
					//----------------------------------
					// Hide menus:
					//----------------------------------
					
					data.divs.removeAttr('style');
					
					//----------------------------------
					// Close buttons (touch only)?
					//----------------------------------
					
					if (((options.eventType === 'click') || constants.TOUCH) && options.close) {
						
						data.divs
							
							//----------------------------------
							// Find <div>'s button HTML:
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
					
					if (options.arrow) {
						
						data.hrefs
							
							//----------------------------------
							// Remove anchor class:
							//----------------------------------
							
							.removeClass(settings.internal.anchorClass)
							
							//----------------------------------
							// Find <a>'s arrow HTML:
							//----------------------------------
							
							.find('.' + settings.internal.arrowClass)
							
							//----------------------------------
							// Remove:
							//----------------------------------
							
							.remove();
						
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
					
					$$.removeData(constants.NS);
					
				} else {
					
					if (constants.C) console.warn(constants.NS, 'already initialized on', this);
					
				}
			
			});
			
		} // destroy()
		
	}, // methods
	
	//--------------------------------------------------------------------------
	//
	// Private methods:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Determine if click/touch/focus outside detection is needed.
	 *
	 * @link  rgne.ws/LRzBkh
	 * @link  rgne.ws/PX2ITp
	 * @type  { function }
	 * @param { object } data Data object literal.
	 */
	
	startOutside = function(data) {
		
		//----------------------------------
		// Check if we're not already setup:
		//----------------------------------
		
		if ( ! data.outside) {
			
			//----------------------------------
			// Switch flag:
			//----------------------------------
			
			data.outside = true;
			
			//----------------------------------
			// Callback:
			//----------------------------------
			
			data.options.onStartOutside.call(data.target); // Best spot for this? What object should I pass?
			
			//----------------------------------
			// Local variable(s):
			//----------------------------------
			
			var $$ = $(document); // rgne.ws/OvKeU6
			
			//----------------------------------
			// Detach event handler(s):
			//----------------------------------
			
			$$.off('.' + constants.NS);
			
			//----------------------------------
			// Attach event handler(s):
			//----------------------------------
			
			$$.on('focusin.' + constants.NS + ' ' + constants.TYPE + '.' + constants.NS, function(e) { // Mac OS X/Firefox: "focusin" required for "focus" outside nav.
				
				//----------------------------------
				// Make sure we're not our target:
				//----------------------------------
				
				if ($(e.target).closest(data.target).length === 0) {
					
					//----------------------------------
					// End outside events?
					//----------------------------------
					
					endOutside(data);
					
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
		
	}, // startOutside()
	
	//--------------------------------------------------------------------
	
	/**
	 * Remove click/touch/focus outside detection.
	 *
	 * @type  { function }
	 * @param { object } data Data object literal.
	 */
	
	endOutside = function(data) {
		
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
		
	}, // endOutside()
	
	//--------------------------------------------------------------------
	
	/**
	 * Get URI from <a>s href attribute.
	 * 
	 * @type   { function }
	 * @this   { object.jquery } An <a> with href.
	 * @return { string|boolean } An <a> href value or false.
	 */
	
	getUri = function() {
		
		//----------------------------------
		// Local variable(s):
		//----------------------------------
		
		var uri = this.attr('href'); // Get link from href attribute.
		
		//----------------------------------
		// Return link or false:
		//----------------------------------
		
		return (uri && (uri !== '#')) ? uri : false; // @TODO: Improve URI validation?
		
	}; // getUri()
	
	//--------------------------------------------------------------------------
	//
	// Method calling logic:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Boilerplate plugin logic.
	 *
	 * @link   rgne.ws/OvKpPc
	 * @type   { function }
	 * @param  { string } method String method identifier.
	 * @return { method } Calls plugin method with supplied params.
	 *
	 * @constructor
	 */
	
	$.fn[constants.NS] = function(method) {
		
		//----------------------------------
		// Boilerplate:
		//----------------------------------
		
		if (methods[method]) {
			
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			
		} else if ((typeof method === 'object') || ( ! method)) {
			
			return methods.init.apply(this, arguments);
			
		} else {
			
			$.error('Method ' + method + ' does not exist on jQuery.' + constants.NS); // Should I override? rgne.ws/MwgkP8
			
		}
		
	}; // constructor()
	
	//--------------------------------------------------------------------------
	//
	// Public access to secondary functions:
	// rgne.ws/OvKvX5
	// rgne.ws/P8v8IQ
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Called when mouse enters <li>.
	 *
	 * @type   { function }
	 * @this   { object.jquery }
	 * @return { object.jquery } Returns target object(s) for chaining purposes.
	 */
	
	$.fn[constants.NS].hoverEnter = function() {
		
		//----------------------------------
		// Loop & return each "this":
		//----------------------------------
		
		return this.each(function() {
			
			//----------------------------------
			// Local variable(s):
			//----------------------------------
			
			var $$  = $(this),
			data    = $$.parent().data(constants.NS),
			options = data.options;
			
			//----------------------------------
			// Just open or open with intent?
			//----------------------------------
			
			if (( ! $.fn.doTimeout) || (options.eventType !== 'hoverIntent')) {
				
				//----------------------------------
				// Open menu:
				//----------------------------------
				
				methods.open.call($$); // $.fn[constants.NS]('open', $$);
				
			} else {
				
				//----------------------------------
				// With intent:
				//----------------------------------
				
				$$.doTimeout('hover', options.delayIn, function() {
					
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
	 * Called when mouse leaves <li>.
	 *
	 * @type   { function }
	 * @this   { object.jquery }
	 * @return { object.jquery } Returns target object(s) for chaining purposes.
	 */
	
	$.fn[constants.NS].hoverLeave = function() {
		
		//----------------------------------
		// Loop & return each "this":
		//----------------------------------
		
		return this.each(function() {
			
			//----------------------------------
			// Local variable(s):
			//----------------------------------
			
			var $$  = $(this),
			data    = $$.parent().data(constants.NS),
			options = data.options;
			
			//----------------------------------
			// Just close or close with intent?
			//----------------------------------
			
			if (( ! $.fn.doTimeout) || (options.eventType !== 'hoverIntent')) {
				
				//----------------------------------
				// Close menu:
				//----------------------------------
				
				methods.close.call($$); // $.fn[constants.NS]('close', $$);
				
			} else {
				
				//----------------------------------
				// With intent:
				//----------------------------------
				
				$$.doTimeout('hover', options.delayOut, function() {
					
					//----------------------------------
					// Close menu:
					//----------------------------------
					
					methods.close.call($(this)); // $.fn[constants.NS]('close', $(this));
					
				});
				
			}
		
		});
		
	}; // hoverLeave()
	
	//--------------------------------------------------------------------------
	//
	// Default settings:
	//
	//--------------------------------------------------------------------------
	
	/**
	 * Settings object.
	 *
	 * @type { object }
	 */
	
	var settings = {}; // Initialize config object.
	
	//----------------------------------
	
	/**
	 * Private settings.
	 *
	 * @type { object }
	 */
	
	settings.internal = {
		
		anchorClass : constants.PREFIX + '-a-with-div', // The <a>s with <div> siblings.
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
		eventType    : 'hover',                                                            // One of 'click', 'hover' or 'hoverIntent'.
		openClass    : constants.PREFIX + '-open',                                         // Applied to opened list items.
		speedIn      : 'normal',                                                           // Animation speed in.
		speedOut     : 'normal',                                                           // Animation speed out.
		
		// Callbacks:
		
		onInit         : function() {}, // After plugin data initialized.
		onAfterInit    : function() {}, // After plugin initialization.
		onBeforeShow   : function() {}, // Before reveal animation begins.
		onShow         : function() {}, // After reveal animation ends.
		onBeforeHide   : function() {}, // Before hide animation begins.
		onHide         : function() {}, // After hide animation ends.
		onStartOutside : function() {}, // When outside events start.
		onEndOutside   : function() {}  // When outside events end.
		
	}; // settings.external
	
	//----------------------------------
	
	/**
	 * Assign defaults to external.
	 *
	 * @type { object }
	 */
	
	$.fn[constants.NS].defaults = settings.external; // rgne.ws/Mxifnq
	
})(jQuery);