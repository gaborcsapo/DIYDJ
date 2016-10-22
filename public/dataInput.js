var socket;

function changeSong(id){
    console.log(id);
    window.location.href = '/'+id;
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

    //Socket.io input from Arduino
    socket = io();
    socket.on('ardat1', function(msg){
        ardat1 = msg;
        $('#ardat1').html(msg);
    });
    socket.on('ardat2', function(msg){
        ardat2 = msg;
        $('#ardat2').html(msg);
    });
    socket.on('ardat3', function(msg){
        ardat3 = msg;
        $('#ardat3').html(msg);
    });   
});


