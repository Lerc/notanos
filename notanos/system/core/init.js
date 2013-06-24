var sys = {modules:{}};


function init() {		
	function toggleFullScreen() {
		if (!document.fullscreenElement &&    // alternative standard method
				!document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	}

	var fullscreenButton = document.body.appendNew("div","fullscreentoggle");
	fullscreenButton.onclick=toggleFullScreen;


	function eventSuppressor(e) {
		e.preventDefault();
		e.stopPropagation();
	}
	
	document.addEventListener("keydown",eventSuppressor,false);
	document.addEventListener("keyup",eventSuppressor,false);
	document.addEventListener("keypress",eventSuppressor,false);
	
	var logwin = DivWin.createWindow(30,200,640,280,"Log");
	var logbox= logwin.clientArea.appendNew("textarea","fillparent");

	window.log = function (text) {
			logbox.textContent+=text+"\n";
			logbox.scrollTop=logbox.scrollHeight;//jump to bottom
	}

	log("log started...");
	DivWin.focus(logwin);
	 
	log("\n\nfetching info on '/index.html'");
	log("\n"+JSON.stringify(WebDav.getInfo("/index.html"), null, '\t'));			 

	log("\n\nfetching directory listing of /system/core/modules");
	log("\n"+JSON.stringify(WebDav.getDirectoryListing("/system/core/modules"), null, '\t'));			 
	 
	 

	log("\n\nwriting some data to /test2");			 
	WebDav.setData("/test2","this is also a test of overwriting");

	log("\n\nwriting some data to /system/test3");			 
	WebDav.setData("/system/test3","ooglei");
	
	
	var modules = WebDav.getDirectoryListing("/system/core/modules");
	for (var i=0; i<modules.length;i++) {
		installModule(modules[i].name);
	}	
	

	function installModule(name) {
		log("installing module " + name);
		var moduleText=WebDav.getData(name);
		var module = eval(moduleText);
		Object.freeze(module);
		sys.modules[module.name] = module;
	}
	

	log("\n\nfetching info on '/nofilehere'");
	log("\n"+JSON.stringify(WebDav.getInfo("/nofilehere"), null, '\t'));			 
	
	//sys.modules.handlers.open("bacon.txt");
	/*
	var firstTask = sys.modules.tasks.primaryTask();
	var childTask = firstTask.createTask();
	
	console.log("first task");
	console.log(firstTask);
	console.log("second task");
	console.log(childTask);
	console.log("Killing first task");
	firstTask.kill();
	console.log("first task");
	console.log(firstTask);
	console.log("second task");
	console.log(childTask);
	*/

	var initScripts = WebDav.getDirectoryListing("/system/init");
	for (var i=0; i<initScripts.length;i++) {
		runScript(initScripts[i].name);
	}	

	function runScript(name) {
		log("running script " + name);
		var scriptBody=WebDav.getData(name);		
		var Result = eval("(function () {"+scriptBody+"}());");		
	}

	
}




//readStore();
//var trash = new Trash();
    //alert(JSON.stringify(appHandler));
    //installHandler(appHandler); 
//getLocalObject("StartUp").contents.forEach(function(k){openItem(k);});    
//openItem("");
