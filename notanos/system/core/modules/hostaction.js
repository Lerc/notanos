(function() {
	var API = new Module("hostAction");
    
    API.stat = function (path,callback) {
        sys.modules.hostControl.hostCall("stat",{"path":path},callback);
    }
    
    API.exists = function (path,callback) {
        sys.modules.hostControl.hostCall("exists",{"path":path},function(err,result){callback(result)});
    }
    
    API.rename = function (oldPath,newPath,callback) {
        sys.modules.hostControl.hostCall("rename",{"oldPath":oldPath,"newPath":newPath},callback);
    }

    API.symlink = function (srcPath,destPath,callback) {
        sys.modules.hostControl.hostCall("symlink",{"srcPath":oldPath,"dstPath":newPath},callback);
    }

    API.mkdir = function (path,mode,callback) {
        if (typeof callback==="undefined") { 
            callback=mode;
            mode=undefined;
        }
        sys.modules.hostControl.hostCall("mkdir",{"path":path,"mode":mode},callback);
    }
    

    API.readlink = function (path,callback) {
        sys.modules.hostControl.hostCall("readlink",{"path":path},callback);
    }

    API.truncate = function (path,len,callback) {
        sys.modules.hostControl.hostCall("rename",{"path":path,"len":len},callback);
    }

    API.readFile = function (filename,options,callback) {
        if (typeof callback==="undefined") { 
            callback=options;
            options=undefined;
        }
        sys.modules.hostControl.hostCall("readFile",{"filename":filename,"options":options},callback);        
    }

    API.writeFile = function (filename,data,options,callback) {
        if (typeof callback==="undefined") { 
            callback=options;
            options=undefined;
        }
        sys.modules.hostControl.hostCall("writeFile",{"filename":filename,"data":data,"options":options},callback);        
    }

    API.appendFile = function (filename,data,options,callback) {
        if (typeof callback==="undefined") { 
            callback=options;
            options=undefined;
        }
        sys.modules.hostControl.hostCall("AppendFile",{"filename":filename,"data":data,"options":options},callback);        
    }
    
    API.spawn = function (command, args, options) {
        if (typeof options==="undefined") { 
            options=args;
            args=undefined;
        }
        sys.modules.hostControl.hostCall("spawn",{"command":command,"args":args,"options":options});        
    }
    
    API.exec = function (command,options,callback) {
        if (typeof callback==="undefined") { 
            callback=options;
            options=undefined;
        }
        sys.modules.hostControl.hostCall("exec",{"command":command,"options":options},callback);        
    }

    API.extendFileIO = function() {
        FileIO.writeFile = API.writeFile;
        FileIO.appendFile = API.appendFile;
        FileIO.stat = API.stat;
        FileIO.exists = API.exists;
        FileIO.rename = API.rename;
        FileIO.symlink = API.symlink;
        FileIO.readlink = API.readlink;
        FileIO.mkdir = API.mkdir;
        FileIO.truncate = API.truncate;
        
    }
    
    //API._init_ =function(callback) {  callback(); }
  return API;
}());
