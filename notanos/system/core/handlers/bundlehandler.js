({
	name: "Directory Bundle handler",
	mediaTypes : ["directory/bundle"],	
		
	actions: {
		"Open" : {
			description : "Open With method specified by bundle.json",
			act : function(name,parameters) {
                FileIO.getFileAsString(name+"/bundle.json", function(err,json) {
                        console.log("Parsing JSON of ",name);
						var bundle = JSON.parse(json);
                        console.log("bundle is",bundle);
						var exec=bundle.exec;
						var newParameters=exec.parameters||{};
						for (var i in parameters) {newParameters[i]=parameters[i]};
						if (!newParameters.title) newParameters.title=name;
                        var fullName=name+"/"+exec.main;
						if (exec.contentType==="application/x-executable") {
                            //special case for $PATH beasties
                            fullName=exec.main;
                        }
                        //hacky patch
						if (exec.main[0]=="/") fullName=exec.main;
                        if (exec.main[0]=="~") fullName=exec.main;                        
						console.log("fullName:"+fullName);
						console.log("exec.main:"+exec.main);
						sys.modules.handlers.performAction(exec.action, fullName,newParameters,exec.contentType);
					});
                }
			},
        "Hack" : {
			description : "look inside the bundle",
			act : function(name,parameters) {
                sys.modules.handlers.performAction("Open",name,{},"directory");
            }
		}
    }        
});

