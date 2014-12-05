CoreJS
=========

CoreJS is a toolbelt library that gives you access to many methods that will make easy to create maintainable apps or ads.

  - Only 8kb
  - Works in mobile and desktop browsers
  - Tested in Android 4.0+, iOS 5.0+, and all modern desktop browsers.
  - Fully extendable, so you can add more features.

CoreJS feautures

- Essential methods that wil help you get browser and device info.
- Query module that works like zepto.js or jquery but contains only most used methods.
- ViewController module that will let you give a View Controller structure to your projects so you can create maintainable code.
- Observer pattern that will let you pass messages amongst all objects in the app no matter what their relationship is.
- Collection module that will let you work with key value collections. Similar to the NSDictionary in Xcode.

Version
----
1.5.2

Last Edited by 
---------------
Ian Calderon

 - Fixed minor bugs on the Collection class
 - Added the functionality to pass an object when creating a new collection
 - Added the merge method to the collection class


How to use
--------------
To get access to all the awesome features of this library, you first need to know that the namespace for the bundle is:

```javascript
c$
```

#API:

## Essential Methods

### c$.log(msg)

* Will print to passed arguments to console

```javascript
// log a message
c$.log("this is a custom message",3,document.getElementById("myDiv"));

// result: ["this is a custom message", 3, div#myDiv]

// to turn off this feature you can just change the debug property to false
c$.debug = false;

// try to log again
c$.log("another message");

// result: nothing will be printed.
```

#### Details:
* msg: Has to be a string object

---

### c$.defer(callback, delay)

* Will execute the specified callback after the specified delay.

```javascript
// execute the alert after 1000ms
c$.defer(function(){
    alert("hello world");
}, 1000);

//result: alert will popup after 1000ms
```

#### Details:
* callback: Has to be a function.
* delay: Time in milliseconds.

---

### c$.getBrowserPrefix()

* Will return an array containing the css and js browser prefix

```javascript
// lets think you are running this on chrome
var prefix = c$.getBrowserPrefix();

console.log(prefix)

//result: ["-webkit-", 'webkit']
```

---

### c$.supportsTouch()

* Will return a boolean value depending if the device supports touch or not

```javascript
// lets think you are running this on macOS chrome
var isTouchSupported = c$.supportsTouch();

console.log(isTouchSupported)

//result: false
```

---

### c$.isMobileDevice()

* Will return a boolean value depending if the device is a mobile/tablet or not

```javascript
// lets think you are running this on android
var isMobile = c$.isMobileDevice();

console.log(isTouchSupported)

//result: true
```

---

### c$.deviceName()

* Will return a string with the name of the current device

```javascript
// lets think you are running this on android
var name = c$.deviceName();

console.log(name)

//result: android
```

#### Details:
* Possible values: android | iphone | ipad | other

---

### c$.bindContext(context, methodName, ...)

* This is an experimental function. PLEASE USE Function.prototype.bind if available.
* Will bild the specified context to the specified method names

```javascript
// change context
c$.bindContext(this, "buttonTapped");

// create custom object for example
var obj = {name: "someName"}; 

// append an event listener
document.querySelector("#button").addEventListener("click", buttonTapped);

function buttonTapped(evt){
  console.log(this.name);
  
  // output: someName
  // normally "this" would be the html element
  // now is the obj object
}
```

#### Details:
* context: Object element
* method names: string values

---

### c$.extend({name: instance})

* Will append the specified instance to the bundle. You can then access the appended instance


```javascript
// a vague and simple example
var logger = {
    log: function(msg){
        "logged: "+msg
    }
};

//append
c$.extend({Logger: logger});

// access appended method
c$.logger.log("hello");

// result: "logged: hello" will get printed to console
```

---

## Query Module: c$.q();

* Will return an array with the specified html element or elements wrapped in a custom object. After this you will get access to many helper methods similar to the ones you can use in jQuery or Zepto.
* You can also chain all method calls

