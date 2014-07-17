var net= require('net');
var fs= require('fs');
var es= require('event-stream');
var path= require('path');

var socketPath=process.env.WEBSESSION;
var scriptPath=path.dirname(process.argv[1]);

var naosConnection=net.connect(socketPath,handleWebConnect);

function handleWebConnect() {
    var frame=fs.readFileSync(scriptPath+"/tinyframe.html");
    var header={"protocol":"processframe", "frameContent": frame.toString('base64')};
    naosConnection.write(JSON.stringify(header)+"\n");  
	  naosConnection.pipe(es.split('\n')).on("data",function(data) {
			var ob=JSON.parse(data);
			naosConnection.write(ob.key+"\n");
		});
    setInterval(ticker,1000);
}
naosConnection.on('end',  function() {process.exit()});
naosConnection.on('close',  function() {process.exit()});

function ticker() {
	naosConnection.write("tick\n");
}
	
