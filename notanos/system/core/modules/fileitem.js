(function() {
	var Module = {name:"fileItem"};
	log("fileItemModule");
	function contextMenu(item) {
		function menuClick(e) {
			var menuAction=e.currentTarget.dataset["action"];
			log("menuClick on "+ item.dataset["filename"]+": "+menuAction);
			if (menuAction === "look inside") {
				sys.modules.handlers.performAction("Open",item.dataset["filename"],{},"directory");
			}
		}
		sys.modules.contextMenus.attachArcMenu(item,menuClick);
	}

	function handleClick(e) {
		contextMenu(e.currentTarget);
		e.preventDefault();
	}

	function doubleClick(e) {
		sys.modules.handlers.open(e.currentTarget.dataset["filename"]);
	}	
	
	function handleDragStart(e) {
	var data = {fileName : e.currentTarget.dataset["filename"]};
	e.currentTarget.classList.add("dragorigin");
	window.dragData=data;									
	e.dataTransfer.setData("notanos/object","not here: in window.dragData");
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
		if (!WebDav.arePathsEquivalent(data.fileName,destinationPath)) {
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
		container.innerHTML="";
		var list=container.appendNew("ul","fileview icons");
		var dir=WebDav.getDirectoryListing(name);
		for (var i = 0; i<dir.length;i++) {
			var file = dir[i];
			var li = sys.modules.fileItem.createItem(file);
			list.appendChild(li);
		}	
	}
	
	Module.createItemContainer = function (element) {
		if (!element) element = document.createElement("div");
		element.addEventListener("dragover",handleDragOver,false); 
		element.addEventListener("dragleave",handleDragLeave,false); 
		element.addEventListener("drop",handleDragDrop,false); 
		element.setContainerViewpoint=setContainerViewpoint;
		return element;
	}

	Module.createItem = function (file) {
		var li=document.createElement("li");
		var contentParts=file.contentType.split("/")
		var itemData = {
			"image":" ",
			"fileName" :file.name,
			"displayName" :file.displayName,
			"fileSize" : (file.container)?"-":file.contentLength,
			"contentType" :file.contentType
		}

		li.innerHTML=Utility.spanify(itemData);
		if (!file.container) li.dataset["filesize"]=file.contentLength;
		li.dataset["filename"]=file.name;
		li.dataset["displayname"]=file.displayName;
		li.dataset["contenttype"]=file.contentType;
		li.dataset["contentclass"]=contentParts[0];
		li.dataset["contentsubtype"]=contentParts[1];
		console.log("checking:" +file.contentType);
		if (file.contentType == "directory/bundle") {
			console.log(file);
			var imageSpan = li.querySelector(".image");
			
			var bundle = file.bundleData;
			if (bundle) {
				if (bundle.icon) {
					 imageSpan.dataset["bundleicon"]=file.name+"/"+bundle.icon;
					 //if css3 attr() worked we wouldn't need a custom style
					 imageSpan.style.backgroundImage="url("+file.name+"/"+bundle.icon+")";												 
					 
				}
			}
		}
		
		li.addEventListener("dblclick",doubleClick,true);
		li.addEventListener("contextmenu",handleClick,false);
		
		li.setAttribute("draggable","true");
		li.addEventListener("dragstart",handleDragStart,false);
		li.addEventListener("dragend",handleDragEnd,false);

		if (file.container) {
			li.addEventListener("dragover",handleDragOver,false); 
			li.addEventListener("dragleave",handleDragLeave,false); 
			li.addEventListener("drop",handleDragDrop,false); 										
		}
		return li;
	}
  return Module;
}());
