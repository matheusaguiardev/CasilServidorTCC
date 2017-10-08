var gpio = require('rpi-gpio');
var play = require('play').Play();

let watcher = true;
const PIN_NUMBER = 7;

	gpio.on('change', function(channel, value){
	  console.log('channel '+ channel + 'ding '+ value);
	console.log('valor ->' + value);
	  if(value && watcher){
	   watcher = false;
	   setTimeout(function(){watcher = true},5000);
	   play.sound(require('path').join(process.cwd(), './ding.wav'));
	  }
	});

gpio.setup(PIN_NUMBER, gpio.DIR_IN, gpio.EDGE_BOTH);
console.log('started');
