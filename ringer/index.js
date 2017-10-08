var gpio = require('rpi-gpio');
var play = require('play').Play();
var oneSignal = require('../CreateNotification.js');

const PIN_NUMBER = 7;
var timeout = null
		console.log("Configuração de escuta do pino: " + PIN_NUMBER);
    gpio.on('change', function(channel, value){
      console.log('channel '+ channel + 'ding '+ value);
      press();
    });
        
    function press() {
			console.log("Botão foi pressionado");
      if(!timeout) {
				console.log(">>>>>>>>>>>> DING DING DING <<<<<<<<<<<<");
				 play.sound(require('path').join(process.cwd(), './ding.wav'));
				 oneSignal(createMessageWithText("Tem alguém na porta !"));
         timeout = setTimeout(function() {
         clearTimeout(timeout);
         timeout = null;
         }, 3000);
      }
    return !timeout
    }

gpio.setup(PIN_NUMBER, gpio.DIR_IN, gpio.EDGE_RISING);
console.log('>>>>> Servidor iniciado <<<<<');