var ClientFrame = function () {
    var loc=window.parent.location;        
    var parentOrigin= loc.protocol+'//'+loc.hostname+(loc.port ? ':'+loc.port: '');
    var API = {}
    

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
         handler.callback(message.response);
      }
    }

    function handleTimeout() {       
       var now = new Date().getTime();
       var expired = now-timeoutDuration;
       for (p in pendingResponses) {
          var waitingItem = pendingResponses[p];
          if (waitingItem.timeStamp < expired) {
             delete pendingResponses[p];
             waitingItem.callback(); //failure
          }
       }
       if (is_empty(pendingResponses)) {
          waitingForResponse = false;
       } else {
          waitForResponse();
       }
    }
    
    function waitForResponse() {
        setTimeout(handleTimeout,timeoutDuration);
        waitingForResponse=true;
    }
    
    function registerResponseHandler (responseHandler) {
      var rID = responseIdCounter++;
      pendingResponses[rID] = {"callback":responseHandler, "timeStamp": new Date().getTime()};
      if (waitingForResponse===false) {
            waitForResponse();
      }
      return rID;
    }
    
    API.postFunctionCall = function(callName,parameters,responseHandler) {
       var message = {"messageType" : "functionCall",
                       "callName":callName,
                       "parameters":parameters};
       if (responseHandler) {
          message.responseId=registerResponseHandler(responseHandler);
       }
       window.parent.postMessage(message,parentOrigin);        
    }

    API.loadFile=function(fileName,callback) {
       API.postFunctionCall("loadFile",{"fileName":fileName},callback);
    }

    API.saveFile=function(fileName,content,callback) {
       API.postFunctionCall("saveFile",{"fileName":fileName, "content":content},callback);
    }

    API.openFileDialog=function(initialFileName,callback) {
       API.postFunctionCall("openFileDialog",{"initialFileName":initialFileName},callback);
    }

    API.setWindowTitle=function(text,callback) {
       API.postFunctionCall("setWindowTitle",{"text":text},callback);
    }

    return API; 
} ();
