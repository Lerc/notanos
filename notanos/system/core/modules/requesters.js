/*global Module sys log FileIO DivWin */

(function() {
	var API = new Module("requesters");

	function fileDialog(filename,options,responseCallback) {
		var currentDirectory="/";
		var title={"open":"Open File","save":"Save File"}[options.dialogKind];
		var win = DivWin.createWindow({"width":580, "height":400, "centered":true,"title":title});
		var fileItemView=sys.modules.fileItem.createItemContainer(win.clientArea,"list");
		var dialog = {"window": win, "fileItemView" : fileItemView};

		function requester_return(result) {
			log("dialog is returning "+result);
			responseCallback(null,result);
			win.onClose=null;
			DivWin.closeWindow(win);
		}
		fileItemView.on("viewchanged",setPathDisplay);
		var base = fileItemView.element;
		//var fileView=base.querySelector(".fileview");
		base.addClass("requester");
		base.defaultHandler=defaultHandler;
		dialog.locationbar=base.appendNew("div","locationbar");
		dialog.pathBar=base.appendNew("ol","pathbar");
		dialog.filename=base.appendNew("div","filename").appendNew("input","userinput");
		dialog.filename.type="text";
		dialog.filetype=base.appendNew("div","filetype button").appendNew("select");
		dialog.cancelButton=base.appendNew("div","cancel button");
		dialog.backButton=base.appendNew("div","back button");
		dialog.upButton=base.appendNew("div","up button");


		if (options.dialogKind==="open"){
    //base.addClass("fileopen");
			dialog.openButton=base.appendNew("div","open button");
			dialog.openButton.addEventListener("click",openButtonClick);
		}

		if (options.dialogKind==="save") {
			//base.addClass("filesave");
			dialog.saveButton=base.appendNew("div","save button");
			dialog.saveButton.addEventListener("click",saveButtonClick);
		}

		dialog.cancelButton.addEventListener("click",function() {requester_return(null);});
		win.onClose = function () {responseCallback("cancelled");};

		fileItemView.on("select", function(itemData) {
			console.log(itemData);
			if (itemData.contentClass !== "directory") {
				dialog.filename.value=itemData.displayName;
			}
		});
		function openButtonClick() {
			console.log("Open Button clicked ",currentDirectory,dialog.filename.value);
			requester_return(currentDirectory+"/"+dialog.filename.value);
		}

		function saveButtonClick() {
			var savename = currentDirectory+dialog.filename.value;
			FileIO.exists(savename,function(itdoes) {
				var saveit=true;
				if (itdoes & (options.overwriteQuery===true)) {
					saveit=window.confirm("File exists,  OK to overWrite?");
				}
				if (saveit) requester_return(savename);
			});
		}
		function defaultHandler(e) {
			var p=e.currentTarget.parentNode.parentNode;
			if (e.currentTarget.dataset["contentclass"]==="directory") {
				if (p.itemView instanceof sys.modules.fileItem.FileItemView)  {
					log("doubleClick "+ e.currentTarget.dataset["filename"]);
					p.itemView.setViewPoint(e.currentTarget.dataset["filename"]);
				}
			} else {
				console.log("dialog says to open ",e.currentTarget.dataset["filename"]);
				requester_return(e.currentTarget.dataset["filename"]);
			}
		}

		function setPathDisplay(path) {
			path=Path.normalize(path);
			currentDirectory=path;
			function onPathButtonClick(e) {
				setCurrentDirectory(e.currentTarget.path);
			}
			dialog.pathBar.clear();
			var parts = path.split("/");
			var pathSoFar="";
			for (let i=0; i<parts.length;i++) {
				var name=parts[i];
				pathSoFar+=name+"/";
				var part=dialog.pathBar.appendNew("li","button");
				part.innerHTML=(name=="")?"\xA0":name;
				part.path=pathSoFar;
				part.onclick=onPathButtonClick;
			}
		}

		function setCurrentDirectory(newPath) {
			if (!newPath.endsWith("/")) newPath+="/";
			fileItemView.setViewPoint(newPath);
		}

		setCurrentDirectory(sys.dir);
		return dialog;
	}

	API.openFileDialog = function(filename,options,responseCallback) {
		if (!options) options={};
		options.dialogKind="open";
		fileDialog(filename,options,responseCallback);
	};

	API.saveFileDialog = function(filename,options,responseCallback) {
		if (!options) options={};
		options.dialogKind="save";
		options.overwriteQuery=true;
		fileDialog(filename,options,responseCallback);
	};

	return API;
}());
