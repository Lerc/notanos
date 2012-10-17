function  InputManager() {
  this._keyIsDown = [];
  this._keyWentDown = [];
  this._keyDownAccumulation = [];  
  var logdiv= document.getElementById('haxe:trace');
  var self = this;
  
  function handleKeyDown(e) {
    document.title=e.keyCode;
    self._keyIsDown[e.keyCode]=true;
    self._keyDownAccumulation[e.keyCode]=true;
    
    if ( !((e.altKey) | (e.ctrlKey)) ) {
        if (e.preventDefault) e.preventDefault();
    }
  }  

  function handleKeyUp(e) {
    self._keyIsDown[e.keyCode]=false;
  }
  
  function handleTouchStart(e) {
    //logdiv.innerHTML +="TouchStart <br>";
    //logdiv.innerHTML +=e.touches.length+"<br>";
    var touches=e.touches;
    var i;
    for (i=0;i<touches.length;i++) {
      var t=touches[i];
      var touchdiv = document.createElement('div');
      touchdiv.id='touch'+t.identifier;
      touchdiv.style.position='absolute';
      touchdiv.style.left=t.pageX+'px';
      touchdiv.style.top=t.pageY+'px';
      touchdiv.style.width='2px';
      touchdiv.style.height='2px';
      touchdiv.style.margin='-4px -4px';
      touchdiv.style.border='4px solid #777';
      touchdiv.style.background.color='#fff';
      touchdiv.style.color='#f00';
      touchdiv.style.zIndex='10000';
      var text='('+t.pageX+','+t.pageY+')  ';

      touchdiv.innerHTML=text;
      document.body.appendChild(touchdiv);
    }
     
  }

  function handleTouchEnd(e) {
    var touches=e.touches;
    var i;
    for (i=0;i<touches.length;i++) {
      var t=touches[i];
      var touchdiv = document.getElementById('touch'+t.identifier);
      document.body.removeChild(touchdiv);
    }
  }

  function handleTouchMove(e) {
    var touches=e.touches;
    var i;
    for (i=0;i<touches.length;i++) {
      var t=touches[i];
      
      var text='('+t.pageX+','+t.pageY+')  ';

      var touchdiv = document.getElementById('touch'+t.identifier);
      touchdiv.style.left=t.pageX+'px';
      touchdiv.style.top=t.pageY+'px';
      touchdiv.innerHTML=text;
    }
    
    
  }

  function handleGestureChange(e) {
  
  }
  
  addEventListener("keydown",handleKeyDown,true);
  addEventListener("keyup",handleKeyUp,true);
  
  addEventListener("gesturechange", handleGestureChange, false);    
  addEventListener("touchmove", handleTouchMove, false); 
  addEventListener("touchstart", handleTouchStart, false);
  addEventListener("touchend", handleTouchEnd, false);
  addEventListener("mousedown",function(e) {e.preventDefault();},true);
}

InputManager.prototype.cycle = function() {
    this._keyWentDown = this._keyDownAccumulation;
    this._keyDownAccumulation = [];  
}

InputManager.prototype.keyIsDown = function(keycode) {
    return this._keyIsDown[keycode];
}

InputManager.prototype.keyWentDown = function (keycode) {
    return this._keyWentDown[keycode];
}
  
  
