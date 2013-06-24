//this is mostly just a crude copy of dumbdirectoryview (itself a crude viewer)
//hacked together to get a desktop quickly;
var workSpace=document.body;
var desktopDirectoryName="/Desktop";
var desktop=sys.modules.fileItem.createItemContainer();
desktop.addClass("desktop");
workSpace.appendChild(desktop);
desktop.setContainerViewpoint(desktopDirectoryName);

/*
var list=desktop.appendNew("ul","fileview icons");
var dir=WebDav.getDirectoryListing(name);
for (var i = 0; i<dir.length;i++) {
	var file = dir[i];
	var li = sys.modules.fileItem.createItem(file);
	list.appendChild(li);
}	
*/
/*
desktop.addEventListener("dragover",handleDragOver,false); 
desktop.addEventListener("dragleave",handleDragLeave,false); 
desktop.addEventListener("drop",handleDragDrop,false); 

*/

