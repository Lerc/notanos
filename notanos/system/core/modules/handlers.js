(function() {
  var API = new Module("handlers");
  var installedHandlers = {};
  var defaultAssociations = {};
  var userAssociations = {};
   
  
  function makeAssociationHandler (forMediaTypes, associatedItem, actionKind, targetActionKind) {
	  if (!actionKind) actionKind="Open";
	  if (!targetActionKind) targetActionKind="Open";
      
	  var result = {"name": actionKind+" with "+associatedItem,"mediaTypes":forMediaTypes};
	   
		result.actions= { };
		result.actions[actionKind] = { "description" : actionKind };
		result.actions[actionKind].act = (function (name) {
			var parameters = {action : {"actionKind":targetActionKind,  "filename":name}};
			API.performAction(targetActionKind,associatedItem,parameters);
		});
		return result;
  }

	function installHandler (handler) {
        //console.log("install handler",handler);
		installedHandlers[handler.name] = handler; 
		if (!handler.mediaTypes) {console.log("no media types!"); return};
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
	
  API.installHandler = function (path,callback) {
        //console.log("getting handler"+path);
        FileIO.getFileAsString(path, function(err,result) {
            var handlerText=result;
            //console.log("evaluating "+path);
            var handler = eval(handlerText);
            //console.log("evaluaton result "+handler,handler);
		    installHandler(handler);
            callback();
        });		
	}
     
  API.performAction = function (actionType,path,parameters,contentType) {
		log(actionType+": "+path + " as contentType ("+contentType+")");
        if (!contentType) {
            FileIO.getFileInfo(path, function(err,info) {
              if (!err) {
                API.performAction(actionType,path,parameters,info.contentType);
              }
            });
        } else {
		    var mediaActions = defaultAssociations[contentType];
		    if (!mediaActions) return; ///make an exception
		    var relevantHandler=mediaActions[actionType];  
		    if (!parameters) parameters={};
            if (!parameters.actionContext) parameters.actionContext=path;            
            if (!parameters.actionContextDir) parameters.actionContextDir=Path.dirname(path);
            console.log("performing "+actionType+"with ",relevantHandler);
		    relevantHandler.actions[actionType].act(path,parameters);
        };
	}
	
	API.open = function (path,parameters,contentType) {
		API.performAction("Open",path,parameters,contentType);
	}
	
    API._init_ = function(callback) {
        FileIO.getDirectoryListing(sys.dir+"/system/core/handlers/",
            function (err,result) {
                if (err) console.log("Initialisation of handlers failed",err);
                if (result) {
                    var filenames=result.map(function(i) {return i.path+"/"+i.filename});
                    filenames.each(log);
                    async.forEachSeries(filenames,API.installHandler,function(){log("Handlers installed");callback()});
                }
            }
        );
     	installHandler(makeAssociationHandler(['application/javascript','text/plain','text/html','text/css','application/json'],sys.dir+'/apps/CodeMirror'));
        
        FileIO.registerFileType("whio",'application/whio');
     	installHandler(makeAssociationHandler(['application/whio'],sys.dir+'/apps/Whio'));
     	installHandler(makeAssociationHandler(['application/whio'],sys.dir+'/apps/CodeMirror',"Hack"));

    /* var handlerDir = WebDav.getDirectoryListing("/system/core/handlers/");
	    for (var i=0; i<handlerDir.length;i++) {
				Handlers.installHandler(handlerDir[i].name);
    */
	}	

    
    
    
   return API;
   
   
}());
