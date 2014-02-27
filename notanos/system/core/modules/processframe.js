(function() {
	var API = new Module("processFrame");
    
    function reportConnection(connection) {
        var win=DivWin.createWindow(700,200,640,480,"A process");
        win.connection=connection;
		var frameOverlay=win.clientArea.appendNew("div","fillparent frameoverlay");
		frame=win.clientArea.appendNew("iframe","fillparent");
		frame.setAttribute("sandbox","allow-scripts allow-same-origin");
        frame.src="data:text/html;charset=utf-8;base64,"+connection.mode.frameContent;
        frame.win=win;
        connection.on("data",handleData);
        
        var data = connection.buffer.peek();
        //console.log(data);
        handleData(data);
        connection.buffer.clear();
        
        function handleData(content) {
            //console.log("data event happened on process frame",content);
            frame.contentWindow.postMessage({"messageType" : "hostmessage", "data" : content},"*");
            
        }   

        connection.on("close",function(){
            DivWin.closeWindow(win)
        });
    }
    
    API._init_ =function(callback) {
      sys.modules.bridge.on('protocol_processframe',reportConnection);
      callback();
    }
  return API;
}());
