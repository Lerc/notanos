(function() {
  var API = new Module("requesters");

  function fileDialog(filename,options,responseCallback) {  
        var currentDirectory="/";
        var title={"open":"Open File","save":"Save File"}[options.dialogKind];
		var win = DivWin.createWindow({"width":580, "height":400, "centered":true,"title":title});
		var base=sys.modules.fileItem.createItemContainer(win.clientArea,"list");
   		function requester_return(result) {
			log("dialog is returning "+result);
			responseCallback(null,result);			
			win.onClose=null;
			DivWin.closeWindow(win)
		}

		var fileView=base.querySelector(".fileview");
		base.addClass("requester");
		base.defaultHandler=defaultHandler;
		var locationbar=base.appendNew("div","locationbar");
		var pathBar=base.appendNew("ol","pathbar");
		var filename=base.appendNew("div","filename").appendNew("input","userinput");
		filename.type="text";
		var filetype=base.appendNew("div","filetype button").appendNew("select");
        var openButton,savebutton;
        var cancelButton=base.appendNew("div","cancel button"); 
        var backButton=base.appendNew("div","back button"); 
        var upButton=base.appendNew("div","up button"); 
        
        if (options.dialogKind==="open"){
    		//base.addClass("fileopen");
            openButton=base.appendNew("div","open button");
            openButton.addEventListener("click",openButtonClick);

        }
        if (options.dialogKind==="save") {
            //base.addClass("filesave");
            saveButton=base.appendNew("div","save button");
            saveButton.addEventListener("click",saveButtonClick);
        }
        
		cancelButton.addEventListener("click",function() {requester_return(null)});
		win.onClose = function () {responseCallback("cancelled")};
	
    function openButtonClick() {        
        requester_return(currentDirectory+filename.value)
    }
    
    function saveButtonClick() {
        var savename = currentDirectory+filename.value;
        FileIO.exists(savename,function(itdoes) {
            var saveit=true;
            if (itdoes & (options.overwriteQuery===true)) {
                saveit=window.confirm("File exists,  OK to overWrite?");
            }
            if (saveit) requester_return(savename)
        });
    }
    function defaultHandler(e) {
        var p=e.currentTarget.parentNode.parentNode; 
        if (e.currentTarget.dataset["contentclass"]==="directory") {
			if (p.setContainerViewpoint) {
				log("doubleClick "+ e.currentTarget.dataset["filename"]);
				p.setContainerViewpoint(e.currentTarget.dataset["filename"]);
			}
		} else {
            console.log("dialog says to open ",e.currentTarget.dataset["filename"]);
            requester_return(e.currentTarget.dataset["filename"])
        }
    }
    
    function setFileViewPath(path) {
			base.setContainerViewpoint(path);

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
		
    setCurrentDirectory(sys.dir);
  }

  API.openFileDialog = function(filename,options,responseCallback) { 
    if (!options) options={};
    options.dialogKind="open";
    fileDialog(filename,options,responseCallback);
  }  
  
  API.saveFileDialog = function(filename,options,responseCallback) {
    if (!options) options={};
    options.dialogKind="save";
    options.overwriteQuery=true;
    fileDialog(filename,options,responseCallback);      
  }
  
  return API;
}());
