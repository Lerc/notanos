(function() {
	var API = new Module("fileItem");
	//log("fileItemModule");
	function contextMenu(item) {
		function menuClick(e) {
			var menuAction=e.currentTarget.dataset["action"];
			log("menuClick on "+ item.dataset["filename"]+": "+menuAction);
			if (menuAction === "look inside") {
				sys.modules.handlers.performAction("Hack",item.dataset["filename"]);
			}
		}
		sys.modules.contextMenus.attachArcMenu(item,menuClick);
	}

    function handleContextMenu(e) {
        contextMenu(e.currentTarget);
        e.preventDefault();
    }
	function handleClick(e) {
		if (e.button==0) {
    		var p=e.currentTarget.parentNode.parentNode; 
            var currentSelection = Array.prototype.slice.call(p.querySelectorAll("li.selected"));
            console.log(currentSelection);
            currentSelection.each(function(i){i.removeClass("selected");});
            e.currentTarget.addClass("selected");
            console.log("clicky",e);
        } 

	}

	function doubleClick(e) {	
		var p=e.currentTarget.parentNode.parentNode; 
		if (Object.isFunction(p.defaultHandler)) {
            console.log("default handler trigered");
            var handled = p.defaultHandler(e);
		} else {  
			sys.modules.handlers.open(e.currentTarget.dataset["filename"]);
		}
	}	
	
	function handleDragStart(e) {
		var data = {fileName : e.currentTarget.dataset["filename"]};
		e.currentTarget.classList.add("dragorigin");
		window.dragData=data;									
		e.dataTransfer.e.currentTarget.dataset["filename"];
		setData("notanos/object","not here: in window.dragData");
	}

	function handleDragEnd(e) {
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
			var destinationPath = path+"/"+data.fileName.split("/").pop();
			if (!FileIO.arePathsEquivalent(data.fileName,destinationPath)) {
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
			var destinationPath = path+"/"+data.fileName.split("/").pop();
			console.log("rename "+data.fileName+" to "+destinationPath);
		}
		if (e.stopPropagation) {
			e.stopPropagation(); 
		}
		delete e.currentTarget.dataset["dropquery"];
		delete e.currentTarget.dataset["dropeffect"];
		return false;
	}

	function setContainerViewpoint(fileName) {
		//"this" is expected to be a container element
		container=this;
		name=fileName;
		container.dataset["filename"]=name=="/"?"":name;
		var list = container.querySelector("ul.fileview");
		if (!list) list=container.appendNew("ul","fileview icons");
		list.innerHTML="";
        
        FileIO.getDirectoryListing(name, function (err,dir) {
            dir.each(function(file){
                list.appendChild(sys.modules.fileItem.createItem(file)
            )});
        });
/*
        var dir=WebDav.getDirectoryListing(name);
		for (var i = 0; i<dir.length;i++) {
			var file = dir[i];
			var li = sys.modules.fileItem.createItem(file);
			list.appendChild(li);
		}	
*/
	}
	
	API.createItemContainer = function (element,viewMode) {
		if (!element) element = document.createElement("div");
		if (!viewMode) viewMode = "icons";
		element.appendNew("ul","fileview "+viewMode);
		element.addEventListener("dragover",handleDragOver,false); 
		element.addEventListener("dragleave",handleDragLeave,false); 
		element.addEventListener("drop",handleDragDrop,false); 
		element.setContainerViewpoint=setContainerViewpoint;
		return element;
	};

	API.createItem = function (file) {
        //console.log("createItem",file);
		var li=document.createElement("li");
		var contentParts=file.contentType.split("/")
		var itemData = {
			"image":" ",
			"fileName" :(file.path+"/"+file.filename),
			"displayName" :file.filename,
			"fileSize" : file.size,
			"contentType" :file.contentType
		}
        var fullName=file.path+"/"+file.filename;
		li.innerHTML=Utility.spanify(itemData);
		if (!file.container) li.dataset["filesize"]=file.contentLength;
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

		if (file.container) {
			li.addEventListener("dragover",handleDragOver,false); 
			li.addEventListener("dragleave",handleDragLeave,false); 
			li.addEventListener("drop",handleDragDrop,false); 
		}
		return li;
	};
	
  return API;
}());
