({
	name: "Bland text handler",
	mediaTypes : ["text/plain"],	
		
	actions: {
		"Open" : {
			description : "look at it (Duh)",
			act : function(name) {
								var text=WebDav.getData(name);
				        var win=DivWin.createWindow(500,100,500,700,name);
				        win.clientArea.appendNew("textarea","fillparent").textContent=text;
							}
			}
		}	
});

