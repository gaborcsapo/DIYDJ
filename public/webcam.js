var capture;
var average = {'count':0, 'x':0, 'y':0};



$(document).ready(function(){
    setTimeout(function(){ 
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.canvas.height = 240;
        context.canvas.scrollHeight = 240;
        context.canvas.width = 320;
        context.canvas.scrollWidth = 320;
        var tracker = new tracking.ColorTracker();
        tracker.setMinDimension(5);
        tracking.track('video', tracker);
        tracker.on('track', function(event) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            average.count = 0;
            average.x = 0;
            average.y = 0;
            event.data.forEach(function(rect) {
                if (rect.color === 'custom') {
                rect.color = tracker.customColor;
                }
                context.strokeStyle = rect.color;
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                average.count++;
                average.x+=rect.x;
                average.y+=rect.y;
            });
        });
        initGUIControllers(tracker);
    }, 2000);
    setInterval(function(){ 
        if (shown){
            setTwo(((average.x/average.count-0)/(320)*(1023-0)+0)||Two);
            if (document.getElementById("one") != null)
                document.getElementById("one").value = (((average.x/average.count-0)/(320)*(1023-0)+0)||Two);
            if (document.getElementById("two") != null)
                document.getElementById("two").value = ((average.y/average.count-0)/(240)*(1023-0)+0||Three);
            setThree(((average.y/average.count-0)/(240)*(1023-0)+0||Three));
            
        }
    }, 500);     
}) 

var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
	myRec.continuous = true; // do continuous recognition
	myRec.interimResults = true; // allow partial recognition (faster, less accurate)
function parseResult()
	{
		// recognition system will often append words into phrases.
		// so hack here is to only use the last word:
		var mostrecentword = myRec.resultString.split(' ').pop();
		if(mostrecentword.indexOf("reverse")!==-1) { setFour(true); }
		// else if(mostrecentword.indexOf("right")!==-1) { dx=1;dy=0; }
		// else if(mostrecentword.indexOf("up")!==-1) { dx=0;dy=-1; }
		// else if(mostrecentword.indexOf("down")!==-1) { dx=0;dy=1; }
		// else if(mostrecentword.indexOf("clear")!==-1) { background(255); }
		console.log(mostrecentword);
	}


function setup() {
    createCanvas(320, 240);
    capture = createCapture(VIDEO);
    capture.size(320, 240);
    myRec.onResult = parseResult; // recognition callback
	myRec.start(); // start engine
}

function draw() {
    background(255);
    image(capture, 0, 0, 320, 240);
    filter('INVERT');
}

showVideo = function(){
    if (shown){
        shown = false;
        $('canvas').css('bottom', '-500px' )
    } else {
        shown = true;
        $('canvas').css('bottom', '20%' )
    }
}