```javascript

// on the fly
c$.q("selector or element");

// or store value
var element = c$.q("selector or element");

// you can also query by class, id tag or pass an html element.
c$.q("#block");
c$.q(".button");
c$.q("div");
```

### .get(intIndex)

* Will return the element positioned in the specified index. Applies mostly when you have queried multiple elements

```javascript
var divs = c$.q("div");

// get queried div that is on the position 5
var div = divs.get(5);
```

#### Details:
* intIndex: has to be an integer value

---

### .getElement(intIndex)

* Will return the raw HTML element positioned in the specified index. Applies mostly when you have queried multiple elements

```javascript
var divs = c$.q("div");

// get queried raw HTML div that is on the position 5
var div = divs.getElement(5);
```

#### Details:
* intIndex: has to be an integer value

---

### .getParent()

* Will return the parent element of the current element. If there are multiple elements, it will return the parent of the first element.

```javascript
var element = c$.q("#block");

// get queried raw HTML div that is on the position 5
var parent = element.getParent();
```

---

### .getAttr(strName)

* Will return the specified html attribute value of the current element. If there are multiple elements, it will return the attribute value of the first element.

```javascript
var element = c$.q("#startButton");

// will return the class attribute value
var class = element.getAttr("class");
```

---

### .setAttr(strName, value)

* Will set the specified html attribute value of the current element. If there are multiple elements, it will set the attribute value of the first element.

```javascript
var element = c$.q("#startButton");

// will return the class attribute value
element.settAttr("data-index", "0");
```

---

### .removeAttr(strName)

* Will delete the specified html attribute value of the current element. If there are multiple elements, it will delete the attribute value of the first element.

```javascript
var element = c$.q("#startButton");

// will return the class attribute value
var class = element.removeAttr("class");
```

---

### .toArray()

* Retrieve all teh elements contained in the query set, as an array.

```javascript
var hotspots = $.q(".dot").toArray();

// array filled with query object
hotspots.forEach(function(obj){
			obj.on(clickTap,dotClick);
		});
```

---

### .each(callback)

* loops through each element contained in query set.
* Each invocation of the iteratee is called with 2 arguments (element, index)

```javascript
var btns = $.q(".btn");
btns.each(function(elm,index){
			elm.style.display = "none";
		});
```

---

### .hasClass(clsName)

* Will return a boolean value depending if the specified class exists in the current element. If there are multiple elements validate the class on the first element only.

```javascript

// chaining methods this time :D
var isActive = c$.q("#stage").hasClass("active");

console.log(isActive);
// result: will print true or false

```

---

### .addClass(clsName)

* Will add the specified class or classes to all the queried elements
* You can also pass mutiple classes separated by a space: "class1 class2 class3" 


```javascript

// chaining methods this time :D
c$.q(".stages").addClass("active blinking");

// result: Both Classes will get added to the element

```

---

### .removeClass(clsName)

* Will remove the specified class or classes to all the queried elements. It will only remove the classes that exist in the elements.
* You can also pass mutiple classes separated by a space: "class1 class2 class3" 


```javascript

// chaining methods this time :D
c$.q("#stage").removeClass("active blinking");

// result: Both Classes will get remove from the elements

```

---

### .show(duration,complete)

* Will display the matched element(s); 
* duration : Number determining how long the animation will run. Default is set to 10 milliseconds;
* complete : A function to call once the animation is complete. 

```javascript

$.q(".copyBox").show(300);

// result: Both Classes will get remove from the elements

```

---

### .hide(duration,complete)

* Will hide the matched element(s); 
* duration : Number determining how long the animation will run. Default is set to 10 milliseconds;
* complete : A function to call once the animation is complete. 

```javascript

$.q(".copyBox").hide(300);

// result: Both Classes will get remove from the elements

```

---

### .on(eventType, callback)

* Will bind the specified callback all the queried elements for the specified event type.


```javascript

// bind callback
c$.q("#button").on('click', function(){
    alert("click");
});

// result: the alert will be prompted when clicking on the element

```

