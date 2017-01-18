(function() {
	var API = new Module("contextMenus") ;
	var default_images=[
		"system/data/icons/default/actions/bundle-1.png",
		"system/data/icons/default/actions/bundle-2.png",
		"system/data/icons/default/actions/bundle-run.png",
		"system/data/icons/default/actions/bundle-4.png",
		"system/data/icons/default/actions/bundle-look-inside.png"];

	for (let i of default_images) {
		var preload=new Image();
		preload.src=i;
	}

    var test_icon="system/data/icons/fontawesome/users.svg";
	default_actions=["duck","snowflake","run","umbrella","look inside"];
	function makeArcMenu(subFields,callback) {
		menuStructure=API.makeDefaultmenu();

	  var result = document.createElement("div");
	  var overlay = result;
	  result.className="eventcaptureoverlay";
	  var center=result.appendNew("div","arcmenu hidden");
      var subItems=center.appendNew("div","subitem");
	  var menu = center.appendNew("ul","tip");
	  var killed=false;
	  function killMenu() {
			if (killed) return;
			document.body.removeChild(result);
		  killed=true;
		}
		function closeMenu() {
			center.addEventListener("transitionend",killMenu);
			center.addClass("hidden");
		}
	  function overlayMouseDown(e) {
      closeMenu();
      callback("canceled");
		}

    function stopEventPropagation(e) {
      e.stopPropagation();
    }

		function reportClick(e) {

			//console.log("click ",e.target);
			//log("click "+e.currentTarget.dataset["action"]);
			var action=e.currentTarget.dataset["action"];
			if (action != undefined) {
				closeMenu();
				callback(null,action);
			}
			var item=e.currentTarget.parentNode;
			var oldone=subItems.querySelector("ul:not(.hidden)");
			if (oldone) oldone.addClass("hidden");
			if (item.sublist) {
					item.sublist.removeClass("hidden");
			}

			/*
	closeMenu();
	if (callback) callback(e);
			*/
		}
		var caption = center.appendNew("div","info hidden");
		caption.textContent="caption";
		function handleEnter(e) {
			if (e.currentTarget.infoCaption) {
				caption.textContent=e.currentTarget.infoCaption;
				caption.removeClass("hidden");
			}
		}
		if (menuStructure.length !=5) console.log("Menu is wrong size!");

	  for (var i=0; i<5;i++) {
			var menuEntry=menuStructure[i];
			var item=menu.appendNew("li","slice");
			var content=item.appendNew("span","arcmenuitem");
			content.innerHTML='<img src="'+menuEntry.image+'">';
			content.addEventListener("mousedown",stopEventPropagation);
      content.addEventListener("click",reportClick);
      if (menuEntry.caption) {
				content.infoCaption=menuEntry.caption;
				content.addEventListener("mouseover",handleEnter);
			}
			if (menuEntry.response) {
				content.dataset["action"]=menuEntry.response;
			}

			var childList=menuEntry.subFields;
			var sublistElement=subItems.appendNew("ul","sublist hidden")
			if (childList) {
				//var childList=[1,2,3,4,5, 6,7,8,9,10,11, 12,13,14,15,16];
				for (var j=0; j<childList.length;j++) {
					  var childEntry=childList[j];
						var subItem=sublistElement.appendNew("li","subbutton");
						subItem.innerHTML='<img src="'+childEntry.image+'">';
						if (childEntry.caption) {
							subItem.infoCaption=childEntry.caption;
							subItem.addEventListener("mouseover",handleEnter);
						}
						if (childEntry.response) {
							subItem.dataset["action"]=childEntry.response;
						}
						subItem.addEventListener("mousedown",stopEventPropagation);
						subItem.addEventListener("click",reportClick);

				}
				item.sublist=sublistElement;
			}
		}
		result.addEventListener("mousedown",overlayMouseDown);
		return result;
	}
	API.makeDefaultmenu = function () {
		return [ {image:"system/data/icons/default/actions/bundle-1.png", caption: "File",  subFields : [
								{image: "system/data/icons/fontawesome/ellipsis-h.svg", caption : "Rename" , response: "rename"},
								{image: "system/data/icons/fontawesome/files-o.svg", caption : "Duplicate" , response: "clone"},
								{image: "system/data/icons/fontawesome/share.svg", caption : "Make a link" , response: "symlink"},
								{image: "system/data/icons/fontawesome/times-circle.svg", caption : "Delete" , response: "delete"},

							]
							},
							{image:"system/data/icons/default/actions/bundle-2.png",caption: "Clipboard",  subFields : [
								{image: "system/data/icons/fontawesome/scissors.svg", caption : "Cut" , response: "cut"},
								{image: "system/data/icons/fontawesome/files-o.svg", caption : "Copy" , response: "copy"},
								{image: "system/data/icons/fontawesome/clipboard.svg", caption : "Paste" , response: "paste"}
							]
							},
							{image:"system/data/icons/default/actions/bundle-run.png",  caption: "Doing stuff", subFields : [
								{image: "system/data/icons/fontawesome/play.svg", caption : "Open" , response: "Open"},
								{image: "system/data/icons/fontawesome/pencil.svg", caption : "Edit" , response: "Edit"},
								{image: "system/data/icons/fontawesome/eye.svg", caption : "View" , response: "View"},
								{image: "system/data/icons/fontawesome/wrench.svg", caption : "Hack!" , response: "Hack"}
							]
							},
							{image:"system/data/icons/default/actions/bundle-4.png",  caption: "Nothing yet", subFields : [
							]
							},
							{image:"system/data/icons/default/actions/bundle-hack.png",  caption: "Hack!", response: "Hack"
							},

					 ]
	}
	API.makeDefaultSubFields = function() {
      return [  ["rename","clone","symlink","delete"],
                 ["cut","copy"],
                 [],
                 ["open","edit","view","hack"],
                 ["a","b","c","d"]
              ];
    }
	API.attachArcMenu = function(element,subFields,callback) {
		 var overlay = makeArcMenu(subFields,callback);
		 var bounds=element.getBoundingClientRect();
		 var menu=overlay.querySelector(".arcmenu")
		 var pos=menu.style;
		 pos.left=bounds.left+(bounds.width/2)+"px";
		 pos.top=bounds.top+(bounds.height/2)+"px";
		 pos.width="10px";
		 pos.height="10px";
		 document.body.appendChild(overlay);
		 getComputedStyle(menu).left;
		 menu.removeClass("hidden");
	}

	API._init_ = function(callback) {
		var justPreCaching = makeArcMenu(API.makeDefaultmenu());
		callback();
	}
  return API;
}());
