var sys = {modules:{}};
sys.dir=location.pathname.to(location.pathname.lastIndexOf("/"));

function Module(name) {
    this.name=name;
}
CustomEvents.bindEventsToClass(Module);

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
        console.log("key target", e.target);
        if (e.target.hasClass("userinput")) return;
		e.preventDefault();
		e.stopPropagation();
	}
	
	document.addEventListener("keydown",eventSuppressor,false);
	document.addEventListener("keyup",eventSuppressor,false);
	document.addEventListener("keypress",eventSuppressor,false);
	
    //we blur iframes when we click away from them. If the mousedown was still on the iframe this event won't trigger 
    document.addEventListener("mousedown", function(){if (document.activeElement.nodeName==="IFRAME") document.activeElement.blur(); } ,false)
    
	var logwin = DivWin.createWindow(30,200,640,280,"Log");
	var logbox= logwin.clientArea.appendNew("textarea","fillparent");
    logbox.spellcheck='false';
    
	window.log = function (text) {
			logbox.textContent+=text+"\n";
			logbox.scrollTop=logbox.scrollHeight;//jump to bottom
	}

	log("log started...");
	DivWin.focus(logwin);
    

/*
	log("\n\nfetching info on '/index.html'");
	log("\n"+JSON.stringify(WebDav.getInfo("/index.html"), null, '\t'));			 

	log("\n\nfetching directory listing of /system/core/modules");
	log("\n"+JSON.stringify(WebDav.getDirectoryListing("/system/core/modules"), null, '\t'));			 
	 
	log("\n\nwriting some data to /test2");			 
	WebDav.setData("/test2","this is also a test of overwriting");

	log("\n\nwriting some data to /system/test3");			 
	WebDav.setData("/system/test3","ooglei");
*/	
    function installModules(callback) {
        FileIO.getDirectoryListing(sys.dir+"/system/core/modules/",
                function (err,result) {
                    //console.log("callback happened");
                    if (err) console.log(err);
                    if (result) {
                        var filenames=result.map(function(i) {return i.path+"/"+i.filename});
                        //filenames.each(log);
                        async.forEachSeries(filenames,installModule,function(){log("modules installed");callback()});
                    }
                }
            );
	}
    
    function initModules(callback) {
        var modulesToInit=Object.values(sys.modules).findAll(function(o){return Object.has(o,"_init_")});
        async.forEachSeries(modulesToInit,initModule,function(){log("modules initialized");callback();});
    }
    
    function thingsToDoAfterLinkEstablished(callback) {
        function doIt() {
            async.series([runInitScripts]);            
        }
        if (sys.modules.hostControl.isReady()) {
          doIt();
        } else {
            sys.modules.hostControl.on("ready",doIt);            
        }
        callback();
    }
    
    function runInitScripts(callback) {
        FileIO.getDirectoryListing(sys.dir+"/system/init",
                function (err,result) {
                    if (err) console.log(err);
                    if (result) {
                        var filenames=result.map(function(i) {return i.path+"/"+i.filename});
                        //filenames.each(log);
                        async.forEachSeries(filenames,runScript,function(){log("init scripts finished");callback()});
                    }          
                }
        );       
        window.setTimeout(belatedly,3000);
        
    }
    
    function belatedly() {
    
        console.log("belatedly");
     //   sys.modules.hostAction.spawn("/home/lerc/socktest.sh");
/*        
        sys.modules.hostAction.exec("env",
        //sys.modules.hostControl.hostCall("stat",{path:"/usr/share/icons/"},
        function (err,result) {
            if (err) {
                console.log("that didn't work");
                return;
            }
            console.log("stat /usr/share/icons/ returned", result);
        });    
 */   
       
    }
    async.series([installModules,initModules,thingsToDoAfterLinkEstablished]);
    
    /*
	var modules = WebDav.getDirectoryListing("/system/core/modules");
	for (var i=0; i<modules.length;i++) {
		installModule(modules[i].name);
	}	
	*/

  function eval_with_check(code) {
		try {
  		return eval(code);
		}
    catch(ex) {
			console.log(ex);
		}
	}
	
	function installModule(name,callback) {
        console.log("installing module " + name, installModule.caller);
		log("installing module " + name);
        FileIO.getFileAsString(name, function(err,result) {
            
            var module = eval(result);
            sys.modules[module.name] = module;
            /*
            if (Object.has(module,"_init_")) {
        		log("initialising module " + module.name);
                module._init_(function(){Object.freeze(module);callback();});
            } else {           
		        Object.freeze(module);
                callback();
            }*/
            callback();
        });
	}
	
    function initModule(module,callback) {
        if (Object.has(module,"_init_")) {
      		log("initialising module " + module.name);
            module._init_(function(){callback();});
        } else {                       
            callback();
        }
    }
    
	function runScript(name,callback) {
		log("loading script " + name);
        FileIO.getFileAsString(name, function(err,result) {
            if (result) {
                var scriptBody=result;
        		log("running script " + name);
                var ret=eval("(function () {"+scriptBody+"}());");
                callback();
            }
        });
	}

/*
	log("\n\nfetching info on '/nofilehere'");
	log("\n"+JSON.stringify(WebDav.getInfo("/nofilehere"), null, '\t'));			 
*/	
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
/*
	var initScripts = WebDav.getDirectoryListing("/system/init");
	for (var i=0; i<initScripts.length;i++) {
		runScript(initScripts[i].name);
	}	


*/	
}




//readStore();
//var trash = new Trash();
    //alert(JSON.stringify(appHandler));
    //installHandler(appHandler); 
//getLocalObject("StartUp").contents.forEach(function(k){openItem(k);});    
//openItem("");
