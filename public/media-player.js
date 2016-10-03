$( document ).ready(function() {
    //Play and Pause
    $( "#pButton" ).click(function() {
        if (audioSource.paused) 
            audioSource.play();
        else 
            audioSource.pause();
        $('#pButton > i').toggleClass('fa-play');
        $('#pButton > i').toggleClass('fa-pause');
    })
});

var audioSource = new Audio, 
context = new AudioContext,
sourceNode = context.createMediaElementSource(audioSource),
id = window.location.href.split('/'),
url = 'http://api.soundcloud.com/tracks/' + id[id.length-1] + '/stream?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
paulstretchWorker = new Worker('/paulstretch-worker.js'), 
paulstretchNode = context.createScriptProcessor(4096, 1, 1),

volume = 1,
ampModFreq = 1,
ampModShape = null,
filterQ = 0,
filterFreq = 400,
ampGainNode = context.createGain(),
ampModulatorNode = null,
filterNode = context.createBiquadFilter(),
mixerNode = context.createGain();

filterNode.type = 'bandpass';
filterNode.Q.value = filterQ;
filterNode.frequency.value = filterFreq;
audioSource.crossOrigin = 'anonymus';
audioSource.src = url;

sourceNode.connect(paulstretchNode);
paulstretchNode.connect(ampGainNode);
ampGainNode.connect(filterNode);
filterNode.connect(mixerNode);
mixerNode.connect(context.destination);



