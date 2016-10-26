var context = new AudioContext;
var paulstretchNode = context.createScriptProcessor(4096, 1, 1);
id = window.location.href.split('/'),
track = id[id.length-1] || "95831002";
url = 'http://api.soundcloud.com/tracks/' + id[id.length-1] + '/stream?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';

var One, Two, Three, Four;
var player;
var crusher; 
var cheby; 
var dist; 
var pitch;
var tremolo;
var vibrato;
var currentFilter;

var changeFilter = function(val){
        console.log(val);
        player.disconnect()
        switch(val){
            case '0':
                currentFilter = tremolo;
                break;
            case '1':
                currentFilter = cheby;
                break;
            case '2':
                currentFilter = vibrato;
                break;
            case '3':
                currentFilter = dist;
                break;
            case '4':
                currentFilter = crusher;
                break;
            
        }
        player.chain(currentFilter, pitch, Tone.Master);
        console.log(currentFilter);
    }
var reverseSong = function(val){
    setFour(val);
}

$( document ).ready(function() {       
    player = new Tone.Player(url, function(){
        console.log("Song loaded");
        $('#animation').removeClass('loader');
        $('#animation').addClass('play');
    });
    player.autostart = true;
    player.loop = true;
    crusher = new Tone.BitCrusher(8); //1-8
    cheby = new Tone.Chebyshev(1);  //1-100
    dist = new Tone.Distortion(0); //0-1
    pitch = new Tone.PitchShift(0);
    tremolo = new Tone.Tremolo(9, 0.75);
    vibrato = new Tone.Vibrato(9, 0.75);

    currentFilter = cheby;
    player.chain(currentFilter, pitch, Tone.Master);

    // audioSource.onended = function() {
    //     volumeNode.gain.value = 0;
    //     $('#pButton > i').addClass('fa-play');
    //     $('#pButton > i').removeClass('fa-pause');
    // }
    
    var icon = $('#animation');
    icon.click(function() {
        playStop();
    });
    var playStop = function(){
        icon.toggleClass('active');
        if (icon.hasClass('active')){
            player.start();
        } else {
            player.stop();
        }
        return false;
    }

    //Filter settings popover
    var html = $([
        '<select onchange="changeFilter(this.value)" class="custom-select centered">',
        '    <option value="0">Tremolo</option>',
        '    <option value="1">Chebyshev</option>',
        '    <option value="2">Vibrato</option>',
        '    <option value="3">Distortion</option>',
        '    <option value="4">Bitcrusher</option>',
        '</select>',
        '<input id="one" class="centered" type="range" min="0" max="1023" step="0" oninput="setOne(this.value)">',
        '<h3 class="centered">Pitch</h3>',
        '<input id="one" class="centered" type="range" min="0" max="1023" step="0" oninput="setTwo(this.value)"">',
        '<h3 class="centered">Playback rate</h3>',
        '<input id="one" class="centered" type="range" min="0" max="1023" step="0" oninput="setThree(this.value)">',
        '<label class="custom-control custom-checkbox centered">',
        '    <input onchange="reverseSong(this.checked)" type="checkbox" class="custom-control-input">',
        '    <span class="custom-control-indicator"></span>',
        '    <span class="custom-control-description">Reverse song</span>',
        '</label>',
    ].join("\n")); 


    $('#Filter').popover({content:html, html: true});
    $('#Filter').on('shown.bs.popover', function () {
    	document.getElementById("one").value = One;
        document.getElementById("two").value = Two;
        document.getElementById("three").value = Three;
    });

    $('#search').click(function() {
        if ($('.fa').hasClass("fa-search")){
            $('#querycont').css('display', 'block');
            $('.fa').removeClass("fa-search");
            $('.fa').addClass("fa-chevron-right");
            $('#player').addClass('overlay');
        } else {
            $('#querycont').css('display', 'none');
            $('.fa').addClass("fa-search");
            $('.fa').removeClass("fa-chevron-right");
            $('#player').removeClass('overlay');
        }       
    });   
});

var setOne = function(q){
    console.log("One:" + q );
    One = q;
    $('#One').html(q);
    switch (currentFilter) {
        case cheby:
            currentFilter.order = Math.round(mapValue(q,1,50));
            break;
        case tremolo:
            currentFilter.frequency = Math.round(mapValue(q,0,20));
            break;
        case crusher:
            currentFilter.bits = Math.round(mapValue(q,1,8));
            break;
        case dist:
            currentFilter.distortion = mapValue(q,0,1);
            break;
        case vibrato:
            currentFilter.frequency = Math.round(mapValue(q,0,20));
            break;
    }
    
}

var setTwo = function(q){
    Two = q;
    $('#Two').html(q);
    pitch.pitch = Math.round(mapValue(q,-12,12));
    console.log("Two:" + pitch.pitch );
}

var setThree = function(q){
    Three = q;
    $('#Three').html(q);
    player.playbackRate = mapValue(q,0.5,2);
    console.log("Three:" + player.playbackRate);
}

var setFour = function(q){
    Four = q;
    player.reverse = Four;
}

var mapValue = function(x,c,d){
    return (x-0)/(1023)*(d-c)+c;
}



