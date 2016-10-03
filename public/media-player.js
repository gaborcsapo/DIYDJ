$( document ).ready(function() {
    var duration; // Duration of audio clip   
    var timelineWidth = $('#timeline').width() - $('#playhead').width();  // timeline width adjusted for playhead
    audioSource.addEventListener("timeupdate", timeUpdate, false); 
    //Makes timeline clickable
    $('#timeline').on("click", function (event) {
        moveplayhead(event);
        audioSource.currentTime = duration * clickPercent(event);
    });
    // returns click as decimal (.77) of the total timelineWidth
    function clickPercent(e) {
        return (e.pageX - $('#timeline').offset().left) / timelineWidth;
    }
    // Makes playhead draggable 
    document.getElementById('playhead').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    // Boolean value so that mouse is moved on mouseUp only when the playhead is released 
    var onplayhead = false;
    // mouseDown EventListener
    function mouseDown() {
        onplayhead = true;
        window.addEventListener('mousemove', moveplayhead, true);
        audioSource.removeEventListener('timeupdate', timeUpdate, false);
    }
    // mouseUp EventListener: getting input from all mouse clicks
    function mouseUp(e) {
        if (onplayhead == true) {
            moveplayhead(e);
            window.removeEventListener('mousemove', moveplayhead, true);
            // change current time
            audioSource.currentTime = duration * clickPercent(e);
            audioSource.addEventListener('timeupdate', timeUpdate, false);
        }
        onplayhead = false;
    }
    // mousemove EventListener: Moves playhead as user drags
    function moveplayhead(e) {
        var newMargLeft = e.pageX - $('#timeline').offset().left;
        if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
            $('#playhead').css('margin-left', newMargLeft + "px");
        }
        if (newMargLeft < 0) {
            $('#playhead').css('margin-left', 0);
        }
        if (newMargLeft > timelineWidth) {
            $('#playhead').css('margin-left', timelineWidth + "px");
        }
    }

    // timeUpdate: Synchronizes playhead position with current point in audioSource 
    function timeUpdate() {
        var playPercent = timelineWidth * (audioSource.currentTime / duration);
        $('#playhead').css('margin-left', playPercent + "px");
        if (audioSource.currentTime == duration) {
            $('#pButton > i').removeClass('fa-pause');
            $('#pButton > i').addClass('fa-play');
        }      
    }

    //Play and Pause
    $( "#pButton" ).click(function() {
        if (audioSource.paused) 
            audioSource.play();
        else
            audioSource.pause();
        $('#pButton > i').toggleClass('fa-play');
        $('#pButton > i').toggleClass('fa-pause');
    });

    // Gets audio file duration
    audioSource.addEventListener("canplaythrough", function () {
        duration = audioSource.duration;  
    }, false);
});




