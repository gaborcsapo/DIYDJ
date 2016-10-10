var numberOfChannels = 1, 
bufferSize = 4096, 
batchSize = 4, 
winSize = 4096 * 4, 
blocksIn = [], 
blocksOut = [],
basic = true;



var stretchDec = function (ratio){
    if (ratio < 2){
            basic = true;
            audioSource.playbackRate = (1/ratio);
        } else {
            basic = false;
            audioSource.playbackRate = 1;
            //blocksIn, blocksOut = [];
            paulstretchWorker.postMessage({ type: 'config', ratio: ratio });
        }
}

$( document ).ready(function() {
    paulstretchWorker.postMessage({
        type: 'init',
        winSize: winSize,
        numberOfChannels: 1,
        blockSize: bufferSize,
        batchSize: batchSize,
    });

    audioSource.addEventListener('canplay', function() {
        audioSource.play();

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
            if (blocksIn.length && !basic && !audioSource.paused)
                paulstretchWorker.postMessage({ type: 'write', data: blocksIn.shift() });
            if (blocksIn.length && basic && !audioSource.paused) {
                while (blocksIn.length) 
                    blocksOut.push(blocksIn.shift());
            }
            if (blocksOut.length < batchSize && !basic && !audioSource.paused) 
                paulstretchWorker.postMessage({ type: 'read' });
        }, 100)

    }, true)   
});