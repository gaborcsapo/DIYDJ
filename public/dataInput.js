var socket;

function changeSong(id){
    console.log(id);
    window.location.href = '/'+id;
    // url = 'http://api.soundcloud.com/tracks/' + id + '/stream?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
    // player.load(url);
}

$( document ).ready(function() {
    
    //Soundcloud Query
    $("#Query").submit(function(e){
        e.preventDefault();
        SC.get('/tracks', {
            q: $("#song-query").val(), license: 'to_share'
        }).then(function(tracks) {
            $('#songlist li').remove();
            tracks.forEach(function(item) {
                $('#songlist').append('<li class="list-group-item" onclick="changeSong(' + item.id + ')" >' + item.title + '</li>');
            });
        });
    }); 

    var getBackground = function(id){
        
    }
    
    //Socket.io input from Arduino
    socket = io();
    socket.on('ardatR', function(msg){
        switch (msg){
            case "a":
                setOne(One+5);
                break;
            case "b":
                playStop();
                break;
            case "c":
                setOne(One-5);
                break;
            case '1':
                currentFilter = tremolo;
                player.chain(currentFilter, pitch, Tone.Master);
                console.log(currentFilter);
                break;
            case '2':
                currentFilter = cheby;
                player.chain(currentFilter, pitch, Tone.Master);
                console.log(currentFilter);
                break;
            case '3':
                currentFilter = vibrato;
                player.chain(currentFilter, pitch, Tone.Master);
                console.log(currentFilter);
                break;
            case '4':
                currentFilter = dist;
                player.chain(currentFilter, pitch, Tone.Master);
                console.log(currentFilter);
                break;
            case '5':
                currentFilter = crusher;
                player.chain(currentFilter, pitch, Tone.Master);
                console.log(currentFilter);
                break;
            default:
                break;  
        }
    });
    socket.on('ardat1', function(msg){
        setOne(parseInt(msg));
        if (document.getElementById("one") != null)
            document.getElementById("one").value = parseInt(msg);
    });
    socket.on('ardat2', function(msg){
        setTwo(parseInt(msg));
        if (document.getElementById("two") != null)
            document.getElementById("two").value = parseInt(msg);
    });
    socket.on('ardat3', function(msg){
        setThree(parseInt(msg));
        if (document.getElementById("three") != null)
            document.getElementById("three").value = parseInt(msg);
    });
    socket.on('ardat4', function(msg){
        setFour((parseInt(msg) == 1 ? true : false));
        if (document.getElementById("four") != null)
            document.getElementById("four").value = parseInt(msg);
    });  
});


