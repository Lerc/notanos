({
	name: "Dumb Directory viewer",
	mediaTypes : ["directory"],	
		
	actions: {
		"Open" : {
			description : "look at it (Duh)",
			act : function(name) {
								var dir=WebDav.getDirectoryListing(name);
				        var win=DivWin.createWindow({width:600,height:300,title:name=="/"?"Root Folder":name});
				        var container = sys.modules.fileItem.createItemContainer(win.clientArea);
				        container.setContainerViewpoint(name);				        							
							
/*				        
				        var list=win.clientArea.appendNew("ul","fileview icons");
				        win.clientArea.dataset["filename"]=name=="/"?"":name;
				        
				        for (var i = 0; i<dir.length;i++) {
									var li = list.appendNew("li");
									var file = dir[i];
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
								  li.addEventListener("click",function(){},false);
								  
								  li.setAttribute("draggable","true");
 								  li.addEventListener("dragstart",handleDragStart,false);
 								  li.addEventListener("dragend",handleDragEnd,false);

									if (file.container) {
										li.addEventListener("dragover",handleDragOver,false); 
										li.addEventListener("dragleave",handleDragLeave,false); 
										li.addEventListener("drop",handleDragDrop,false); 										
									}
								}	
							
								win.clientArea.addEventListener("dragover",handleDragOver,false); 
								win.clientArea.addEventListener("dragleave",handleDragLeave,false); 
								win.clientArea.addEventListener("drop",handleDragDrop,false); 
								
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
								
							  function doubleClick(e) {
									sys.modules.handlers.open(e.currentTarget.dataset["filename"]);
								}	
							*/

							}
			}
		}	
});

