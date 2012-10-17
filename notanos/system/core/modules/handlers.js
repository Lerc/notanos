(function() {
  var Handlers = {name:"handlers" };
  var installedHandlers = {};
  var defaultAssociations = {};
  var userAssociations = {};
   
  
  function makeAssociationHandler (forMediaTypes, associatedItem, actionKind) {
	  if (!actionKind) actionKind="Open";
	  var result = {"name": actionKind+" with "+associatedItem,"mediaTypes":forMediaTypes};
	   
		result.actions= { };
		result.actions[actionKind] = { "description" : actionKind };
		result.actions[actionKind].act = (function (name) {
			var parameters = {action : {"actionKind":actionKind,  "fileName":name}};
			Handlers.performAction(actionKind,associatedItem,parameters);
		});
		return result;
  }

	function installHandler (handler) {
		installedHandlers[handler.name] = handler; 
		
		for (var i=0; i<handler.mediaTypes.length;i++)  {
			 var mediaType = handler.mediaTypes[i];
			 if (!defaultAssociations.hasOwnProperty(mediaType)) {
				 defaultAssociations[mediaType]={};
			 }
			 for (var action in handler.actions) {
					defaultAssociations[mediaType][action]=handler;
				}
		}		
	}	
	
  Handlers.installHandler = function (path) {
		var handlerText=WebDav.getData(path);
		var handler = eval(handlerText);
		installHandler(handler);
	}
     
  Handlers.performAction = function (actionType,path,parameters,contentType) {
		log(actionType+": "+path);
		var info = WebDav.getInfo(path);
		if (!contentType) contentType= info.contentType;
		var mediaActions = defaultAssociations[contentType];
		if (!mediaActions) return; ///make an exception
		var relevantHandler=mediaActions[actionType];  
		if (!parameters) parameters={};
		relevantHandler.actions[actionType].act(path,parameters);
	}
	
	Handlers.open = function (path,parameters,contentType) {
		Handlers.performAction("Open",path,parameters,contentType);
	}
	
   var handlerDir = WebDav.getDirectoryListing("/system/core/handlers/");
	 for (var i=0; i<handlerDir.length;i++) {
				Handlers.installHandler(handlerDir[i].name);
	 }	

	 installHandler(makeAssociationHandler(['application/javascript','text/plain','text/html','text/css'],'/apps/CodeMirror/'));
   return Handlers;
   
   
}());
