var numberOfChannels = 1, 
bufferSize = 4096, 
batchSize = 4, 
winSize = 4096 * 4, 
blocksIn = [], 
blocksOut = [],
configForm = document.getElementById('config')
PSconnected = false;

paulstretchWorker.postMessage({
    type: 'init',
    winSize: winSize,
    numberOfChannels: 1,
    blockSize: bufferSize,
    batchSize: batchSize,
});

$( document ).ready(function() {

    $("#config").submit(function(e){
        e.preventDefault();
        var ratio = parseFloat(this.elements[0].value)
        if (ratio < 2){
            if (PSconnected)
                disconnectPS();
            basicStretch(1/ratio);
        } else {
            if (!PSconnected)
                connectPS();
            blocksIn, blocksOut = [];
            paulstretchWorker.postMessage({ type: 'config', ratio: ratio });
        }   
    });

    audioSource.addEventListener('canplay', function() {
        audioSource.play()

        paulstretchWorker.onmessage = function (event) {
        // Add all the blocks from the batch to the `blocksOut` queue.
            if (event.data.type === 'read') {
                var blocks = event.data.data;
                while (blocks.length) 
                    blocksOut.push(blocks.shift());
            }
        }

        paulstretchNode.onaudioprocess = function(event) {
            var ch, block = []
            // Add every incoming block to the `blocksIn` queue
            for (ch = 0; ch < numberOfChannels; ch++)
                block.push(event.inputBuffer.getChannelData(ch));
            blocksIn.push(block);
            
            // If there is any processed block, play it back ...
            if (self.blocksOut.length) {
                block = self.blocksOut.shift();
                for (ch = 0; ch < numberOfChannels; ch++)
                    event.outputBuffer.getChannelData(ch).set(block[ch]);
            }  
        }

        // Periodically, handle the `blockIn` and `blockOut` queues :
        // Send `blocksIn` to the worker for future processing and ask for batches that are ready to put in `blocksOut`.
        setInterval(function() {
            if (blocksIn.length && PSconnected && !audioSource.paused)
                paulstretchWorker.postMessage({ type: 'write', data: blocksIn.shift() });
            if (blocksIn.length && !PSconnected && !audioSource.paused) {
                while (blocksIn.length) 
                    blocksOut.push(blocksIn.shift());
            }
            if (blocksOut.length < batchSize && PSconnected && !audioSource.paused) 
                paulstretchWorker.postMessage({ type: 'read' });
        }, 100)

    }, true)   
});

function disconnectPS(){
    PSconnected = false;
    // sourceNode.disconnect(paulstretchNode);
    // paulstretchNode.disconnect(ampGainNode);
    // sourceNode.connect(ampGainNode);
}
function connectPS(){
    PSconnected = true;
    // audioSource.playbackRate = 1;
    // sourceNode.disconnect(ampGainNode);
    // sourceNode.connect(paulstretchNode);
    // paulstretchNode.connect(ampGainNode);
}
function basicStretch(amount){
    audioSource.playbackRate = amount;
}
