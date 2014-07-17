(function() {
	var API = new Module("contextMenus") ;
	var default_images=[
		"system/data/icons/default/actions/bundle-1.png",
		"system/data/icons/default/actions/bundle-2.png",
		"system/data/icons/default/actions/bundle-run.png",
		"system/data/icons/default/actions/bundle-4.png",
		"system/data/icons/default/actions/bundle-look-inside.png"];
	
    var test_icon="system/data/icons/default/actions/symbolic/list-add-symbolic.svg";
	default_actions=["duck","snowflake","run","umbrella","look inside"];
	function makeArcMenu(subFields,callback) {
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
		}
        function stopEventPropagation(e) {
            e.stopPropagation();
        }
        
		function reportClick(e) {
            console.log("click ",+e.target);
			log("click "+e.target.textContent);
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
	  for (var i=0; i<5;i++) {
			var item=menu.appendNew("li","slice");
			var content=item.appendNew("span","arcmenuitem");
			content.innerHTML='<img src="'+default_images[i]+'">';
			content.addEventListener("mousedown",stopEventPropagation);
            content.addEventListener("click",reportClick);
			content.dataset["action"]=default_actions[i];

          //var childList=subFields[i];
          var childList=[1,2,3,4,5, 6,7,8,9,10,11, 12,13,14,15,16];
          var sublistElement=subItems.appendNew("ul","sublist hidden")            
          for (var j=0; j<childList.length;j++) {
              var subitem=sublistElement.appendNew("li","subbutton"); 
              subitem.innerHTML='<i class="fa fa-camera-retro"></i>';
			  //subitem.innerHTML='<img src="'+test_icon+'">';
              
          }
          item.sublist=sublistElement;
        }
		result.addEventListener("mousedown",overlayMouseDown);
		return result;
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
	
  return API;
}());
