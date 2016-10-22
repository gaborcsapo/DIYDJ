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
        setOne(parseInt(msg));
        document.getElementById("one").value = parseInt(msg);
    });
    socket.on('ardat2', function(msg){
        setTwo(parseInt(msg));
        document.getElementById("two").value = parseInt(msg);
    });
    socket.on('ardat3', function(msg){
        setThree(parseInt(msg));
        document.getElementById("three").value = parseInt(msg);
    });  
});


