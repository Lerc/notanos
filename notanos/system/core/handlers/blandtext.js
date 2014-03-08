({
	name: "Bland text handler",
	mediaTypes : ["text/plain"],	
		
	actions: {
		"Open" : {
			description : "look at it (Duh)",
			act : function(name) {
              FileIO.getFileAsString(name,function(err,text) { 
                  if (!err) {
				      	var win=DivWin.createWindow(500,100,500,700,name);
				        win.clientArea.appendNew("textarea","fillparent").textContent=text;
                  }
				});
              }
			}
		}	
});

