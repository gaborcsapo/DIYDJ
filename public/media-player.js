var audioSource = new Audio,
context = new AudioContext,
sourceNode = context.createMediaElementSource(audioSource),
id = window.location.href.split('/'),
url = 'http://api.soundcloud.com/tracks/' + id[id.length-1] + '/stream?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
    
$( document ).ready(function() {
    paulstretchWorker = new Worker('/paulstretch-worker.js'), 
    paulstretchNode = context.createScriptProcessor(4096, 1, 1),
    pitchShiftNode = context.createScriptProcessor(2048, 1, 1),
    ampGainNode = context.createGain(),
    filterNode = context.createBiquadFilter(),
    volumeNode = context.createGain();
    
    stretch = 1,
    volume = 1,
    ampModFreq = 1,
    ampModShape = null,
    filterQ = 0,
    filterFreq = 400;

    filterNode.type = 'bandpass';
    filterNode.Q.value = filterQ;
    filterNode.frequency.value = filterFreq;
    
    audioSource.crossOrigin = 'anonymus';
    audioSource.src = url;

    //sourceNode.connect(ampGainNode);
    sourceNode.connect(paulstretchNode);
    //sourceNode.connect(pitchShiftNode);
    paulstretchNode.connect(pitchShiftNode);
    //paulstretchNode.connect(filterNode);
    pitchShiftNode.connect(filterNode);
    filterNode.connect(volumeNode);
    volumeNode.connect(context.destination);
    
    
    //Play and Pause
    $( "#pButton" ).click(function() {
        if (audioSource.paused){ 
            audioSource.play();
            volumeNode.gain.value = volume;
        }
        else {
            audioSource.pause();
            volumeNode.gain.value = 0;
        }
        $('#pButton > i').toggleClass('fa-play');
        $('#pButton > i').toggleClass('fa-pause');
    })

    audioSource.onended = function() {
        volumeNode.gain.value = 0;
        $('#pButton > i').addClass('fa-play');
        $('#pButton > i').removeClass('fa-pause');
    }   
});

var setStretch = function(ratio) {
  stretch = ratio
  stretchDec(ratio)
  console.log(ratio);
}

var setVolume = function(volume) {
  volume = volume
  volumeNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.05)
}

var setFilterQ = function(q) {
  filterQ = q
  filterNode.Q.linearRampToValueAtTime(q, context.currentTime + 0.05)
}

var setFilterFreq = function(freq) {
  filterFreq = freq
  filterNode.frequency.exponentialRampToValueAtTime(freq, context.currentTime + 0.05)
}


