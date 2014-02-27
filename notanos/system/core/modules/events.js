(function() {
	var API = new Module("events");
    function on(type, eventFunction) {
        if (!this) return;
        if (!this.attachedEvents) this.attachedEvents={};        
        if (!this.attachedEvents[type]) this.attachedEvents[type] = [];
        
        this.attachedEvents[type].add(eventFunction);        
    }

    function off(type, eventFunction) {
        if (!this) return;
        if (!this.attachedEvents) return;        
        if (!this.attachedEvents[type]) return; 
        
        var list = this.attachedEvents[type];
        list.remove(function (n) {return eventFunction===list[n]});
    }

    function signal(type /* arguments */) {        
        if (!this) return;
        if (!this.attachedEvents) return;        
        if (!this.attachedEvents[type]) return; 
        var eventObject=this;
        var args = Array.prototype.slice.call(arguments,1);
        this.attachedEvents[type].forEach( function(e) {e.apply(eventObject,args)});
    }
    
    API.bindEventsToClass = function (classConstructor) {
        classConstructor.prototype.on=on;
        classConstructor.prototype.off=off;
        classConstructor.prototype.signal=signal;
    }
    
    API.bindEventsToClass(Module);
    //API._init_ =function(callback) {  }
  return API;
}());
