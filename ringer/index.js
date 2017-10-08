var gpio = require('rpi-gpio');
var play = require('play').Play();

const PIN_NUMBER = 7;
var timeout = null;

	gpio.on('change', function(channel, value){
	  console.log('channel '+ channel + 'ding '+ value);
	console.log('valor ->' + value);
	  if(value && press()){
	  watcher = false;
	   setTimeout(function(){watcher = true;},5000);
	   play.sound(require('path').join(process.cwd(), './ding.wav'));
	  }
	});
		
	function press() {
	  if(!timeout) {
	     console.log("Envia notificação");
	     timeout = setTimeout(function() {
	     clearTimeout(timeout);
	     timeout = null;
	     }, 3000);
	 }
	return !timeout
	}
}

gpio.setup(PIN_NUMBER, gpio.DIR_IN, gpio.EDGE_BOTH);
console.log('started');
