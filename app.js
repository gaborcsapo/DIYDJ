var Request = require('request');
var bodyParser = require('body-parser');
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var ardatArray;
var ardat1 = 0;
var ardat2 = 0;
var ardat3 = 0;

app.set("views", __dirname);
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); 
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

//ROUTES
app.get("/api" , function (request, response) {
	response.send(ardsdat);
});

app.get("*", function(request, response){
	response.render('index');
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var serialport = require('serialport');// include the library
SerialPort = serialport.SerialPort; // make a local instance of it

var portName = "COM18";
serialport.list(function (err, ports) {
  portName = ports[1].comName;
  ports.forEach(function(port) {
    console.log(port.comName);
  });
});

var myPort = new SerialPort("COM18", {
	baudRate: 9600,
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\n")
});

myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function sendSerialData(data) {
   ardatArray = data.trim().split(",");
   if (Math.abs(parseInt(ardatArray[0]) - ardat1)>3){
      ardat1 = parseInt(ardatArray[0]);
      console.log(ardat1);
      io.emit('ardat1', ardat1);
   }
   if (Math.abs(parseInt(ardatArray[1]) - ardat2)>3){
      ardat2 = parseInt(ardatArray[1]);
      console.log(ardat2);
      io.emit('ardat2', ardat2);
   }
   if (Math.abs(parseInt(ardatArray[2]) - ardat3)>3){
      ardat3 = parseInt(ardatArray[2]);
      console.log(ardat3);
      io.emit('ardat3', ardat3);
   }  
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

function sendToSerial(data) {
  console.log("sending to serial: " + data);
  myPort.write(data);
}

io.on('connection', function(socket){
  console.log('a user connected');
  io.emit('ardat1', ardat1);
  io.emit('ardat2', ardat2);
  io.emit('ardat3', ardat3);
});