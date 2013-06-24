({
	name: "Directory Bundle handler",
	mediaTypes : ["directory/bundle"],	
		
	actions: {
		"Open" : {
			description : "Open With method specified by bundle.json",
			act : function(name,parameters) {
						var json=WebDav.getData(name+"/bundle.json");
						var bundle = JSON.parse(json);
						var exec=bundle.exec;
						var newParameters=exec.parameters||{};
						for (var i in parameters) {newParameters[i]=parameters[i]};
						if (!newParameters.title) newParameters.title=name;
						var fullName=name+"/"+exec.main;
						if (exec.main[0]=="/") fullName=exec.main;
						console.log("fullName:"+fullName);
						console.log("exec.main:"+exec.main);
						sys.modules.handlers.performAction(exec.action, fullName,newParameters,exec.contentType);
					}
			}
		}	
});

