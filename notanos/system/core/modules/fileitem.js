/*global Module sys log FileIO CustomEvents Utility*/
(function() {
	var API = new Module("fileItem");
	//log("fileItemModule");

	var contextMenuActions = {};

	function FileItemView(element = document.createElement("div"), viewMode="icons") {
		this.element = element;
		element.itemView= this;
		this.singleClickOpen=false;
		element.addClass("itemcontainer");
		element.appendNew("ul","fileview "+viewMode);
		element.addEventListener("dragover",handleDragOver,false);
		element.addEventListener("dragleave",handleDragLeave,false);
		element.addEventListener("drop",handleDragDrop,false);
	}

	CustomEvents.bindEventsToClass(FileItemView);
	API.FileItemView=FileItemView;

	FileItemView.prototype.updateView = function() {
		let element=this.element;
		var name=element.dataset["fullname"];

		var list = element.querySelector("ul.fileview");

		var children=Array.prototype.slice.call(list.children);
		//var currentFiles=children.map(function(child) {return child.dataset["filename"]});

		function compareFileItems (fileA,fileB){
			function fileSignificance(file) {
				switch (file.contentType) {
					case "directory/bundle":  return("0_");
					case "directory": return("1_");
				}
				return ("9_");
			}
			var a = fileSignificance(fileA)+fileA.filename;
			var b = fileSignificance(fileB)+fileB.filename;
			return a.localeCompare(b);
		}

		FileIO.getDirectoryListing(name, function (err,dir) {
			dir.sort(compareFileItems);
			dir.remove(function(f){return f.filename[0]==='.';});
			dir.each(function(file) {file.fullName=file.path+"/"+file.filename;});
			dir.each(function(file){
				var c=children.findIndex(function(i){return i.fileInfo.fullName===file.fullName;});
				if (c >= 0) {
					//it's already there.
					children.removeAt(c);
				} else {
					list.appendChild(sys.modules.fileItem.createItem(file));
				}
			});
			children.each(function(n){n.parentNode.removeChild(n);});
		});

	};

	FileItemView.prototype.setViewPoint = function (filename) {
		var element=this.element;

		name=FileIO.normalizePath(filename);
		if (name!==filename) console.log("normalised ",filename," to ",name);
		FileIO.stat(filename,function(err,result) {if (!err) element.stat=result;});

		this.signal("viewchanged",filename);
		element.dataset["fullname"]=name;
		element.dataset["filename"]=name=="/"?"":name;
		var list = element.querySelector("ul.fileview");
		if (!list) list=element.appendNew("ul","fileview icons");
		list.innerHTML="";

		this.updateView();
	};

	FileItemView.prototype.getViewPoint = function () {
		return this.element.dataset["fullname"];
	};

	function notImplemented(action,filename) {
		log("action '"+action+"' not implemented.  filename="+filename);
	}

	function fileHandlerAction(action,filename) {
		sys.modules.handlers.performAction(action,filename);
	}

	contextMenuActions.symlink = notImplemented;
	contextMenuActions.rename = notImplemented;
	contextMenuActions.clone = notImplemented;
	contextMenuActions.delete = notImplemented;
	contextMenuActions.cut = notImplemented;
	contextMenuActions.copy = notImplemented;
	contextMenuActions.paste = notImplemented;

	contextMenuActions.Hack = fileHandlerAction;
	contextMenuActions.Open = fileHandlerAction;
	contextMenuActions.Edit = fileHandlerAction;
	contextMenuActions.View = fileHandlerAction;

	function contextMenu(item) {
		let subFields=sys.modules.contextMenus.makeDefaultSubFields();
		function menuClick(err,result) {
			if (result) {
				var menuAction=result;
				var filename= item.dataset["filename"];
				log("menuClick on "+ filename+": "+menuAction);
				if (Object.has(contextMenuActions,menuAction)) {
					var actionFunction=contextMenuActions[menuAction];
					actionFunction(menuAction,filename);
				}/*
				if (menuAction === "hack") {
					sys.modules.handlers.performAction("Hack",item.dataset["filename"]);
				}
				if (menuAction === "open") {
					sys.modules.handlers.performAction("Open",item.dataset["filename"]);
				}*/
			}
		}
		sys.modules.contextMenus.attachArcMenu(item,subFields,menuClick);
	}

	function handleContextMenu(e) {
		contextMenu(e.currentTarget);
		e.preventDefault();
	}

	function select(e){
		if (e.button==0) {
			var p=e.currentTarget.parentNode.parentNode; // <li> -> <ul> -> wrapper div;
			var currentSelection = Array.prototype.slice.call(p.querySelectorAll("li.selected"));
			currentSelection.each(function(i){i.removeClass("selected");});
			e.currentTarget.addClass("selected");
			console.log("item selected", p.itemView);
			if (p.itemView instanceof FileItemView)  {
				p.itemView.signal("select",getFileItemData(e.currentTarget));
			}

		}
	}

	function open(e) {
		var p=e.currentTarget.parentNode.parentNode;
		if (Object.isFunction(p.defaultHandler)) {
			console.log("default handler triggered");
			p.defaultHandler(e);
		} else {
			sys.modules.handlers.open(e.currentTarget.dataset["filename"]);
		}
	}

	function handleClick(e) {
		var p=e.currentTarget.parentNode.parentNode; // <li> -> <ul> -> wrapper div;
		if (p.singleClickTrigger) {
			open(e);
		} else {
			select(e);
		}
	}

	function doubleClick(e) {
		open(e);
	}
	function getFileItemData(element) {
		var result = {
			filename : element.dataset["filename"],
			contentClass : element.dataset["contentclass"],
			contentType : element.dataset["contenttype"],
			contentSubType : element.dataset["contentsubtype"],
			displayName : element.dataset["displayname"]
		};

		return result;
	}
	function handleDragStart(e) {
		document.body.addClass("DragOperationHappening");
		var data = getFileItemData(e.currentTarget);

		e.currentTarget.classList.add("dragorigin");
		window.dragData=data;
		e.dataTransfer.effectAllowed="all";
		e.dataTransfer.setData("notanos/object","not here: in window.dragData");
		e.dataTransfer.setData("notanos/fileitem",JSON.stringify(data));
	}

	function handleDragEnd(e) {
		document.body.removeClass("DragOperationHappening");
		e.currentTarget.classList.remove("dragorigin");
	}

	function handleDragOver(e) {
		if (e.preventDefault) {	e.preventDefault(); }
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		if (e.dataTransfer.types[0]=="notanos/object") {
			var data=window.dragData;
			var path=e.currentTarget.dataset["filename"];
			var destinationPath = path+"/"+data.filename.split("/").pop();
			if (!FileIO.arePathsEquivalent(data.filename,destinationPath)) {
				e.dataTransfer.dropEffect = 'move';
				e.currentTarget.dataset["dropquery"] = "permitted";
				e.currentTarget.dataset["dropeffect"] = "move";
			}
		}
	}

	function handleDragLeave(e) {
		delete e.currentTarget.dataset["dropquery"];
		delete e.currentTarget.dataset["dropeffect"];
	}

	function handleDragDrop(e) {
		if (e.dataTransfer.types[0]=="notanos/object") {
			var data=window.dragData;
			var path=e.currentTarget.dataset["filename"];
			var destinationPath = path+"/"+data.filename.split("/").pop();
			if ( data.filename !== destinationPath) {
				console.log("renaming "+data.filename+" to "+destinationPath);
				FileIO.rename(data.filename,destinationPath);
			}
		}
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		delete e.currentTarget.dataset["dropquery"];
		delete e.currentTarget.dataset["dropeffect"];
		return false;
	}


	API.createItemContainer = function (element,viewMode) {
		return new FileItemView(element,viewMode);
	};

	API.createItem = function (file) {
        //console.log("createItem",file);
		var li=document.createElement("li");
		var contentParts=file.contentType.split("/");
		var itemData = {
			"image":" ",
			"filename" :  file.fullName ,//(file.path+"/"+file.filename),
			"displayName" :file.filename,
			"fileSize" : file.size,
			"contentType" :file.contentType
		};
		var fullName=file.path+"/"+file.filename;
		li.fileInfo=file;
		li.innerHTML=Utility.spanify(itemData);
		if (!file.container) li.dataset["filesize"]=file.fileSize;
		li.dataset["filename"]=fullName;
		li.dataset["displayname"]=file.filename;
		li.dataset["contenttype"]=file.contentType;
		li.dataset["contentclass"]=contentParts[0];
		li.dataset["contentsubtype"]=contentParts[1];
		//console.log("checking:" +file.contentType);
		if (file.contentType == "directory/bundle") {
			//console.log(file);
			FileIO.getFileAsString(fullName+"/bundle.json",function(err,bundleText) {
				if (err) return;
				var imageSpan = li.querySelector(".image");
							//console.log("bundleText",bundleText);
				var bundle = JSON.parse(bundleText);
				if (bundle) {
					if (bundle.icon) {
						imageSpan.dataset["bundleicon"]=fullName+"/"+bundle.icon;
						//if css3 attr() worked we wouldn't need a custom style
						imageSpan.style.backgroundImage="url("+escape(fullName)+"/"+bundle.icon+")";

					}
				}
			});
		}

		li.addEventListener("dblclick",doubleClick,true);
		li.addEventListener("click",handleClick,false);
		li.addEventListener("contextmenu",handleContextMenu,false);

		li.setAttribute("draggable","true");
		li.addEventListener("dragstart",handleDragStart,false);
		li.addEventListener("dragend",handleDragEnd,false);

		if (file.contentType==="directory") {
			li.addEventListener("dragover",handleDragOver,false);
			li.addEventListener("dragleave",handleDragLeave,false);
			li.addEventListener("drop",handleDragDrop,false);
		}
		return li;
	};

    //bit of a dirty hack for now.  Anything changed by us, check everything.
	FileIO.on("modification", function(){
		var containers=document.body.querySelectorAll(".itemcontainer");
		console.log("containers",containers);
		for (var i=0; i<containers.length; i++) {
			containers[i].itemView.updateView();
		}
	});
	return API;
}());
