({
	name: "Dumb Directory viewer",
	mediaTypes : ["directory"],	
		
	actions: {
		"Open" : {
			description : "look at it (Duh)",
			act : function(name) {
								var dir=WebDav.getDirectoryListing(name);
				        var win=DivWin.createWindow({width:600,height:300,title:name});
				        var list=win.clientArea.appendNew("ul","fileview icons");
				        //log(JSON.stringify(dir));
				        for (var i = 0; i<dir.length;i++) {
									var li = list.appendNew("li");
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
								  li.addEventListener("click",function(){},false);
								  
								  li.setAttribute("draggable","true");
								}	
							
							
							  function doubleClick(e) {
									sys.modules.handlers.open(e.currentTarget.dataset["filename"]);
								}	
							}
			}
		}	
});

