({
	name: "Executable handler",
	mediaTypes : ["application/x-executable"],	
		
	actions: {
		"Open" : {
			description : "Run a host executable",
			act : function(name,parameters) {
              var args=Object.clone(parameters.commandLineArgs);
              if (args) {
                if (!Object.isArray(args)) {
                  if (Object.isString(args)) {
                    parameters=paramaters.split(/\w*/);
                  } else return //not an array or string,  I'm confused now.
                }
                var map={
                    "%k" : parameters.actionContextDir,
                    "%f" : parameters.actionContext
                    };
                args=args.map(function(arg){return arg.replace(/%[k|f]/gi,function(match){return map[match]});})

              }
              console.log("executable name: ",name)
              console.log("executable args: ",args)
              sys.modules.hostAction.spawn(name,args);
              }
			}
		}	
});

