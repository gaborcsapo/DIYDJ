var audioSource = new Audio,
context = new AudioContext,
sourceNode = context.createMediaElementSource(audioSource),
id = window.location.href.split('/'),
url = 'http://api.soundcloud.com/tracks/' + id[id.length-1] + '/stream?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
    
$( document ).ready(function() {
    paulstretchWorker = new Worker('/paulstretch-worker.js'), 
    paulstretchNode = context.createScriptProcessor(4096, 1, 1),
    pitchShiftNode = context.createScriptProcessor(2048, 1, 1);
    
    
    stretch = 1,
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

    sourceNode.connect(pitchShiftNode);
    pitchShiftNode.connect(paulstretchNode);
    paulstretchNode.connect(ampGainNode);
    ampGainNode.connect(filterNode);
    filterNode.connect(mixerNode);
    mixerNode.connect(context.destination);
    //Play and Pause
    $( "#pButton" ).click(function() {
        if (audioSource.paused){ 
            audioSource.play();
            mixerNode.gain.value = volume;
        }
        else {
            audioSource.pause();
            mixerNode.gain.value = 0;
        }
        $('#pButton > i').toggleClass('fa-play');
        $('#pButton > i').toggleClass('fa-pause');
    })

    audioSource.onended = function() {
        mixerNode.gain.value = 0;
        $('#pButton > i').addClass('fa-play');
        $('#pButton > i').removeClass('fa-pause');
    }

     
    
});

var setStretch = function(ratio) {
  stretch = ratio
  stretchDec(ratio)
}

var setAmpModFreq = function(freq) {
  ampModFreq = freq
  if (ampModulatorNode) {
    ampModulatorNode.playbackRate.exponentialRampToValueAtTime(freq, context.currentTime + 0.05)
  }
}
var setVolume = function(volume) {
  volume = volume
  mixerNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.05)
}

var setFilterQ = function(q) {
  filterQ = q
  filterNode.Q.linearRampToValueAtTime(q, context.currentTime + 0.05)
}

var setFilterFreq = function(freq) {
  filterFreq = freq
  filterNode.frequency.exponentialRampToValueAtTime(freq, context.currentTime + 0.05)
}

var setAmpModShape = function(array) {
  var buffer = context.createBuffer(1, 44100, context.sampleRate)
    , upsampled = utils.upsample(array, 44100)

  buffer.getChannelData(0).set(upsampled)
  ampModShape = array
  if (ampModulatorNode) {
    ampModulatorNode.stop(0)
    ampModulatorNode.disconnect()
  } else ampGainNode.gain.value = 0 // First time we need to remove the static gain
  ampModulatorNode = context.createBufferSource()
  ampModulatorNode.loop = true
  ampModulatorNode.connect(ampGainNode.gain)
  ampModulatorNode.buffer = buffer
  setAmpModFreq(ampModFreq)
  ampModulatorNode.start(0)
}


