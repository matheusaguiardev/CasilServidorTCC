var gpio = require('rpi-gpio');
var play = require('play').Play();

const PIN_NUMBER = 7;
var timeout = null;

    gpio.on('change', function(channel, value){
      console.log('channel '+ channel + 'ding '+ value);
      press();
    });
        
    function press() {
      if(!timeout) {
         play.sound(require('path').join(process.cwd(), './ding.wav'));
         timeout = setTimeout(function() {
         clearTimeout(timeout);
         timeout = null;
         }, 3000);
      }
    return !timeout
    }

gpio.setup(PIN_NUMBER, gpio.DIR_IN, gpio.EDGE_BOTH);
console.log('started');