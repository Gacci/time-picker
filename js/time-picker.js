(function() {
	
	let TEMPLATE = '<div class="time-picker-drop">'+
	'    <div class="time-picker-box">'+
	'        <div class="time-hrs">'+
	'            <div class="time-hrs-box">'+
	'                <button class="time-hrs-up"><</button>'+
	'            </div>'+
	'            <div class="time-hrs-digits">'+
	'                <span class="time-hrs-digit-one">1</span>'+
	'                <span class="time-hrs-digit-two">2</span>'+
	'            </div>'+
	'            <div class="time-hrs-box">'+
	'                <button class="time-hrs-down">></button>'+
	'            </div>'+
	'        </div>'+
	'        <span class="time-colon">:</span>'+
	'        <div class="time-mins">'+
	'            <div class="time-hrs-box">'+
	'                <button class="time-mins-up"><</button>'+
	'            </div>'+
	'            <div class="time-mins-digits">'+
	'                <span class="time-mins-digit-one">0</span>'+
	'                <span class="time-mins-digit-two">0</span>'+
	'            </div>'+
	'            <div class="time-hrs-box">'+
	'                <button class="time-mins-down">></button>'+
	'            </div>'+
	'        </div>'+
	'        <button class="time-notation-ampm">'+
	'        <span class="time-notation-am">AM</span>'+
	'        <span class="time-notation-pm">PM</span>'+
	'        </button>'+
	'        <span class="time-notation-24hrs">HRS</span>'+
	'    </div>'+
	'    <div class="time-notation-select">'+
	'        <button class="time-notation-select-ampm">AM/PM</button>'+
	'        <button class="time-notation-select-24hrs">24 Hour</button>'+
	'    </div>'+
	'    <div class="time-controls">'+
	'        <button class="time-control-ok">OK</button>'+
	'        <button class="time-control-cancel">Cancel</button>'+
	'    </div>'+
	'</div>';
	



	let KEY_ESC		= 27;
	let KEY_TAB		= 9;

	let TIME_DIGIT_ZERO 			= 'time-digit-zero'
	let TIME_PICKER_OPEN			= 'time-picker-open';
	let TIME_NOTATION_ACTIVE		= 'time-notation-active';
	let TIME_AM_PM_ACTIVE			= 'time-notation-ampm-active';
	let TIME_NOTATION_SELECT_ACTIVE = 'time-notation-select-active';
	
	
	let TIME_PICKER_DROP 			= '.time-picker-drop';
	let TIME_HRS_UP 				= '.time-hrs-up';
	let TIME_HRS_DOWN 				= '.time-hrs-down';
	let TIME_MINS_UP				= '.time-mins-up';
	let TIME_MINS_DOWN				= '.time-mins-down';
	let TIME_HRS_DIGIT_ONE 			= '.time-hrs-digit-one';
	let TIME_HRS_DIGIT_TWO 			= '.time-hrs-digit-two';
	let TIME_MINS_DIGIT_ONE 		= '.time-mins-digit-one';
	let TIME_MINS_DIGIT_TWO 		= '.time-mins-digit-two';
	
	let TIME_NOTATION_AM_PM			= '.time-notation-ampm';
	let TIME_NOTATION_24_HRS		= '.time-notation-24hrs';
	let TIME_NOTATION_SELECT 		= '.time-notation-select';
	let TIME_NOTATION_SELECT_AM_PM	= '.time-notation-select-ampm';
	let TIME_NOTATION_SELECT_24_HRS	= '.time-notation-select-24hrs'; 
	
	let TIME_CONTROL_OK				= '.time-control-ok';
	let TIME_CONTROL_CANCEL			= '.time-control-cancel';
	
	// let instances = [];
	let defaults = {
		width: 'auto',
		position: 'auto'
	};

	/*
	DOMTokenList.prototype.toggle = DOMTokenList.prototype.toggle || (function(css) {
		let classes = this.classList;
		if ( classes.contain(css) ) {
			classes.remove(css);
		}
		else {
			classes.add(css);
		}
	});
	*/
	
	/**************************************************************************************
	 *
	 *	UTIL FUNCTIONS
	 *
	/**************************************************************************************
	
	/*
	 * Helper function to extend an object
	 */
	function extend(out) {
		let args = Array.prototype.slice.call(arguments);
		
		for (let i = 1 ; i < args.length; i++) {
			
			let object = args[i];
			if (!isOfType(object, 'undefined')) {
				
				for (let key in object) {
					let value = object[key];
					if ( isOfType(value, 'object') ) {
						out[key] = extend({}, value)
					}  
					else {
						out[key] = value;
					}
				}
			}
		}
		
		return out;
	}
	
	/*
	 * Build a string following the built-in type pattern of javascript toString method  
	 */
	function toStringType(type) {
		return '[object ' + type + ']';
	}
	
	/*
	 * Get the built-in type of an object
	 */
	function getType(object) {
		return Object.prototype.toString.call(object);
	}
	
	/*
	 * Test if an object is of type object, string, integer, double, etc.
	 * i.e., is(object, 'string'), is(object, 'object')
	 */
	function isOfType(object, type) {
		return getType(object).toLowerCase() === toStringType(type).toLowerCase();
	}

	/***************************** END UTIL FUNCTIONS *************************************/
	
	

	/*
	 * Helper function for getting elements
	 */
	function get(parent, selector) {
		return parent.querySelector(selector);
	}
	
	/*
	 * Helper function for left zero-padding a number
	 */
	function zeroPaddedFormat(str, padding = '00') {
		return (padding+str).slice(-2);
	}
	
	/*
     * Helper function for converting military time to AM-PM	
	 */
	function to2AMPM(hours) {
		if ( hours % 12 ) {
			return hours % 12;
		}
		
		return 12;
	}
	
	/*
	 * Set hours viewusing zero-padding for formatting. 
	 * If hours less than 10, then zero-pad hours and change
	 * opacity.
	 */
	function setHoursView(timeDigitOne, timeDigitTwo, offset = 0){
		this.time.setHours(offset + this.time.getHours());
		
		let hours = this.time.getHours();
		if ( this.settings.notation === 'ampm' ) {
			hours = to2AMPM(hours);
		}
		
		let css = timeDigitOne.classList;
		let digits = zeroPaddedFormat(hours);
		
		timeDigitTwo.innerHTML = digits.charAt(1);
		timeDigitOne.innerHTML = digits.charAt(0);
		if ( !!+digits.charAt(0) ){
			if (css.contains(TIME_DIGIT_ZERO)) {
				css.remove(TIME_DIGIT_ZERO);
			}
		}
		else {
			css.add(TIME_DIGIT_ZERO);
		}
	}
	/*
	 * Set minutes view using zero-padding for formatting
	 */
	function setMinutesView(timeDigitOne, timeDigitTwo, offset = 0) {
		this.time.setMinutes(offset + this.time.getMinutes());
		
		let digits = zeroPaddedFormat(this.time.getMinutes());
		timeDigitTwo.innerHTML = digits.charAt(1);
		timeDigitOne.innerHTML = digits.charAt(0);
	}

	/*
	 *	Set input value according to notation selected (AMPM | HRS) 
	 * 
	 */
	function setInputValue(h1, h2, m1, m2, am, pm) {
		this.input.value = h1.innerHTML+''+h2.innerHTML
			+':'+m1.innerHTML+''+m2.innerHTML;
			
		/* Check if AMPM notation is selected */
		/*
		if ( !am.parentNode.closest('.'+TIME_NOTATION_ACTIVE) ) {
			return;
		}
		*/
			
		if ( this.settings.notation === 'ampm' ) {
			this.input.value += ' ';
			if ( am.classList.contains(TIME_AM_PM_ACTIVE) ) {
				this.input.value += 'AM';
			}
			else if ( pm.classList.contains(TIME_AM_PM_ACTIVE) ) {
				this.input.value += 'PM';
			}
		}
		
		if ( this.input.value !== this.oldTimeValue ) {
			if ( isOfType(this.settings.onValueChange, 'function') ) {
				this.settings.onValueChange(this.input.value, this.oldTimeValue);
			}
		}
		
		if ( isOfType(this.settings.onValueConfirmed, 'function') ) {
			this.settings.onValueConfirmed(this.input.value);
		}
		
		this.oldTimeValue = this.input.value;
	}
	
	/*
     * Settings options allowed for choosing the notation to be used
	 * when displaying time and setting input - time - value
	 */
	function setNotationOption(notation) {
		this.settings.notation = notation;
	}
	
	function setTimeNotationFormatAMPM(notation) {
		Object.entries(notation.children)
			.filter(function([index, child]) {
				return this.time.getHours() >= 12 
					&& child.innerHTML === 'PM';
			}, this)
			.forEach(function([index, child]) {
				child.classList.toggle(TIME_AM_PM_ACTIVE);
			}, this);
	}

	function setNotationFormat(a, b, as, bs) {
		if (!as.classList.contains(TIME_NOTATION_SELECT_ACTIVE)) {
			as.classList.add(TIME_NOTATION_SELECT_ACTIVE);
		}
		if (bs.classList.contains(TIME_NOTATION_SELECT_ACTIVE)) {
			bs.classList.remove(TIME_NOTATION_SELECT_ACTIVE);
		}
		
		if (!a.classList.contains(TIME_NOTATION_ACTIVE)) {
			a.classList.add(TIME_NOTATION_ACTIVE);
		}
		if (b.classList.contains(TIME_NOTATION_ACTIVE)) {
			b.classList.remove(TIME_NOTATION_ACTIVE);
		}			
	}

	/*
	 * Display picker according to user's settings.
	 * run functions onBeforeOpen,onAfterOpen,onBeforeClose,onAfterClose
	 * if set by user
	 */
	function setDropViewVisible() {
		let rect = this.input.getBoundingClientRect();
		if (isOfType(this.settings.onBeforeOpen, 'function')) {
			this.settings.onBeforeOpen();
		}
		
		this.container.classList.add(TIME_PICKER_OPEN);
		extend(this.container.style, {
			left: rect.left, right: 'auto',
			top: rect.top + rect.height + 1
		});
		
		if (isOfType(this.settings.onAfterOpen, 'function')) {
			this.settings.onAfterOpen();
		}
		
		
		if ( this.settings.position === 'left' ) {
			extend(this.container.style, { 
				left: rect.left + 'px' 
			});
		}
		else if ( this.settings.position === 'right' ) {
			extend(this.container.style, { 
				left: (rect.left + rect.width 
					- this.container.clientWidth) + 'px'
			});
		}
		else {
			extend(this.container.style, {
				left: ((rect.left + (rect.width / 2)) 
					- (this.container.clientWidth / 2)) + 'px'
			});
		}
	}
	
	/*
     * hide picker and run function onBeforeClose and onAfterClose if
     * set by user.	 
	 */
	function setDropViewHidden() {
		if (isOfType(this.settings.onBeforeClose, 'function')) {
			this.settings.onBeforeClose();
		}
		
		this.container.classList.remove(TIME_PICKER_OPEN);
		if (isOfType(this.settings.onAfterClose, 'function')) {
			this.settings.onAfterClose();
		}
	}




	window.TimePicker = function(input, settings) {
		let self = this;
		self.oldTimeValue = '';
		self.time = new Date();
		self.input = input;
		self.settings = extend({}, 
			defaults, settings
		);
	
		let placeholder = document.createElement('div');
			placeholder.innerHTML = TEMPLATE;
		
		
		self.container = get(placeholder, TIME_PICKER_DROP);
		/*
		 * Prevent picker from closing upon user clicking on  
		 */
		self.container.addEventListener('mousedown', function(e) {			
			e.preventDefault();
		});
		self.input.addEventListener('keydown', function(e) {
			
			switch( e.which || e.keyCode ) {
				case KEY_TAB:
					break;
				case KEY_ESC:
					self.close();
					break;
			}
		});
		/*
		self.input.addEventListener('keyup', function(e) {
			switch( e.which || e.keyCode ) {
				case 8:  // BACKSPACE
				case 32: // SPACE
				case 47:
				case 48:
				case 49:
				case 50:
				case 51:
				case 52:
				case 53:
				case 54:
				case 55:
				case 56:
				case 57:
				case 58: // COLON
					if (/^(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9])(\sHRS)?$/.test(this.value)) {
						console.log('Valid 24 HRS time');
					}
					else if (/^(0[1-9]|1[0-2]):(0[0-9]|[1-5][0-9])\s(AM|PM)$/.test(this.value)) {
						console.log( 'Valid AM PM time' );
					}
				
			}
		});
		*/
		self.input.readOnly = true;
		self.input.addEventListener('focus', function(e) {
			setDropViewVisible.call(self);
		});
		self.input.addEventListener('blur', function(e) {
			setDropViewHidden.call(self);
		});
	
		
		let timeHrsDigitOne = get(this.container, TIME_HRS_DIGIT_ONE);
		let timeHrsDigitTwo = get(this.container, TIME_HRS_DIGIT_TWO);
		setHoursView.call(this, timeHrsDigitOne, timeHrsDigitTwo);
		
		let timeMinsDigitOne = get(this.container, TIME_MINS_DIGIT_ONE);
		let timeMinsDigitTwo = get(this.container, TIME_MINS_DIGIT_TWO);		
		setMinutesView.call(this, timeMinsDigitOne, timeMinsDigitTwo);
		
		
		/*****************************************************************
		 * 
		 * UP/DOWN HOURS AND MINUTES LISTENERS
		 *
		 ****************************************************************/
		let timeHrsUp = get(this.container, TIME_HRS_UP);
		timeHrsUp.addEventListener('click', function(e) { 
			setHoursView.call(self, 
				timeHrsDigitOne, timeHrsDigitTwo, 1);
		});
		let timeHrsDown = get(this.container, TIME_HRS_DOWN);
		timeHrsDown.addEventListener('click', function(e) { 
			setHoursView.call(self, 
				timeHrsDigitOne, timeHrsDigitTwo, -1);			
		});
		
		let timeMinsUp = get(this.container, TIME_MINS_UP);
		timeMinsUp.addEventListener('click', function(e) {
			setMinutesView.call(self, 
				timeMinsDigitOne, timeMinsDigitTwo, 1);
		});
		let timeMinsDown = get(this.container, TIME_MINS_DOWN);
		timeMinsDown.addEventListener('click', function(e) {
			setMinutesView.call(self, 
				timeMinsDigitOne, timeMinsDigitTwo, -1);
		});
		
		
		/*****************************************************************
		 * 
		 * AM/PM OPTION LISTENERS
		 *
		 ****************************************************************/
		let m24hrs = get(this.container, TIME_NOTATION_24_HRS);
		let ampm = get(this.container, TIME_NOTATION_AM_PM);
		ampm.addEventListener('click', function(e) {
			let options = ampm.children;
			for (let i = 0; i < options.length; i++) {
				options[i].classList.toggle(TIME_AM_PM_ACTIVE);
			}
		});
		
		
		setTimeNotationFormatAMPM.call(this, ampm);
		/*****************************************************************
		 * 
		 * NOTATION OPTION LISTENERS
		 *
		 ****************************************************************/
		let timeNotationOptions = get(this.container, TIME_NOTATION_SELECT);
		
		let ampmNotationSelector = get(timeNotationOptions, TIME_NOTATION_SELECT_AM_PM);
		let m24hrsNotationSelector = get(timeNotationOptions, TIME_NOTATION_SELECT_24_HRS);
		ampmNotationSelector.addEventListener('click', function(e) {		
			setNotationOption.call(self, 'ampm');
			setNotationFormat(ampm, m24hrs, 
				ampmNotationSelector, m24hrsNotationSelector);
			
			setHoursView.call(self, 
				timeHrsDigitOne, timeHrsDigitTwo, 0);
		});
		m24hrsNotationSelector.addEventListener('click', function(e) {
			setNotationOption.call(self, '24hrs');
			setNotationFormat(m24hrs, ampm,
				m24hrsNotationSelector, ampmNotationSelector);
			
			setHoursView.call(self, 
				timeHrsDigitOne, timeHrsDigitTwo, 0);
		});		
		
		/*****************************************************************
		 * 
		 * OK/CANCEL LISTENERS
		 *
		 ****************************************************************/
		let ok = get(this.container, TIME_CONTROL_OK);
		ok.addEventListener('click', function(e) {
			e.stopPropagation();
			setInputValue.call(self, timeHrsDigitOne, timeHrsDigitTwo
				, timeMinsDigitOne, timeMinsDigitTwo 
				, ampm.firstElementChild, ampm.lastElementChild);
			self.input.blur();
		});
		
		let cancel = get(this.container, TIME_CONTROL_CANCEL);
		cancel.addEventListener('click', function(e) {
			self.input.blur();
		});
		
		
		document.body.appendChild(placeholder.firstElementChild);
		if( self.settings.notation === 'ampm' ) {
			setNotationFormat(ampm, m24hrs, 
				ampmNotationSelector, m24hrsNotationSelector);
		}
		else {
			setNotationFormat(m24hrs, ampm,
				m24hrsNotationSelector, ampmNotationSelector);
		}
		
		setHoursView.call(self, 
			timeHrsDigitOne, timeHrsDigitTwo, 0);		

		
		/*
		setInputValue.call(self, timeHrsDigitOne, timeHrsDigitTwo
			, timeMinsDigitOne, timeMinsDigitTwo 
			, ampm.firstElementChild, ampm.lastElementChild);
		*/
	};
	
	window.TimePicker.prototype = {
		open: function() {
			this.input.focus();
			setDropViewVisible.call(this);
		},
		close: function() {	
			this.input.blur();
			setDropViewHidden.call(this);
		}
	};
} ());
