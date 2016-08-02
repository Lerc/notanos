(function() {
	var API = new Module("iFrameWindow");
	
	function handleDragOver(e) {
		/*
		var win=DivWin.getElementDivWin(e.currentTarget);
		
		console.log("dragover",e.dataTransfer.getData("notanos/fileitem"));

		if (e.dataTransfer.types[0]=="notanos/object") {
			if (e.preventDefault) {	e.preventDefault(); }
			if (e.stopPropagation) { e.stopPropagation(); }
		}
		*/
	}
	
	function makeFrameWindow(parameters) {
		
		var defaults = { 
			clientWidth: 640,
			clientHeight:480, 
			left: Math.floor(Math.random()*400),
			top: Math.floor(Math.random()*200),
			title : "Untitled Window"
		}
		parameters = Object.merge(defaults,parameters);
		var win=DivWin.createWindow(parameters,"A process");
		var frameOverlay=win.clientArea.appendNew("div","fillparent frameoverlay");
		var frame=win.clientArea.appendNew("iframe","fillparent");
		win.on("focus", function() {if (frame.contentWindow) frame.contentWindow.focus()});
		win.on("blur",function() {
                      console.log("blur", win);
                      if (frame.contentWindow) frame.contentWindow.blur();
		    });
		
		win.element.addEventListener("dragover",handleDragOver);
		//win.on("dragover",handleDragOver);
		
		return {win : win, frame :frame};
		
	}
	
	API.makeFrameWindow=makeFrameWindow;
	return API;
}());
