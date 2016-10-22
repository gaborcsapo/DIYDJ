var audioSource = new Audio,
context = new AudioContext,
sourceNode = context.createMediaElementSource(audioSource),
paulstretchNode = context.createScriptProcessor(4096, 1, 1);
id = window.location.href.split('/'),
track = id[id.length-1] || "95831002";
url = 'http://api.soundcloud.com/tracks/' + id[id.length-1] + '/stream?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';

var player;
var crusher; 
var cheby; 
var dist = new Tone.Distortion(0); 
var pitch;
var tremolo;
var vibrato;

$( document ).ready(function() {
    audioSource.crossOrigin = 'anonymus';
    audioSource.src = url;    
       
    player = new Tone.Player(url, function(){
        console.log("Song loaded");
    })
    player.autostart = true;
    crusher = new Tone.BitCrusher(8); //1-8
    cheby = new Tone.Chebyshev(1);  //1-100
    dist = new Tone.Distortion(0); //0-1
    pitch = new Tone.PitchShift(0);
    tremolo = new Tone.Tremolo(9, 0.75);
    vibrato = new Tone.Vibrato(9, 0.75);
    player.chain(cheby, pitch, Tone.Master);
    
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

var setOne = function(q){
    console.log("One:" + q );
    One = q;
    $('#One').html(q);
    cheby.order = Math.round(mapValue(q,1,100));
}

var setTwo = function(q){
    console.log("Two:" + q );
    Two = q;
    $('#Two').html(q);
    pitch.pitch = Math.round(mapValue(q,-12,12));
}

var setThree = function(q){
    console.log("Three:" + q );
    Three = q;
    $('#Three').html(q);
    player.playbackRate = mapValue(q,0.5,2);
}

var mapValue = function(x,c,d){
    return (x-0)/(1023)*(d-c)+c;
}


