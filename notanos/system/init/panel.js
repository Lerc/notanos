var workspace=document.body;

var panel = workspace.appendNew("div","panel horizontal stretched bottom");
var taskbar = panel.appendNew("div","taskbar");
var miniClock = panel.appendNew("div","clock");

function updateClockDisplay() {
	var now=new Date();
	var h=now.getHours();
	var m=now.getMinutes();
	var s=now.getSeconds();
	var meridian="am";
	if (h>12) {h-=12; meridian="pm";}
	if (h<10) h=" "+h;
	if (m<10) m="0"+m;
	if (s<10) s="0"+s;
	miniClock.textContent=h+":"+m+" "+meridian;
}
updateClockDisplay();

setInterval(updateClockDisplay,10000);

function taskBarItemClick(e) {
	var win=e.currentTarget.relatedWindow;
	if (win.hasFocus()) {
		win.element.toggleClass("minimized");
	}	else {
		win.element.removeClass("minimized");
		win.focus();	
	}
}

function considerTaskBar() {
	taskbar.innerHTML="";
	var windows = workspace.querySelectorAll(".miniwin");
	
	for (var i=0; i<windows.length;i++) {
		var w=windows[i];
	  var titleBar=w.querySelector(".titlebar");
		var item=taskbar.appendNew("div","taskbaritem");
		if (w.dataset.stack==="0") item.addClass("focused");
		var caption=item.appendNew("div","caption");
		var image=item.appendNew("img","icon");		
		caption.textContent=titleBar.textContent;
		item.relatedWindow=w.owner;
		image.src=w.iconImage || "system/data/icons/default/categories/generic-window.svg";
		item.addEventListener("click",taskBarItemClick,false);
	};
	
}

function mutationHandler(mutations) {
	var rethink=false;
	/*for (var i=0; i<mutations.length;i++) {
	  var mutation = mutations[i];
	  if (mutation.type==="childList") rethink=true;
	  
	};*/
	rethink=true;
	if (rethink) considerTaskBar();
}


panel.observer= new MutationObserver(mutationHandler);

panel.observer.observe(document.body, {childList:true, attributes:true});


considerTaskBar();
