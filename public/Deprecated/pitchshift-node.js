shifterStartValue = 0.5;
shiftValue = 0.5;

audioSource.addEventListener('canplay', function() {
    var shifter = new Pitchshift(2048, context.sampleRate, 'FFT');

    pitchShiftNode.onaudioprocess = function (event) {
        // Get left/right input and output arrays
        var outputArray = [];
        outputArray[0] = event.outputBuffer.getChannelData(0);
        var inputArray = [];
        inputArray[0] = event.inputBuffer.getChannelData(0);
        // console.log ("input is long: ", inputArray[0].length);
        var data = inputArray[0];
        shifter.process (shiftValue, data.length, 4, data);
        
        var out_data = outputArray[0];
        for (i = 0; i < out_data.length; ++i) {
            out_data[i] = shifter.outdata[i];
        }
        
    }.bind(this);

    $("#pitchRatioSlider").on('input', function(ui){
            shiftValue = parseFloat($(this).val());
            console.log(parseFloat(shiftValue));
    });
});