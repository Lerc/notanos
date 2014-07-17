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
								var iframe = null;								
								if (parameters.singleInstance === true) {
									var iframes=document.querySelectorAll("iframe");
									for (i = 0; i<iframes.length; i++) {
										log("checking "+iframes[i].original_name+" to see if it is "+name);
										if (iframes[i].original_name===name) {
											iframe = iframes[i];
											break;
										}
									}
								} 
								if (iframe) {
									iframe.contentWindow.postMessage(execMessage,"*");
									
									DivWin.bringToFront(iframe.win);
									iframe.focus();
								} else {					
									var win=DivWin.createWindow(	{
											"left":left, "top":top, "width":width,"height":height, "clientWidth": clientWidth, "clientHeight":clientHeight, title:parameters.title
										});
									var frameOverlay=win.clientArea.appendNew("div","fillparent frameoverlay");
									iframe=win.clientArea.appendNew("iframe","fillparent");
									iframe.setAttribute("sandbox","allow-scripts allow-same-origin");
									iframe.src=name;
									iframe.win=win;
									iframe.original_name=name;
									iframe.onload=function() {
										if (!execMessage.parameters.action) execMessage.parameters.action={actionKind:"Launch"};
										log("sending a message to frame");
										var message = JSON.stringify(execMessage);
										log(message);
										iframe.focus();
										iframe.contentWindow.postMessage(execMessage,"*");
									}
								}
			}
		}	
	}
});

