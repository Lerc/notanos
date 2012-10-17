(function() {
  var MessageApi = {name:"messageapi" };
  log("installing message listener");
  addEventListener("message",receiveMessage,false);
  var messageHandlers = {};
  var messageFunctions = {};
  
  messageHandlers.functionCall = function (e) {
		function sendResponse(answer) {
			log("sending Response");
			var response = {"messageType" : "callResponse",
											"responseId" : e.data.responseId,
											"response" : answer}
			e.source.postMessage(response,e.origin);
		}

		var func = messageFunctions[e.data.callName];
		if (func) {
			log("calling "+e.data.callName);
			func(e.data.parameters,sendResponse);
		}
	}
	
  function receiveMessage(e) {
		var handler = messageHandlers[e.data.messageType];
		if (handler) {
			handler(e);
		}
		
	}
  
  messageFunctions.loadFile = function(parameters,callback) {
		WebDav.loadFile_async(parameters.fileName, callback);		
	}
	
	messageFunctions.saveFile = function(parameters,callback) {
		WebDav.saveFile_async(parameters.fileName,parameters.content,callback);
	}
	
	messageFunctions.openFileDialog = function(parameters,callback) {
		sys.modules.requesters.openFileDialog(parameters,callback);
  }
  return MessageApi;
}());
