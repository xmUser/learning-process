var events = require('events');
var eventEmitter = new events.EventEmitter();

// Sets the listener for an object that will trigger the error event to avoid crashing the entire program
// eventEmitter.emit('error'); 

// Monitor #1
var listener1 = function listener1() {
   console.log('Monitor listener1 implement');
}

// Monitor #2
var listener2 = function listener2() {
  console.log('Monitor listener2 implement');
}

// Binding connection event, the processing function is listener1
eventEmitter.addListener('connection', listener1);

// Binding connection event, the processing function is listener2
eventEmitter.on('connection', listener2);

var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + " listener listens for connection events.");

// Handling connection event 
eventEmitter.emit('connection');

// Remove the listener1 function of the binding
eventEmitter.removeListener('connection', listener1);
console.log("Listener1 is no longer monitored.");

// Trigger connection event
eventEmitter.emit('connection');

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + "  listener listens for connection events.");

console.log("Program execution completed.");

// Open CMD, enter the right path
// Input node main.js