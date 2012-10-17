var sys = {modules:{}};
		
function init() {		
	var logwin = DivWin.createWindow(30,30,640,480,"Log");
	var logbox= logwin.clientArea.appendNew("textarea","fillparent");

	window.log = function (text) {
			logbox.textContent+=text+"\n";
			logbox.scrollTop=logbox.scrollHeight;//jump to bottom
	}

	log("log started...");
	 
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
	sys.modules.handlers.open("/");
	
}



//readStore();
//var trash = new Trash();
    //alert(JSON.stringify(appHandler));
    //installHandler(appHandler); 
//getLocalObject("StartUp").contents.forEach(function(k){openItem(k);});    
//openItem("");
