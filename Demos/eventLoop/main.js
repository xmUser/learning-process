// Introduce events Modular
var events = require('events');
// Create eventEmitter boject
var eventEmitter = new events.EventEmitter();

// Create event handler
var connectHandler = function connected() {
   console.log('Connect successfully.');
  
   // Trigger data_received event 
   eventEmitter.emit('data_received');
}

// Bind connection event handler
eventEmitter.on('connection', connectHandler);
 
// Anonymous function binding data_received event
eventEmitter.on('data_received', function(){
   console.log('Data received successfully.');
});

// Trigger connection event 
eventEmitter.emit('connection');

console.log("Program execution completed.");