---

### .off(eventType, callback)

* Will remove the specified callback all the queried elements for the specified event type.


```javascript

function alertMe(){
    alert("click");
}

// bind callback
var element = c$.q("#button");

// bind callback
element.on('click', alertMe);

// unbind callback
element.off('click', alertMe);

// result: the alert WILL NOT be prompted when clicking on the element

```

---

### .html(html)

* Will set the html content of the current element or elements.
* You can pass string html, html elements, or query instances


```javascript

// append html text
c$.q("#stage").html("<div>Hello</div>");

// append html element
var element = document.getElementById("#block");
c$.q("#stage").html(element);

// append another instance
var qElement = c$.q("#block");
c$.q("#stage").html(qElement);

```

---

### .appendHtml(html)

* Will append the passed element to the last position of the current element or elements.
* You can pass html elements, or query instances


```javascript
// append html element
var element = document.getElementById("#block");
c$.q(".allStages").appendHtml(element);

// append another instance
var qElement = c$.q("#block");
c$.q("#stage").appendHtml(qElement);

```

---

### .prependHtml(html)

* Will append the passed element to the first position of the current element or elements.
* You can pass html elements, or query instances


```javascript
// prepend html element
var element = document.getElementById("#block");
c$.q(".allStages").prependHtml(element);

// prepend another instance
var qElement = c$.q("#block");
c$.q("#stage").prependHtml(qElement);

```

---

### .remove()

* Will remove the current element or elements from the DOM


```javascript
// remove all blocks
c$.q(".allBlocks").remove();

// result: all blocks will get removed from the DOM and dissapear

```

---

### .destroy()

* Will release all references to the queried elements. This is usefull to avoid memory leaks.


```javascript
// query elements
var els = c$.q(".allBlocks");


// release references if you won't need to use them anymore
els.destroy();

```

---

## View Controller Module: c$.ViewController();

* Let's you give View Controller structure to your projects. It lets you instantiate and extend "Classes" and create maintainable code.

### extend(params);

In order to use the View Controller class you first need to extend from it. There are also some default params and methods you can use.

Here is an example containing the most basic structure of a view controller class:

```javascript
// create a base class
var baseClass = ViewController.extend({
    initialize: function(){
        this.someVar = true;
        
        // render view
        this.show();
    },
    setDOMReferences: function(){
        this.button = c$.q(".button", this.view);
    },
    setListeners: function(){
        $.bindContext(this, "doSomething");
        
        this.button.on("click", this.doSomething);
    },
    doSomething: function(){
        console.log("button tapped", this);
    },
    show: function(){
        c$.q("body").html(this.view);
    }
});


// extend base class and override methods
// you can extend the class multiple times if you want
// you might need to call super methods if you decide to override them
var extendedClass = baseClass.extend({'
    viewSelector: "#stage",
    
    // override initialize
    initialize: function(){
        // call super method
        this.super.initialize.call(this);
        
        // mode code ...
    }
});

// create instance
// all the params you pass to the new instance will be stored in the options object
var instance = new extendedClass({ parent:this, foo: "foo", ... });

console.log(instance.options.foo); // print foo to console

// the parent param will be stored just as parent, so you can access it by calling
// instance.parent

```

#### Details:
* viewSelector: optional. If passed it will generate 2 properties: view which is the queried html element and the $view which is the html element wrapped in a c$.q() wrapper.
* setDOMReferences: optional. Please use this to save html references for the instance.
* setListeners: optional. Please use this to append listeners to the stored html elements.
* All instances you pass when creating the new instance will be stored inside the options object.
* if you pass the parent param, it will be stored as parent: "this.parent".

#### ViewController Class flow:
The flow of the class if very simple but powerfull:

```javascript
// create a custom instance
var instance = new baseClass({ parent: this });

// when creating the new instance, this will be the class flow:

// query view if viewSelector was provided => store options => store parent => run setDOMReferences() method => run setListeners() method => run initialize() method.

```

