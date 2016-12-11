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
                setThree(Three+150);
                if (document.getElementById("two") != null)
                    document.getElementById("two").value = Three+150;
                break;
            case "b":
                playStop();
                break;
            case "c":
                setThree(Three-150);
                if (document.getElementById("two") != null)
                    document.getElementById("two").value = Three+150;
                break;
            case '1':
                changeFilter('0');
                break;
            case '2':
                changeFilter('1');
                break;
            case '3':
                changeFilter('2');
                break;
            case '4':
                changeFilter('3');
                break;
            case '5':
                changeFilter('4');
                break;
            default:
                break;  
        }
    });
    socket.on('ardat1', function(msg){
        setTwo(parseInt(msg));
        if (document.getElementById("one") != null)
            document.getElementById("one").value = parseInt(msg);
    });
    socket.on('ardat2', function(msg){
        setOne(parseInt(msg));
        if (document.getElementById("zero") != null)
            document.getElementById("zero").value = parseInt(msg);
    });
    socket.on('ardat3', function(msg){
        setThree(parseInt(msg));
        if (document.getElementById("two") != null)
            document.getElementById("two").value = parseInt(msg);
    });  
});


