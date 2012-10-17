(function() {
  var Api = {name:"requesters" };
  
  Api.openFileDialog = function(parameters,responseCallback) { 
    var currentDirectory="/";
		var win = DivWin.createWindow({width:580, height:400, centered:true,title:"Open File"});
		function requester_return(result) {
			log("open dialog is returning "+result);
			responseCallback(result);			
			win.onClose=null;
			DivWin.closeWindow(win)
		}
		var base=win.clientArea;
		base.addClass("requester");
		base.addClass("fileopen");
		var locationbar=base.appendNew("div","locationbar");
		var fileView=base.appendNew("ul","fileview list");
		var pathBar=base.appendNew("ol","pathbar");
		var fileName=base.appendNew("div","filename").appendNew("input");
		fileName.type="text";
		var filetype=base.appendNew("div","filetype button").appendNew("select");
    var openButton=base.appendNew("div","open button");
    var cancelButton=base.appendNew("div","cancel button"); 
    var backButton=base.appendNew("div","back button"); 
    var upButton=base.appendNew("div","up button"); 
		openButton.addEventListener("click",function() {requester_return(currentDirectory+fileName.value)});
		cancelButton.addEventListener("click",function() {requester_return(null)});
		win.onClose = function () {responseCallback(null)};
		
    function setFileViewPath(path) {
			var dir=WebDav.getDirectoryListing(path);
			fileView.clear();

      for (var i = 0; i<dir.length;i++) {
				var li = fileView.appendNew("li");
				var file = dir[i];
				var itemData = {
					"image":" ",
					"fileName" :file.name,
					"displayName" :file.displayName,
					"fileSize" :file.contentLength,
					"contentType" :file.contentType
				}
				li.innerHTML=Utility.spanify(itemData);
				if (file.container) li.dataset["filesize"]=file.contentLength;
				li.dataset["filename"]=file.name;
				li.dataset["displayname"]=file.displayName;
				li.dataset["contenttype"]=file.contentType;
				li.dataset["contentclass"]=file.contentType.split("/")[0];
				li.dataset["contentsubtype"]=file.contentType.split("/")[1];
				li.addEventListener("dblclick",doubleClick,true);
				li.addEventListener("click",click,false);
				li.setAttribute("draggable","true");
			}	

			function click(e) {
				if (e.currentTarget.dataset["contentclass"] != "directory") {
					fileName.value=e.currentTarget.dataset["filename"].split("/").pop(); 
				}
			}
			
			function doubleClick(e) {
				if (e.currentTarget.dataset["contentclass"] == "directory") {
					setCurrentDirectory(e.currentTarget.dataset["filename"]);
				} else {
					requester_return(e.currentTarget.dataset["filename"]);
				}
			}	
		}
		
    function setCurrentDirectory(newPath) {
			if (!newPath.endsWith("/")) newPath+="/";
			currentDirectory=newPath;
			
			function onPathButtonClick(e) {
				setCurrentDirectory(e.currentTarget.path);
			}						 
			pathBar.clear();			
			var parts = newPath.split("/");
			parts.pop();
			var pathSoFar="";			
			for (i=0; i<parts.length;i++) {
				var name=parts[i];
				pathSoFar+=name+"/";
				var part=pathBar.appendNew("li","button");
				part.innerHTML=(name=="")?"\xA0":name;
				part.path=pathSoFar;	
				part.onclick=onPathButtonClick;			
			}
			setFileViewPath(currentDirectory);
		}
		
    setCurrentDirectory ("/system/core/modules/");
  }
  return Api;
}());
