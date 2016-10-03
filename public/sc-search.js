function changeSong(id){
    console.log(id);
    window.location.href = '/'+id;
}

$( document ).ready(function() {
    console.log(SC);
    $("#Query").submit(function(e){
        e.preventDefault();
        SC.get('/tracks', {
            q: $("#song-query").val(), license: 'cc-by-sa'
        }).then(function(tracks) {
            $('#songlist li').remove();
            tracks.forEach(function(item) {
                $('#songlist').append('<li class="list-group-item" onclick="changeSong(' + item.id + ')" >' + item.title + '</li>');
            });
        });
    });   
});


