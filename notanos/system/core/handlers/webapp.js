({
	name: "webapp",
	mediaTypes : ["application/webapp"],	
		
	actions: {
		"Open" : {
			description : "Run program",
			act : function(name,parameters) {
								var left=parameters.windowLeft;
								var top=parameters.windowTop;

								var width=parameters.windowWidth;
								var height=parameters.windowHeight;
								var clientWidth=parameters.windowClientWidth;
								var clientHeight=parameters.windowClientHeight;
								
								var execMessage = {"messageType" :"exec", "parameters":parameters}
								var frame = null;								
								if (parameters.singleInstance === true) {
									for (i = 0; i<frames.length; i++) {
										log("checking "+frames[i].frameElement.original_name+" to see if it is "+name);
										if (frames[i].frameElement.original_name===name) {
											frame = frames[i];
											break;
										}
									}
								} 
								if (frame) {
									frame.postMessage(execMessage,"*");
									
									DivWin.bringToFront(frame.frameElement.win);
									frame.frameElement.focus();
								} else {					
									var win=DivWin.createWindow(	{
												"left":left, "top":top, "width":width,"height":height, "clientWidth": clientWidth, "clientHeight":clientHeight, title:parameters.title
												});
									var frameOverlay=win.clientArea.appendNew("div","fillparent frameoverlay");
									frame=win.clientArea.appendNew("iframe","fillparent");
									frame.setAttribute("sandbox","allow-scripts allow-same-origin");
									frame.src=name;
									frame.win=win;
									frame.original_name=name;
									frame.onload=function() {
										log("sending a message to frame");
										var message = JSON.stringify(execMessage);
										log(message);
										frame.focus();
										frame.contentWindow.postMessage(execMessage,"*");
									}
								}
			}
		}	
	}
});

