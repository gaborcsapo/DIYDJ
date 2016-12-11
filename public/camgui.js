function initGUIControllers(tracker) {
  // GUI Controllers

  var gui = new dat.GUI();

  var trackedColors = {
    custom: false
  };

  Object.keys(tracking.ColorTracker.knownColors_).forEach(function(color) {
    trackedColors[color] = true;
  });

  tracker.customColor = '#000000';

  function createCustomColor(value) {
    var components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    var customColorR = parseInt(components[1], 16);
    var customColorG = parseInt(components[2], 16);
    var customColorB = parseInt(components[3], 16);

    var colorTotal = customColorR + customColorG + customColorB;

    if (colorTotal === 0) {
      tracking.ColorTracker.registerColor('custom', function(r, g, b) {
        return r + g + b < 10;
      });
    } else {
      var rRatio = customColorR / colorTotal;
      var gRatio = customColorG / colorTotal;

      tracking.ColorTracker.registerColor('custom', function(r, g, b) {
        var colorTotal2 = 255-r+255-g+255-b;

        if (colorTotal2 === 0) {
          if (colorTotal < 10) {
            return true;
          }
          return false;
        }

        var rRatio2 = (255-r) / colorTotal2,
          gRatio2 = (255-g) / colorTotal2,
          deltaColorTotal = colorTotal / colorTotal2,
          deltaR = rRatio / rRatio2,
          deltaG = gRatio / gRatio2;
          
        return deltaColorTotal > 0.9 && deltaColorTotal < 1.1 &&
          deltaR > 0.9 && deltaR < 1.1 &&
          deltaG > 0.9 && deltaG < 1.1;
      });
    }

    updateColors();
  }

  function updateColors() {
    var colors = [];

    for (var color in trackedColors) {
      if (trackedColors[color]) {
        colors.push(color);
      }
    }

    tracker.setColors(colors);
  }

  var colorsFolder = gui.addFolder('Colors');

  Object.keys(trackedColors).forEach(function(color) {
    if (color !== 'custom') {
      colorsFolder.add(trackedColors, color).onFinishChange(updateColors);
    }
  });

  colorsFolder.add(trackedColors, 'custom').onFinishChange(function(value) {
    if (value) {
      this.customColorElement = colorsFolder.addColor(tracker, 'customColor').onChange(createCustomColor);
    } else {
      colorsFolder.remove(this.customColorElement);
    }
  });

  function invertColor(hexTripletColor) {
        var color = hexTripletColor;
        color = color.substring(1); // remove #
        color = parseInt(color, 16); // convert to integer
        color = 0xFFFFFF ^ color; // invert three bytes
        color = color.toString(16); // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color; // prepend #
        return color;
    }

  var parametersFolder = gui.addFolder('Parameters');

  parametersFolder.add(tracker, 'minDimension', 1, 100);
  parametersFolder.add(tracker, 'minGroupSize', 1, 100);

  colorsFolder.open();
  parametersFolder.open();

  updateColors();
}