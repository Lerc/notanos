(function() {
	var Module = {name:"contextMenus" };
	default_images=[
		"system/data/icons/default/actions/bundle-1.png",
		"system/data/icons/default/actions/bundle-2.png",
		"system/data/icons/default/actions/bundle-run.png",
		"system/data/icons/default/actions/bundle-4.png",
		"system/data/icons/default/actions/bundle-look-inside.png"];
	
	default_actions=["duck","snowflake","run","umbrella","look inside"];
	function makeArcMenu(callback) {
	  var result = document.createElement("div");
	  var overlay = result;
	  result.className="eventcaptureoverlay";
	  var center=result.appendNew("div","arcmenu hidden");
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
			
			if (e.target.className!=="arcmenuitem") {
				closeMenu();
			}
		}
		function reportClick(e) {
			log("click "+e.target.textContent);
			closeMenu();
			if (callback) callback(e);
		}
	  for (var i=0; i<5;i++) {
			var item=menu.appendNew("li","slice");
			var content=item.appendNew("span","arcmenuitem");
			content.innerHTML='<img src="'+default_images[i]+'">';
			content.addEventListener("click",reportClick);
			content.dataset["action"]=default_actions[i];
		}
		result.addEventListener("mousedown",overlayMouseDown);
		return result;
	}
	
	Module.attachArcMenu = function(element,callback) {
		 var overlay = makeArcMenu(callback);
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
	
  return Module;
}());