---

# Observer Module: c$.Observer();

It's an implementation of the observer or publish/subscriber pattern. It is used to achieve MV+ design patterns. It is a literal object that doesn't need instantiation.

You can subscribe many callbacks to an specified event and then fired them all at once when making a publication

## API:


### c$.Observer.subscribe(eventId, fnCallback, context);

it subscribes a callback to the specified eventId. You can also specify the context.

```javascript
c$.Observer.subscribe("onModelLoaded", this.modelWasLoaded, this);
```

#### Details:

* eventId: String
* fnCallback: function
* context: object

---

### c$.Observer.publish(eventId, params);

It will cause the observer to fire all registered callbacks that have been registered to that eventId. And will pass the specified params.

```javascript
c$.Observer.publish("onModelLoaded", { model: this.model });
```

#### Details:

* eventId: String
* params: literal object. Example: { msg: "hello", ... }

---

### c$.Observer.unsubscribe(eventId, fnCallback);

It unsubscribes the callback to the specified eventId

```javascript
c$.Observer.unsubscribe("onModelLoaded", this.modelWasLoaded);
```

#### Details:

* eventId: String
* fnCallback: function

---

# Collection Module: c$.Collection();

It's a collection object that uses keys and values. Similar to the NSDictionary in Xcode.

```javascript
// create collection
var collection = new c$.Collection();

// you can also pass a literal object when instantiating and it will add it to its list
var obj = {"cat": cat, dog: dog, foo: "foo"};
var collection2 = new Collection(obj);

```

## API:

### .add(keyName, item);

Adds the specified object to the collection under the specified key. If there is already an element under that key. It won't replace it. You would need to call the replace method.

```javascript
// create collection
var collection = new c$.Collection();

// create "ant"
var ant = {name: "ant"}

// add item
collection.add("ant", ant);

```
#### Details:

* keyName: String
* item: any object or DOM object
 
---

### .remove(keyName, item);

Removes the specified object to the collection under the specified key

```javascript
// create collection
var collection = new c$.Collection();

// create "ant"
var ant = {name: "ant"}

// add item
collection.add("ant", ant);

// remove
collection.remove("ant");

```
#### Details:

* keyName: String

---

### .replace(keyName, item);

Replaces the specified object under the specified key

```javascript
// create collection
var collection = new c$.Collection();

// create "ant"
var ant = {name: "ant"}

// add item
collection.add("ant", ant);

// replace
collection.replace("ant", {name: "redAnt"});

```
#### Details:

* keyName: String
* item: any object or DOM object

---

### .get(keyName);

Returns the specified object under the specified key

```javascript
// create collection
var collection = new c$.Collection();

// create "ant"
var ant = {name: "ant"}

// add item
collection.add("ant", ant);

// get ant
collection.get("ant");

```
#### Details:

* keyName: String

---

### .merge(object, replace);

Merges the contents of the object with the collection. If won't replace the existing keys unless you pass the replace param. .merge(object, true)

```javascript
// create collection
var collection = new c$.Collection();

// create "object"
var obj = {name: "ant", type: "red", hp: "24"}

// merge and replace
collection.merge(obj, true);

// if you dont want to replace any existing items you can just not pass true as a param: collection.merge(object);

// now the collection contains all the object data

```

---

### .clear();

Clears all the elements in the collection

```javascript
// create collection
var collection = new c$.Collection();

// create "ant"
var ant = {name: "ant"}

// add item
collection.add("ant", ant);

// remove all items
collection.clear();

```

---

### .each(callback);

Iterates through each element of the collection.

```javascript
// create collection
var collection = new c$.Collection();

// create "ant"
var ant = {name: "ant"}

// add item
collection.add("ant", ant);

// add another item
collection.add("ant2", {name, "ant2"});

// remove all items
collection.each(function(item, index){
    console.log(item, index);
});

```

&nbsp;

---




+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  Created by Ian Calderon for Say Media.

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++