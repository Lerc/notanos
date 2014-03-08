(function() {
	var API = new Module("hostControl");
    var host = null;
    var messageCounter = 7;
    
    var waitingCallbacks = {};
    
    var ready=false;
    API.isReady = function(){return ready===true}
    
    function handleHostData(content) {
        host.buffer.add(content);
        var lineLen=-1
        while ((lineLen = host.buffer.find(10)) >= 0) {
            var line = Utility.UTF8ArrToStr(host.buffer.peek(lineLen));
            var ob = JSON.parse(line);
            host.buffer.disposeBytes(lineLen+1);
            handleHostEvent(ob);
        }
    }
    
    function handleHostEvent(event) {
        if (event.responseId) {
          var rid=event.responseId;  
          if (waitingCallbacks[rid]) {
            var callback=waitingCallbacks[rid];
            delete waitingCallbacks[rid];
            var error = null;
            if (event.error) error = new Error(event.error);
            callback(error,event.result);
          }
        }
    }
    
    function reportConnection(connection) {
      console.log("the session manager protocol connected");
      host=connection;
    
      host.on("data",handleHostData);      
      
      sys.modules.hostAction.exec('echo -n ~/Notanos',function(err,result) {if (!err) sys.dir=result});
      sys.environment={}
      sys.modules.hostAction.exec("env", function(err,result) { 
            console.log(err,result);
            if (!err) { result.lines(function (line) {
                var e=line.indexOf("=");
                sys.environment[line.to(e)]=line.from(e+1);
            })}
            ready=true;
            API.signal("ready");
            });
      //now that we have a channel to the host, we can add features like writeFile to FileIO.
      sys.modules.hostAction.extendFileIO();
      
    }
    
    API.hostCall = function(callName,args,callback) {
        if (!host) {
            callback(new Error("Host not connected"));
        }
        var request = {"operation":"call","responseId":messageCounter++};
        waitingCallbacks[request.responseId]=callback;
        request.callName=callName;
        request.args=args;
        
        host.send(JSON.stringify(request)+"\n");
        
    }
    
    API._init_ =function(callback) {
      sys.modules.bridge.on('protocol_SessionManager',reportConnection);
      callback();
    }
    
  return API;
}());
