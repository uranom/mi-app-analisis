
let sippoUri = 'https://servicios.bazdigital.com/sippohub'

let config = {
    call: {
        showDisplayNames : false
    },
    buttonset: {
      enabled: false,
      buttons: {
          muteAudio: false,
          muteVideo: false,
          toggleCamera: false,
          screensharing: false,
          fullscreen: false,
          hangup: false,
      }
   }
}
let target = document.getElementById('target');
let c2c = new Click2Call(sippoUri, target, config);

c2c.on('registered', () => {
  console.log('Event: registrado')
  if (/Android|webOS/i.test(navigator.userAgent)) {
    Android.registrado();
  }
});


c2c.on('deregistered', () => console.log('Event: deregistered'));


c2c.on('callEstablished', () => {
  console.log('Event: callEstablished')
  if (/Android|webOS/i.test(navigator.userAgent)) {
    Android.llamadaEstablecida();
    pantallaCompleta();
  }
});
c2c.on('callFinished', () => {
  console.log('Event: callFinished')
  if (/Android|webOS/i.test(navigator.userAgent)) {
    Android.llamadaFinalizada();
  }
});

function hangup() {
  c2c.hangup().then(() => c2c.deregister());
}

function cambiarCamara(){
    c2c.callSvc.toggleCamera()
}


function pantallaCompleta(){
        var x = document.getElementsByClassName("_2bU0GRid3TB3d1RLqGSXGS");
        x[0].removeChild(x[0].children[1])
        x[0].removeChild(x[0].children[1])
        observer.observe(targetNode[0], configO);
}


const targetNode = document.getElementsByClassName('_2NFIO2QPFNzO1v9rQGTQXu');
const configO = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
                var v = document.getElementsByClassName("_3v8-cLBftzpYXSNlGyovk1")
                console.log(v[0])
                var vid = v[0].firstElementChild
                vid.style.height = "100%"
                vid.style.objectFit = "cover"
                observer.disconnect();
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

const observer = new MutationObserver(callback);


function register(){

}

async function llamar(agent,data){
      console.log("*** Llamando a: ****")
      console.log(agent)
      console.log("*******")
     c2c.setDisplayName(data)
     const conference = await c2c.call(agent)
        conference.emitter.once('participantAdded', async (userId) =>{
            c2c.subscribePresence('wac-user:' + userId);
            c2c.on('presenceUpdated', (presence) => {
                const avatar = presence.avatar ? presence.avatar : 'img/avatar.svg';
                const displayName = presence.displayName ? presence.displayName : 'Agente';
                 if(agent !== 'undefined'){
                        if (/Android|webOS/i.test(navigator.userAgent)) {
                           console.log("**** Nombre del agente de callcenter: ****")
                           console.log(displayName)
                           console.log("**** ****")
                           Android.nombreDelAgente(displayName)
                        }
                 }
                 c2c.unsubscribePresence('wac-user:' + userId);
            });
        });
}

register();