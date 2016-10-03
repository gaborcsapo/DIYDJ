var context = new AudioContext
    , numberOfChannels = 1
    , bufferSize = 4096
    , batchSize = 4
    , winSize = 4096 * 4
    , paulstretchWorker = new Worker('/paulstretch-worker.js')
    , paulstretchNode = context.createScriptProcessor(bufferSize, 1, 1)
    , audioSource = new Audio
    , sourceNode
    , blocksIn = [], blocksOut = []

paulstretchWorker.postMessage({
    type: 'init',
    winSize: winSize,
    numberOfChannels: 1,
    blockSize: bufferSize,
    batchSize: batchSize,
})

var configForm = document.getElementById('config')
$( document ).ready(function() {
    $("#config").submit(function(e){

        e.preventDefault();
        var ratio = parseFloat(this.elements[0].value)
        if (ratio < this.elements[0].value){
            sourceNode.disconnect(paulstretchNode)
            paulstretchNode.disconnect(context.destination)
            sourceNode.connect(context.destination);
        } else {
            paulstretchWorker.postMessage({ type: 'config', ratio: ratio });
        return false;
        }
        
    });   
});

audioSource.addEventListener('canplay', function() {
    console.log('audio loaded')
    sourceNode = context.createMediaElementSource(audioSource)
    audioSource.play()
    sourceNode.connect(paulstretchNode)
    paulstretchNode.connect(context.destination)

    paulstretchWorker.onmessage = function (event) {
    // Add all the blocks from the batch to the `blocksOut` queue.
    if (event.data.type === 'read') {
        var blocks = event.data.data
        while (blocks.length) blocksOut.push(blocks.shift())
    }
    }

    paulstretchNode.onaudioprocess = function(event) {
    var ch, block = []

    // Add every incoming block to the `blocksIn` queue
    for (ch = 0; ch < numberOfChannels; ch++)
        block.push(event.inputBuffer.getChannelData(ch))
    blocksIn.push(block)
    
    // If there is any processed block, play it back ...
    if (self.blocksOut.length) {
        block = self.blocksOut.shift()
        for (ch = 0; ch < numberOfChannels; ch++)
        event.outputBuffer.getChannelData(ch).set(block[ch])
    }
    }

    // Periodically, handle the `blockIn` and `blockOut` queues :
    // Send `blocksIn` to the worker for future processing and ask for batches that are ready to put in `blocksOut`.
    setInterval(function() {
    if (blocksIn.length)
        paulstretchWorker.postMessage({ type: 'write', data: blocksIn.shift() })

    if (blocksOut.length < batchSize) 
        paulstretchWorker.postMessage({ type: 'read' })
    }, 100)

}, true)

var id = window.location.href.split('/');
var url = 'http://api.soundcloud.com/tracks/' + id[id.length-1] + '/stream?client_id=a76e446ebb86aaafa04e563f2e8046f3&callback=processTracks';
audioSource.crossOrigin = 'anonymus';
audioSource.src = url;
paulstretchWorker.postMessage({ type: 'config', ratio: '2' })
    
