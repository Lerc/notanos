var DivWin = function () {
	 var winIdCounter=1;
	 function getNewWinId() {
		 return winIdCounter++
	 }
	 
	 var DivWin = {};
	    var windowFrameWidth =0;
	    var windowFrameHeight =0;
	    DivWin.bringToFront = function(win) {
				 var oldDepth=parseInt(win.element.dataset["stack"]);
				 var recent = win.element.parentNode.querySelectorAll("*[data-stack]");		
				 for (var i=0; i<recent.length;i++) {
					  if (recent[i].parentNode === win.element.parentNode) {
							var current=parseInt(recent[i].dataset["stack"]);
								if (current<=oldDepth) {
								recent[i].dataset["stack"]=""+(current+1);
							}
						}
				 }
				win.element.dataset["stack"]=0;	
				win.element.parentNode.dataset["top_window"]=win.element.dataset["window_id"];
			}
			
			DivWin.focus = function(win) {				
				DivWin.bringToFront(win);
				var container = win.element.parentNode;
				if (container.focusedWindow != win) {
					win.signal("focus");
					if (container.focusedWindow){
						container.focusedWindow.signal("blur");
						container.focusedWindow.element.removeClass("focused");
					}
					container.focusedWindow=win;
					win.element.addClass("focused");				
					container.dataset["focused_window"]=win.element.dataset["window_id"]; 
				}
			}
			function suggestPosition(x,y,w,h,centered) {
				if (!w) w=400;
				if (!h) h=200;
				if (typeof(x) == 'undefined') { 
					if (centered) {
						x=Math.floor((window.innerWidth-w)/2);
					} else {
						var range=window.innerWidth-w-10;
						x = Math.floor(Math.random()*range);
					}
				}
				if (typeof(y) == 'undefined') { 
					if (centered) {
						y=Math.floor((window.innerHeight-h)/2);
					} else {
						var range=window.innerHeight-h-30;
						y = Math.floor(Math.random()*range);
					}
				}
				return({left:x,top:y, width:w,height:h});
			}	
			function handleWindowMouseDown(e) {
				var win=e.currentTarget.owner;
				if (win.hasFocus() === false) {
					win.focus();
					e.preventDefault();
					e.stopPropagation();
				}
			}
			function DivWindow (options) {
				var element=document.createElement("div");
				this.element = element;
			
				element.dataset["window_id"]=getNewWinId();
				element.dataset["stack"]=9999;
				element.className="miniwin frame";
				element.owner=this;	
				var position=options.position
				var s = element.style;
				s.left=position.left+'px';
				s.top=position.top+'px';
				s.width=position.width+'px';
				s.height=position.height+'px';
				s.position='absolute';

				var hostdiv=element;				
				this.clientArea = hostdiv.appendNew("div","clientarea");

				this.decorations={};
				var decorations=this.decorations;
				decorations.titleBar=hostdiv.appendNew("div","titlebar");
				decorations.caption=decorations.titleBar.appendNew("div","caption");
				decorations.caption.innerHTML=options.title;
				decorations.closeButton=decorations.titleBar.appendNew("div","close button widget");
				decorations.maximizeButton=decorations.titleBar.appendNew("div","maximize button widget");
				decorations.minimizeButton=decorations.titleBar.appendNew("div","minimize button widget");

				//result.decorations.titlebar
				
				decorations.leftdragregion = hostdiv.appendNew("div","leftframe dragregion");
				decorations.rightdragregion = hostdiv.appendNew("div","rightframe dragregion");
				decorations.topdragregion = hostdiv.appendNew("div","topframe dragregion");
				decorations.bottomdragregion = hostdiv.appendNew("div","bottomframe dragregion");
				decorations.bottomleftdragregion = hostdiv.appendNew("div","bottomleftframe dragregion");
				decorations.bottomrightdragregion = hostdiv.appendNew("div","bottomrightframe dragregion");


				hostdiv.addEventListener("mousedown",handleWindowMouseDown,true); 
				decorations.leftdragregion.addEventListener("mousedown",LeftEdgeMouseDown,true);
				decorations.rightdragregion.addEventListener("mousedown",RightEdgeMouseDown,true);
				decorations.topdragregion.addEventListener("mousedown",TopEdgeMouseDown,true);
				decorations.bottomdragregion.addEventListener("mousedown",BottomEdgeMouseDown,true);
				decorations.bottomleftdragregion.addEventListener("mousedown",BottomLeftCornerMouseDown,true);
				decorations.bottomrightdragregion.addEventListener("mousedown",BottomRightCornerMouseDown,true);
				decorations.closeButton.addEventListener("click",CloseClick,true);
				decorations.minimizeButton.addEventListener("click",minimizeClick,true);
				decorations.maximizeButton.addEventListener("click",maximizeClick,true);
				decorations.titleBar.addEventListener("mousedown",TitleBarMouseDown,true);
			}
			CustomEvents.bindEventsToClass(DivWindow);
			
			DivWindow.prototype.hasFocus = function() {
				var container = this.element.parentNode;
				return (container.focusedWindow === this) 
			}
			
			DivWindow.prototype.isMaximized = function() {				
				return (this.element.hasClass("maximized")); 
			}

			DivWindow.prototype.focus = function(){DivWin.focus(this);};
			DivWindow.prototype.inheritMaximizedSize	= function () {DivWin.inheritMaximizedSize(this)};

	    DivWin.createWindow =function (left,top,width,height,title) {
				 var parameters;
				 var centered=false;
				 if (left instanceof Object) {
					 parameters=left;
					 left=parameters.left;
					 top=parameters.top;
					 width=parameters.width;
					 height=parameters.height;
					 title=parameters.title;
					 centered=parameters.centered;
					 if (parameters.clientWidth) {width=parameters.clientWidth+windowFrameWidth}
					 if (parameters.clientHeight) {height=parameters.clientHeight+windowFrameHeight}
				 } 
				 var position=suggestPosition(left,top,width,height,centered);
				 
				 var result = new DivWindow({"position":position,"title":title});

					document.body.appendChild(result.element);
					
					//hacky frame measuring 
					windowFrameHeight = height - result.clientArea.clientHeight ;
					windowFrameWidth = width - result.clientArea.clientWidth;
					result.element.addClass("visible");
					DivWin.focus(result);
					return result;
					
			}
			
	  DivWin.closeWindow = function(win) {
		  win.element.parentNode.removeChild(win.element);
          win.signal("close");
		  if (win.onClose) (win.onClose());
	 }
	 
	 DivWin.inheritMaximizedSize = function (win) {
		 var computedStyle = getComputedStyle(win.element);
		 var elementStyle= win.element.style;
		 elementStyle.left = computedStyle.left;
		 elementStyle.top = computedStyle.top;
		 elementStyle.width = computedStyle.width;
		 elementStyle.height = computedStyle.height;
		 win.element.removeClass("maximized"); 
	 }
   function LeftEdgeMouseMove(e){
			 var hostdiv=e.owner.element;
       var oldx=hostdiv.offsetLeft;
       var newx = (e.clientX-Resizing_Div.dragStartX);
       growElement(hostdiv,oldx-newx);
       hostdiv.style.left=newx+'px';
    }
    function TopEdgeMouseMove(e){
			 var hostdiv=e.owner.element;
       var oldy=hostdiv.offsetTop;
       var newy = (e.clientY-Resizing_Div.dragStartY);
       growElement(hostdiv,0,oldy-newy);
       hostdiv.style.top=newy+'px';
    }
    function RightEdgeMouseMove(e){
			 var hostdiv=e.owner.element;
      var localx = e.clientX-hostdiv.offsetLeft;
      var movedx=(localx-Resizing_Div.dragStartX);
      setElementExplicitWidth(hostdiv,Resizing_Div.dragStartWidth+movedx);
    }
    function BottomEdgeMouseMove(e){
			 var hostdiv=e.owner.element;
      var localy = e.clientY-hostdiv.offsetTop;
      var movedy=(localy-Resizing_Div.dragStartY);
      setElementExplicitHeight(hostdiv,Resizing_Div.dragStartHeight+movedy);
    }
    function BottomLeftCornerMouseMove(e){
       BottomEdgeMouseMove(e);
       LeftEdgeMouseMove(e);
    }
    function BottomRightCornerMouseMove(e){
       BottomEdgeMouseMove(e);
       RightEdgeMouseMove(e);
    }
    
    function dragEdge(e,dragfunction){			
			 var hostdiv=e.currentTarget.parentNode;
       var owner=hostdiv.owner;
 			 if (owner.isMaximized()) owner.inheritMaximizedSize();

       var localX=e.clientX-owner.element.offsetLeft;
       var localY=e.clientY-owner.element.offsetTop;
       owner.dragStartX=localX;
       owner.dragStartY=localY;
       owner.dragStartTop=owner.element.offsetTop;
       owner.dragStartLeft=owner.element.offsetLeft;
       owner.dragStartWidth=owner.element.offsetWidth;
       owner.dragStartHeight=owner.element.offsetHeight;
       
       owner.dragFunction=dragfunction;
       Resizing_Div=owner;
       enableEventCaptureOverlay();
       if (e.preventDefault) e.preventDefault();
    }

    function LeftEdgeMouseDown(e){
       dragEdge(e,LeftEdgeMouseMove);
       return false;
    }
    function RightEdgeMouseDown(e){
       dragEdge(e,RightEdgeMouseMove);
       return false;
    }
    function TopEdgeMouseDown(e){
       if (e.stopPropagation) e.stopPropagation();
       dragEdge(e,TopEdgeMouseMove);
       return false;
    }
    function BottomEdgeMouseDown(e){
       dragEdge(e,BottomEdgeMouseMove);
       return false;
    }
    function BottomLeftCornerMouseDown(e){
       dragEdge(e,BottomLeftCornerMouseMove);
       return false;
    }
    function BottomRightCornerMouseDown(e){
       dragEdge(e,BottomRightCornerMouseMove);
       return false;
    }
    
		function TitleBarMouseDown(e) {			
			if (e.target.hasClass("widget")) return;
			var hostdiv=e.currentTarget.parentNode;			
			var win=hostdiv.owner;
			if (win.isMaximized()) win.inheritMaximizedSize();			
			var localx=e.clientX-hostdiv.offsetLeft;
			var localy=e.clientY-hostdiv.offsetTop;
			enableEventCaptureOverlay();
			hostdiv.owner.dragStartX=localx;
			hostdiv.owner.dragStartY=localy;
			Dragging_Div=hostdiv.owner;
			if (e.preventDefault) e.preventDefault();
			return false;
		}    

    CloseClick = function(e){
       var owner=e.currentTarget.parentNode.parentNode.owner;  //ugh
       if (e.preventDefault) e.preventDefault();
       if (e.stopPropagation) e.stopPropagation();       
       DivWin.closeWindow(owner);
    }
    minimizeClick = function(e){
       var owner=e.currentTarget.parentNode.parentNode.owner; 
       if (e.preventDefault) e.preventDefault();
       if (e.stopPropagation) e.stopPropagation();       
       owner.element.addClass("minimized");
    }
    maximizeClick = function(e){
       var owner=e.currentTarget.parentNode.parentNode.owner; 
       if (e.preventDefault) e.preventDefault();
       if (e.stopPropagation) e.stopPropagation();       
       owner.element.toggleClass("maximized");
    }

	 function enableEventCaptureOverlay() {
    var eventOverlay = document.body.appendNew("div","eventcaptureoverlay","drageventoverlay");
	}
	 
		var Dragging_Div=null;
		var Resizing_Div=null;
		//these are top level mouse events because of the nature of dragging something you can
		//leave the region for which the events are relevant
		function handle_div_drag(e) {
			if (Dragging_Div) {
				 Dragging_Div.element.style.left=(e.clientX-Dragging_Div.dragStartX)+'px';
				 var newtop =(e.clientY-Dragging_Div.dragStartY);
				 if (newtop<0) newtop=0;
				 Dragging_Div.element.style.top=newtop+'px';          
			}
			if (Resizing_Div) {
				e.owner=Resizing_Div;
				Resizing_Div.dragFunction(e)
				sendResizeEvent(Resizing_Div);
			}
		}
    function sendResizeEvent(divWindow) {
			var e = document.createEvent("UIEvents");
			e.initUIEvent("resize",true,true,window,1);
			divWindow.element.dispatchEvent(e);
		}
		function handle_div_mouseup(e) {
			var divOverlay=document.getElementById("drageventoverlay");
			if (divOverlay) {
				divOverlay.parentNode.removeChild(divOverlay);
			}  
			if (Dragging_Div) {
				Dragging_Div=null;
			}
			if (Resizing_Div) {
					Resizing_Div=null;
			}
		}

		document.addEventListener("mousemove",handle_div_drag,true);
		document.addEventListener("mouseup",handle_div_mouseup,true);
	    
		return DivWin;	 



function getElementHeight(element){
   if (typeof element.clip !== "undefined") {
      return element.clip.height;
   } else {
      if (element.style.pixelHeight) {
         return element.style.pixelHeight;
      } else {
         return element.offsetHeight;
      }
   }
}

function getElementWidth(element){
   if (typeof element.clip !== "undefined") {
      return element.clip.width;
   } else {
      if (element.style.pixelWidth) {
         return element.style.pixelWidth;
      } else {
         return element.offsetWidth;
      }
   }
}

function setElementExplicitWidth(element,newwidth) {
    element.style.width=newwidth+"px";
    var checkwidth = getElementWidth(element);
    var adjustment = newwidth - checkwidth; 
    newwidth+=adjustment;
    element.style.width=newwidth+"px";
}

function setElementExplicitHeight(element,newheight) {
    element.style.height=newheight+"px";
    var checkheight = getElementHeight(element);
    var adjustment = newheight - checkheight;
    newheight+=adjustment;
    element.style.height=newheight+"px";
}

function growElement(element,growx,growy) {
  if(growx) {
    var startwidth = getElementWidth(element);
    setElementExplicitWidth(element,startwidth+growx);
  }
  if(growy) {
    var startheight = getElementHeight(element);
    setElementExplicitHeight(element,startheight+growy);
  }
}

function isPointInElement(x,y,element) {   
      var left=element.offsetLeft;
      var top=element.offsetTop;
      var right=left+getElementWidth(element);
      var bottom=top+getElementHeight(element);
      return ( (x>=left) & (x<right) & (y>=top) & (y<bottom) );
}

function isPointInChild(x,y,children) {
   var childCount=children.length;   
   for (i=0;i<childCount;i++) {
      var c = children[i];
      var left=c.offsetLeft;
      var top=c.offsetTop;
      var right=left+c.getElementWidth();
      var bottom=top+c.getElementHeight();
      if ( (x>=left) & (x<right) & (y>=top) & (y<bottom) ) {
        //(x,y) is inside element c
        return true;
      }
      
   }
  return false;
}

} ();
