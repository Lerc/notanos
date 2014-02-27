var ClientFrame = function () {
    var loc=window.parent.location;        
    var parentOrigin= loc.protocol+'//'+loc.hostname+(loc.port ? ':'+loc.port: '');
    var API = {}

    API.framePath=function() {
        var path=window.location.pathname;
        return path.substring(0,path.lastIndexOf("/"));
    }

    function is_empty(obj) {
        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key))    return false;
        }
        return true;
    }
   
    var messageHandlers = {};
    addEventListener("message",handleMessage,false);
    function handleMessage(e) {
      if (e.origin === parentOrigin) {
        var messageHandler= messageHandlers[e.data.messageType];
        if (messageHandler) {
           messageHandler(e.data);
        }
      }
    }

    
    messageHandlers.exec = function (message) {
      if (message.parameters.action) {
         if (API.onActionNotify) {
           API.onActionNotify(message.parameters.action);
         }
      }
    }

    var pendingResponses = {};
    var responseIdCounter = 145656;
    var waitingForResponse = false;    
    var timeoutDuration = 50000;
    
    messageHandlers.callResponse = function(message) {
      var handler = pendingResponses[message.responseId];
      if (handler) {
         delete pendingResponses[message.responseId];
         handler.callback(message.err,message.response);
      }
    }

    function setResponseHandler (message,responseHandler) {
      var rId = responseIdCounter++;
      message.responseId=rId;
      pendingResponses[rId] = {"callback":responseHandler, "timeStamp": new Date().getTime(),"message":message};
      return rId;
    }
    
    function queryKnowledgeOfMessage(message, callback) {
       message.messageType="yoohoo";
       setResponseHandler(message,callback);     
    }
    
    API.postFunctionCall = function(callName,parameters,responseHandler) {
       var message = {"messageType" : "functionCall",
                       "callName":callName,
                       "parameters":parameters};
                       
       if (responseHandler) {
          setResponseHandler(message,responseHandler);
       }
       window.parent.postMessage(message,parentOrigin);        
    }

    API.loadFile=function(filename,callback) {
       API.postFunctionCall("loadFile",{"filename":filename},callback);
    }

    API.saveFile=function(filename,content,callback) {
       API.postFunctionCall("saveFile",{"filename":filename, "content":content},callback);
    }

    API.openFileDialog=function(initialFilename,callback) {
       API.postFunctionCall("openFileDialog",{"initialFilename":initialFilename},callback);
    }

    API.saveFileDialog=function(initialFilename,callback) {
       API.postFunctionCall("saveFileDialog",{"initialFilename":initialFilename},callback);
    }
    
    API.setWindowTitle=function(text,callback) {
       API.postFunctionCall("setWindowTitle",{"text":text},callback);
    }
    
    API.exit=function() {
        API.postFunctionCall("exit");
    }
    
    return API; 
} ();
