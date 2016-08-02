(function() {
	var API = new Module("bridge");
  var opcode_open_notify=0;
  var opcode_close_notify=1;
  var opcode_data=2;
    
  var socket;
  var connections = [];
  
  function sendBridgeMessage(id,data,opcode) {
		if (typeof opcode === "undefined") opcode = opcode_data;
    var dataBlob=new Blob([data]);
    var header=new ArrayBuffer(16);
    var h=new DataView(header);
    h.setUint32(0,id,true);
    h.setUint32(8,dataBlob.size,true);
    h.setUint8(4,opcode);
    socket.send(new Blob([header,dataBlob]));
  }
  
  function connectionOpened(e) {
	  console.log("websocket connection opened" , e);
  }
  
  function connectionClosed() {
  
  }
  
  function BridgeConnection (id) {
    this.id = id;
    this.initialized=false;
    this.buffer=new FifoBuffer();
   }
  
  BridgeConnection.prototype.send = function(data) {
    sendBridgeMessage(this.id,data);
  }
    
  BridgeConnection.prototype.close = function (closeMessageContent) {
		sendBridgeMessage(this.id,closeMessageContent,opcode_close_notify);	  	
	} 
	 
  function startNewConnection (id,content) {
		console.log("accepting new connection with id #"+id);
    if (connections[id]) { console.log ("starting connection with already existing id, bailing"); return}
    
    var connection = new BridgeConnection(id);
    connections[id] = connection;    
    
    API.signal("connect",connection);
    //if (API.onconnect) API.onconnect(connection,content);
  }
  
  function closeConnection (id,content) {
    var connection=connections[id];
    if (!connection) { console.log ("trying to close a connection that isn't open, bailing"); return}
    delete connections[id];
    connection.signal("close",content);
  }
  
  function dispatchData(id,content) {
    var connection=connections[id];
    if (!connection) { console.log ("recieved something on a connection that isn't open, bailing"); return}
  
    if (connection.initialized) {
				//console.log("sending data to #"+id,connection);
        connection.signal("data",content);        
    } else {
        connection.buffer.add(content);
        var lineLen = connection.buffer.find(10);
        if (lineLen>0) {
            //console.log("lineLen:",lineLen);
            //console.log("head:"+connection.buffer.head,"    tail:"+connection.buffer.tail+ "   length:"+connection.buffer.length);
            var line = Utility.UTF8ArrToStr(connection.buffer.peek(lineLen));
            //console.log("comm line:",line);
            var ob = JSON.parse(line);
            connection.buffer.disposeBytes(lineLen+1);
            
            if (Object.has(ob,"protocol")) {
              connection.mode=ob;
              connection.initialized=true;
              API.signal("protocol_"+ob.protocol,connection);
            }
        }
    }
  }
  
  function handleMessage(e) {
    var reader = new FileReader(); 
    reader.addEventListener('loadend', function() {
        var bytes=reader.result;
        //console.log(bytes);
        var data = new DataView(bytes);
        var ID = data.getUint32(0,true);
        var length = data.getUint32(8,true);
        var opcode = data.getUint8(4);
        var content = bytes.slice(16);
        if (content.byteLength != length) { console.log("packet of unexpected length (got content of byteLength "+content.byteLength+" header reports "+length+"), bailing"); return;}
        switch (opcode) {
        
            case 0: startNewConnection(ID,content);           
        break;        
        
            case 1: closeConnection(ID,content);            
        break;
        
            case 2: dispatchData(ID,content);
            //console.log("dispatching data to #"+ID); 
        break;
            case 99:             
             console.log("message from bridge ",Utility.UTF8ArrToStr(content));             
				break;
        }
        
    });
    reader.readAsArrayBuffer(e.data);
  }
  
  API.connect = function(url) {
    socket=new WebSocket(url,"bridge");
    socket.onmessage=handleMessage;
    socket.onopen=connectionOpened;
    socket.onclose=connectionClosed;
  }
  
  function reportData(data) {
    this.buffer+=Utility.UTF8ArrToStr(new Uint8Array(data));
    var lines=this.buffer.lines();
    if (this.buffer.last() !== "\n") {
        this.buffer=lines.pop();
    } else this.buffer="";
    lines.forEach(function (s) {
        console.log("got data of",s);
    });
    
    
  }
  
  function reportConnection(connection) {
     log("connect event fired");
  }
  
  API._init_ =function(callback) {
  
    CustomEvents.bindEventsToClass(BridgeConnection);
   
    sys.modules.bridge.on('connect',reportConnection);
    
    API.connect("wss://"+location.host+"/bridge");       

    callback();
    
  }
  
  return API;  
}());
