({
	name: "Dumb Directory viewer",
	mediaTypes : ["directory"],	
		
	actions: {
		"Open" : {
			description : "look at it (Duh)",
			act : function(name) {
								//var dir=WebDav.getDirectoryListing(name);
				        var win=DivWin.createWindow({width:600,height:300,title:name=="/"?"Root Folder":name});
				        var container = sys.modules.fileItem.createItemContainer(win.clientArea);
				        container.setContainerViewpoint(name);				        							
						win.on("focus",function() {
                          container.updateContainerView();
                        });
                }
			}
		}	
});

