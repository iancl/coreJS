//smskip:validation
/**
* CoreJS bundle
* Created By Ian Calderon for Say Media
* Contains: Essential Methods, Query Class and ViewController Class
* Mobile Support: Android 2.1+, iOS 3.2+, Blackberry OS 7.0+
* Desktop Browser Support: Chrome 4.0+, Firefox 3.5+, Safari 3.5+, IE 10+
* Version 1.5.2
*/

(function(window, document, undefined){

var
//============================================================================================================
// PRIVATE PROPERTIES AND FUNCTIONS
//============================================================================================================

// library local reference
coreJS = {},

_globalConfig = {
	browser: "please import script tag at the end of the body"
},

// binds context to function
local_bind = function(scope, fn) {
 	var _function = fn;
  
 	return function(evt) {
		return _function.apply(scope, arguments);
  	}
},

// binds context to multiple function
bind_context = function() {
	var args = Array.prototype.slice.call(arguments, 0),
		scope = args.shift(0);

 	for(i in args){
 		scope[args[i]] = local_bind(scope, scope[args[i]]);
 	}
 	args = null;
 	scope = null;
},

// local references of array methods
local_splice = Array.prototype.splice,
local_push = Array.prototype.push,

// loops through each array item
local_each = function(fnCallback){
	var i;
	
	for (i = 0; i < this.length; i++) {
		fnCallback.call(this, i);
	}
},

// used to add properties from one object to another
extend_object = function(newObject){
	var key;

	for(key in newObject){
		this[key] = newObject[key];
	}

	key = null;
},
detectBrowserPrefix = function(){
	if (typeof document.body !== "undefined"){
		_globalConfig.browser = Array.prototype.slice.call(
		  document.defaultView.getComputedStyle(document.body, "")
		)
		.join("")
		.match(/(?:-(moz|webkit|ms|khtml)-)/);
	}
},
detectTouchSupport = function(){
	_globalConfig.isTouchSupported = 'ontouchstart' in window;
},
applyBindPolyfill = function(){
	if (!Function.prototype.bind) {
	
	 	Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs   = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP    = function() {},
				fBound  = function() {
					return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
		    fBound.prototype = new fNOP();
		    return fBound;
	 	};
	}
},
detectDevice = function(){

	var nav = navigator.userAgent.toLowerCase(),
		deviceName;

	_globalConfig.isMobileDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);

	if((/android/i).test(nav)){
		deviceName = "android";
	} else if ((/iphone/i).test(nav)){
		deviceName = "iphone";
	} else if ((/ipad/i).test(nav)){
		deviceName = "ipad"
	} else {
		deviceName = "other";
	}

	_globalConfig.deviceName = deviceName;

},
detectClassListSupport = function(){
	var el = document.querySelector("body");
	_globalConfig.supportsClassList =  (typeof el.classList !== "undefined") ? true : false;
	el = null;
},
performInitialTasks = function(){
	detectBrowserPrefix();
	detectTouchSupport();
	detectDevice();
	detectClassListSupport();
	applyBindPolyfill();
};

//============================================================================================================
// Essential Properties definition and additional methods
//============================================================================================================
// these need to be defined before adding properties to the library

coreJS.extend = extend_object;
coreJS.debug = true;
coreJS.lib_version = '1.5.2';
coreJS.lib_creator = "Ian Calderon";

// logs to console when debug mode is activated
coreJS.log = function(strMsg){
	this.log.history = this.log.history || [];
    this.log.history.push(strMsg);
    if(this.debug) {
        console.log(strMsg);
    }
};

// excecutes a callback after the time specified
coreJS.defer = function(fnCallback, intDelay){
	return setTimeout(fnCallback, intDelay);
};

// returns an array that includes the browser's css prefix and javascript prefix
coreJS.getBrowserPrefix = function(){
	return _globalConfig.browser;
};

coreJS.supportsTouch = function(){
	return _globalConfig.isTouchSupported;
};

coreJS.isMobileDevice = function(){
	return _globalConfig.isMobileDevice;
};

coreJS.deviceName = function(){
	return _globalConfig.deviceName;
};

// binds a set of elements to a specified context
coreJS.bindContext = bind_context;

// excecute all initial tasks
performInitialTasks();


//============================================================================================================
// QUERY MODULE
//============================================================================================================
// This is a toolbelt library like jquery
// Contains the most basic methods that are needed for most mobile apps

(function(){

var

//CONST
INSTANCE_TYPE_NAME = 'queryInstance',
HTML_TYPE_NAME = 'htmlElement',
STRING_TYPE_NAME = 'stringObject',
WINDOW_TYPE_NAME = 'windowObject',

// Private fn and properties
 query = function(strSelector, objContext){
	return new query.fn.initialize(strSelector, objContext);
},

// will be used to identify the type of any object used in the query module
getType = function(object){
	var type;

	if (object instanceof query) {
		type = INSTANCE_TYPE_NAME;
	} else if(!!object.nodeName){
		type = HTML_TYPE_NAME;
	} else if(typeof object === 'string'){
		type = STRING_TYPE_NAME;
	} else if(object === window){
		type = WINDOW_TYPE_NAME;
	}

	return type;
},

// will return html elements wrapped in an array depending on the received element type
getElement = function(object, context){
	var type = getType(object),
		els = [],
		ctx = typeof context !== "undefined" ? context[0] : document;

	switch(type){

		case INSTANCE_TYPE_NAME:
			els.push(object.getElement());
		break;

		case HTML_TYPE_NAME:
		case WINDOW_TYPE_NAME:
			els.push(object);
		break;

		case STRING_TYPE_NAME:
			els = ctx.querySelectorAll(object);
		break;

	}

	return els;
},

// will wrap the query instance in a array like object
makeArray = function(instance, object){

	var length = 0;

	instance.splice = local_splice;
	instance.push = local_push;

	local_each.call(object, function(i){
		var el = object[i],
			type = getType(el);

		if (type === HTML_TYPE_NAME) {
			local_push.call(instance, el);
			length++;
		}

	});

	el = null;
	instance.length = length;

	return instance;
},

// will return a utils instance in an array like object
makeObject = function(strSelector, objContext){

	var ctx, el;

	if(objContext){
		ctx = getElement(objContext);
	}

	el = typeof ctx !== "undefined" ? getElement(strSelector, ctx) : getElement(strSelector);

	return makeArray(this, el);
},

// removes all references to current instance
query_destroy = function () {
	
	local_each.call(this, function (i) {
		this[i] = null;
		local_splice.call(this, this[i]);
	});

	query_removeFn.call(this);

	return this;
},

// removes all fn of current instance
query_removeFn = function(fnName){
	var key;

	for(key in this){
		if(this[key] !== local_splice){
			delete this[key];
			this[key] = null;
		}
	}
	this.length = 0;
	key = null;
},

// will determine if the specified html element contains a specific class
local_hasClass = function(strClass){

	var type = getType(this),
		el;

	if(type === INSTANCE_TYPE_NAME){
		el = this[0];
	} else if(type === HTML_TYPE_NAME){
		el = this;
	}

	return !!(el.className.match(new RegExp('(\\s|^)' + strClass + '(\\s|$)')));
},
local_addClass = function(strCls){
	var classes;

	classes = strCls.split(' ');

	local_each.call(this, function (i) {
		var el = this[i],
			classesToAdd = el.className.split(' ');

		local_each.call(classes, function(x){

			var currentCls = this[x];

			if (!local_hasClass.call(el, currentCls)) {
				classesToAdd.push(currentCls);
			};
		});

		el.className = String.prototype.trim.call(classesToAdd.join(' '));

		el = null;
		classesToAdd = null;
	});
},
local_removeClass = function(strCls){

	var classes;

	local_each.call(this, function (i) {
		var el = this[i],
			clsToAdd = el.className,
			classes = clsToAdd.split(" "),
			clsToRemove = strCls.split(" "),
			reg;

		local_each.call(clsToRemove, function(x){
			var cls = clsToRemove[x];

			if(local_hasClass.call(el, cls)){
				reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
				clsToAdd = clsToAdd.replace(reg,' ');
			}

		});

		el.className = String.prototype.trim.call(clsToAdd);
		classes = null;
		el = null;
	});
};

// prototype definition
query.fn = query.prototype = {
	constructor: query,
	initialize: function(strSelector, objContext){

		return makeObject.call(this, strSelector, objContext);
	},

	// returns the element located in the specified index
	get: function(intIndex){
		return new query(this.getElement(intIndex));
	},
	// returns the raw html element located in the specified index
	getElement: function(intIndex){
		intIndex = intIndex || 0;

		return this[intIndex];
	},

	// returns the parent of the current element wrapped in an query instance
	getParent: function(){
		return new query(this.getElement(0).parentNode);
	},

	// returns the attr of the current element
	getAttr: function(strAttr){
		return this.getElement(0).getAttribute(strAttr) || false;
	},

	// sets the specified attribute of the current element
	setAttr: function(strAttr, strVal){
		return this.getElement(0).setAttribute(strAttr, strVal);
	},

	// removes the specified attribute of the current elements
	removeAttr: function(strAttr){
		return this.getElement(0).removeAttribute(strAttr);
	},
	//Retrieve all the elements contained in the query set, as an array.
	toArray : function(){
		var a = [];
		this.each(function(elm,index){
			a.push(this.get(index));
		})
		return a;
	},	
	// loops through each element of this
	//  Each invocation of iteratee is called with 2 arguments: (element, index)
	each : function(callback){
		var i;
		for (i = 0; i < this.length; i++) {
			var elm = this.getElement(i);
			callback.call(this,elm, i);
		}
	},

	// determines if the current element contains the specified class
	// returns boolean
	hasClass: local_hasClass,

	// adds the specified class to the current element set
	addClass: function(strCls){
		var classes;

		if (strCls) {

			if (_globalConfig.supportsClassList) {

				classes = strCls.split(" ");

				local_each.call(this, function (i) {
					var el = this[i];
					el.classList.add(classes)
					el = null;
				});

			} else {
				local_addClass.apply(this, arguments);
			}
			
		}
		
		return this;
	},

	// removes the specified class to the current element set
	removeClass: function(strCls){

		var classes;

		if (strCls) {
			if (_globalConfig.supportsClassList) {

				classes = strCls.split(" ");

				local_each.call(this, function (i) {
					var el = this[i];
					el.classList.remove(classes)
					el = null;
				});

			} else {
				local_removeClass.apply(this, arguments);
			}
		}

		return this;
	},

	// sets the specified css text to the current element set
	setCss: function(strCssText){
		local_each.call(this, function (i) {
			var el = this[i];
			
			el.style.cssText += strCssText;
			
			el = null;
			
		});
		
		return this;
	},

	// adds event listeners to the current element set
	on: function(eventType, fnCallback){
		local_each.call(this, function (i) {
			var el = this[i];
			el.addEventListener(eventType, fnCallback, false);
			el = null;
		});
		
		return this;
	},

	// adds event listeners to the current element set
	off: function(eventType, fnCallback){
		local_each.call(this, function (i) {
			var el = this[i];
			el.removeEventListener(eventType, fnCallback);
			el = null;
		});
		
		return this;
	},

	// set html or html text to the current element set
	html: function(html){
		var type = getType(html);

		if (type === STRING_TYPE_NAME) {
			local_each.call(this, function (i) {
				var el = this[i];
				el.innerHTML = html;
				el = null;
			});
		} else if(type === HTML_TYPE_NAME){
			local_each.call(this, function (i) {
				var el = this[i];
				el.innerHTML = '';
				el.appendChild(html);
				el = null;
			});
		} else if(type === INSTANCE_TYPE_NAME){
			local_each.call(this, function (i) {
				var el = this[i];
				el.innerHTML = '';
				el.appendChild(html.getElement());
				el = null;
			});
		}

		return this;
	},
	text: function(text){
		local_each.call(this, function (i) {
			var el = this[i];
			el.innerText = text;
			el = null;
		});
		return this;
	},
	// appends html or html text to the current element set
	appendHtml: function(html){
		var type = getType(html);

		if(type === HTML_TYPE_NAME){
			local_each.call(this, function (i) {
				var el = this[i];
				el.appendChild(html);
				el = null;
			});

		} else if(type === INSTANCE_TYPE_NAME){
			local_each.call(this, function (i) {
				var el = this[i];
				el.appendChild(html.getElement());
				el = null;
			});
		}
	},

	// prepends html or html text to the current element set
	prependHtml: function(html){
		var type = getType(html);

		if(type === HTML_TYPE_NAME){
			local_each.call(this, function (i) {
				var el = this[i];
				el.insertBefore(html, el.childNodes[0]);
				el = null;
			});

		} else if(type === INSTANCE_TYPE_NAME){
			local_each.call(this, function (i) {
				var el = this[i];
				el.insertBefore(html.getElement(), el.childNodes[0]);
				el = null;
			});
		}
	},

	// removes current set element from the DOM
	remove: function(){
		local_each.call(this, function (i) {
			
			var parent = this[i].parentNode,
			el = this[i];
			
			parent.removeChild(el);
			
			parent = null;
			el = null;
			
		});

		return this;
	},
	destroy: function(){
		// remove instance
		query_destroy.call(this);

		return this;
	}
};

// needed for later instantiation
query.fn.initialize.prototype = query.fn;

// appending to parent
coreJS.extend({q: query});

}());

//============================================================================================================
// VIEWCONTROLLER MODULE
//============================================================================================================
(function(){

var
// private fn and properties

// will be used to assign an id to each new instance
controllerId = 0,

// will be used to extend classes that were extended from a base class
childClassExtend = function(newProperties){

	var child = function(objOptions){  ViewControllerClass.apply(this, arguments); };

	extend_object.call(child.prototype, this.prototype);
	extend_object.call(child.prototype, newProperties);
	child.prototype.super = this.prototype;
	child.prototype.constructor = this;
	child.extend = childClassExtend;

	return child;
},

// will set the properties and call the functions to any base class
buildClass = function(objOptions){
	this.id = 'view'+(controllerId++);
	this.options = objOptions || {};
	
	setElement.call(this);

	if (this.options.parent) {
		setParent.call(this);
	}
	
	this.children = null;

	if(this.setDOMReferences) this.setDOMReferences();
	if(this.setListeners) this.setListeners();
	if(this.initialize) this.initialize();
},
setElement = function(strViewSelector){

	var selector = strViewSelector || this.viewSelector;

	if (this.view) {
		this.$view.destroy();

		this.$view = null;
		delete this.$view;

		this.view = null;
		delete this.view;
	};

	if (selector) {
		this.$view = coreJS.q(selector);
		this.view = document.querySelector(selector);
	}
},
setParent = function(){
	this.parent = null;
	this.parent = this.options.parent;
};

//////////////////////////////////////////////////////////////////////////////
// ViewController Class
//////////////////////////////////////////////////////////////////////////////
var ViewControllerClass = function(objOptions){
	buildClass.apply(this, arguments);
};

// setting view controller prototype methods
ViewControllerClass.prototype = {
	constructor: ViewControllerClass,
	/*
	initialize: function(){

	}
	*/
	destroy: function(){
		if(this.removeDOMReferences) this.removeDOMReferences();
		if(this.removeListeners) this.removeListeners();

		this.removeElement();
	},

	/*
	setDOMReferences: function(){

	},
	*/
	removeDOMReferences: function(){

	},

	/*
	setListeners: function(){

	},
	*/
	removeListeners: function(){

	},
	setElement: setElement,
	setParent: setParent
};

//setting extend fn for future extending
ViewControllerClass.extend = childClassExtend;

// appending to parent
coreJS.extend({ViewController: ViewControllerClass});

}());

//============================================================================================================
// OBSERVER MODULE
//============================================================================================================
(function(){
var
// private fn and methods 
observer = {
	lib_version: "1.1.0",
	lib_creator: "Ian Calderon"
},
observerTopics = {},
subscriberKey = 0;

//subscribe method
//param: strId string with publication identifier
//param: fnCbk function that will be the callback
//param: objCtx object that will be the context of the callback
//returns string publiserKey
observer.subscribe = function(strId, fnCbk, objCtx){

	var key = 'keyId'+(++subscriberKey);

	if(!observerTopics[strId]){
		observerTopics[strId] = [];
	}

	observerTopics[strId][key] = {
		callback: fnCbk,
		context: objCtx
	};

	return key;
};

//publish method
//param strId string with publication identifier
//objParam object that will be passed to the callback
//returns void
observer.publish = function(strId, objParam){

	if (typeof strId === "undefined") return;

	var currentTopic,
		publication,
		key;

	objParam = objParam || {};

	if(observerTopics[strId]){
		currentTopic = observerTopics[strId];

		for(key in currentTopic){
			publication = currentTopic[key];
			publication.callback.call(publication.context, objParam);
			publication = null;
		}

		currentTopic = null;
		key = null;
	}
};


//unsubscribre a subscriber from a publishing
//param strId string with publication identifier
//param subscriberKey unique string given at the time of subscribing
//returns void
observer.unsubscribe = function(strId ,subscriberKey){;

	if(observerTopics[strId] && observerTopics[strId][subscriberKey]){
		observerTopics[strId][subscriberKey].callback = null;
		observerTopics[strId][subscriberKey].context = null;
		delete observerTopics[strId][subscriberKey].callback;
		delete observerTopics[strId][subscriberKey].context;

		observerTopics[strId][subscriberKey] = null;
		delete observerTopics[strId][subscriberKey];
	}
};

//remove a whole publication key
//param strId string with publication identifier
//returns void
observer.removePublication = function(strId){
	var key;

	if(observerTopics[strId]){
		for(key in observerTopics[strId]){
			observerTopics[strId][key] = null;
			delete observerTopics[strId][key];
		}
		observerTopics[strId] = null;
		delete observerTopics[strId];
	}

	key = null;
};

// appending to parent
coreJS.extend({Observer: observer});

}());

//============================================================================================================
// COLLECTION MODULE
//============================================================================================================
(function(){
var
// private var and properties
collectionId = 0;

//////////////////////////////////////////////////////////////////////////////
// COLLECTION Class
//////////////////////////////////////////////////////////////////////////////
var CollectionClass = function(items){

	this.lib_creator = "Ian Calderon";
	this.lib_version = "1.1";
	this.id = collectionId++;
	this.items = {};
	this.length = 0;

	this.merge(items, true);
};

// defining class prototype
CollectionClass.prototype = {
	lib_creator: "Ian Calderon",
	lib_version: "1.1",
	constructor: CollectionClass,
	add: function(strKey, newItem){

		if ((typeof strKey !== "undefined" && strKey.toString().length > 0) &&
			typeof newItem !== "undefined") {

			if(!this.items[strKey]){
				this.items[strKey] = newItem;
				this.length++;
	      	}
      }

		return this;
	},
	remove: function(strKey){

  		if(this.items[strKey]){
	        this.items[strKey] = null;
	        delete this.items[strKey];
	        this.length--;
  		}

		return this;
	},
	replace: function(strKey, newItem){

		if ((typeof strKey !== "undefined" && strKey.length > 0) &&
			typeof newItem !== "undefined") {

			if(this.items[strKey]){
				this.remove(strKey);
			}

			this.add(strKey, newItem);
		}

		return this;
	},
	get: function(strKey){
		return this.items[strKey];
	},
	clear: function(){

		var self = this;

        this.each(function(el, strKey){
          	self.remove(strKey);
        });

        this.items = {};
        self = null;


        return this;
	},
	each: function(fnCallback){

		var key;

        for(key in this.items){
        	fnCallback(this.items[key], key);
        }

        key = null;

        return this;
	},
	merge: function(source, replace){
		var key;

		replace = replace || false;

		for(key in source){
			if (replace === true) {
				this.replace(key, source[key]);
			} else {
				this.add(key, source[key]);
			}
			
		}

		return this;
	}
};

// append to parent
coreJS.extend({Collection: CollectionClass});

}());

//============================================================================================================
// SHARE WITH GLOBAL OBJECT
//============================================================================================================
window.coreJS = c$ = coreJS;

}(this, document))