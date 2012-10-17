({
	name: "Directory Bundle handler",
	mediaTypes : ["directory/bundle"],	
		
	actions: {
		"Open" : {
			description : "Open With method specified by bundle.json",
			act : function(name,parameters) {
						var json=WebDav.getData(name+"bundle.json");
						var bundle = JSON.parse(json);
						var exec=bundle.exec;
						var newParameters=exec.parameters;
						for (var i in parameters) {newParameters[i]=parameters[i]};
						if (!newParameters.title) newParameters.title=name;
						sys.modules.handlers.performAction(exec.action, name+exec.main,newParameters,exec.contentType);
					}
			}
		}	
});

