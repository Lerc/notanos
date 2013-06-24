var Terminal = function () {
  var Terminal = {};
  
  Terminal.makeVT100 = function () {
    return new VT100();
  }
  
  function Display(w,h) {
    this.setSize (w,h);
  }
  
  function neutralizeCell(cell) {
    cell.textContent="";
    cell.dataset.fg=7;
    cell.dataset.bg=0;
    cell.dataset.blink=false;
    cell.dataset.bold=false;
    cell.dataset.underline=false;
    cell.dataset.inverse=false;
    cell.dataset.intensity="normal";
  }
  
  Display.prototype.getCell = function(x,y) {
      return(this.cells[y*this.width+x]);
  }  
  
  Display.prototype.setSize = function (w,h) {
    this.width=w;
    this.height=h;
    this.cells=[];
    if (this.table){
       this.table.innerHTML="";
    } else {
        this.table=document.createElement("table")
        this.table.cellPadding=0;
        this.table.cellSpacing=0;
        
    }
    for (ty=0; ty<h; ty++) {
        var row=this.table.insertRow(-1);
        for (var tx=0;tx<w; tx++) {
          var cell=row.insertCell(-1);
          cell.className="VT100Cell";
          neutralizeCell(cell);          
          this.cells[ty*w+tx]=cell;
        }
    }
  }
  
  Display.prototype.scrollUp = function () {
    for (ty=0; ty<this.height-1; ty++) {        
        for (var tx=0;tx<this.width; tx++) {
            var dest=this.cells[ty*this.width+tx];
            var src=this.cells[(ty+1)*this.width+tx];
            dest.textContent=src.textContent;
            dest.dataset.fg=src.dataset.fg;
            dest.dataset.bg=src.dataset.bg;
            dest.dataset.blink=src.dataset.blink;
            dest.dataset.bold=src.dataset.bold;
            dest.dataset.underline=src.dataset.underline;
            dest.dataset.inverse=src.dataset.inverse;
            dest.dataset.intensity=src.dataset.intensity;
        }
    }
    for (var tx=0;tx<this.width; tx++) {
      var cell=this.cells[(this.height-1)*this.width+tx];
      neutralizeCell(cell);
    }
  
  }
  function VT100() {
    this.display = new Display(80,25);
    this.element = document.createElement("div");
    this.element.className="VT100";
    this.element.appendChild(this.display.table);
  
    this.cursor = {x:0,y:0,fg:7,bg:0,bold:false,underline:false,intensity:"low",inverse:false,type:"insert"};  
    
  }
  
  VT100.prototype.setChar = function (c) {
    var index=this.cursor.y*this.display.width+this.cursor.x;
    var cell = this.display.cells[index];
    cell.textContent=c;
    cell.dataset.fg=this.cursor.fg;
    cell.dataset.bg=this.cursor.bg;
    cell.dataset.bold=this.cursor.bold;
    cell.dataset.underline=this.cursor.underline;
    cell.dataset.intensity=this.cursor.intensity;
    cell.dataset.inverse=this.cursor.inverse;
    cell.dataset.blink=this.cursor.blink;
  };
  
  VT100.prototype.write = function (data) {
  
     var cursor=this.cursor;
     var display=this.display;
     var self=this;
     //console.log("start:"+JSON.stringify(cursor));
     
     var cursorCell=this.display.getCell(cursor.x,cursor.y);
     delete (cursorCell.dataset.cursor); 
   
     function lineFeed() {
        cursor.y+=1;
        if (cursor.y >= display.height) {
             cursor.y = display.height-1;
             display.scrollUp();
        }

     }
     
     function advanceLine() {
        cursor.x=0;
        lineFeed();
     }
     
     function advanceChar() {
        cursor.x+=1;
        if (cursor.x >= display.width) {
            advanceLine();
        }
     }
     
     function setAttr(values) {
       for (var i=0; i<values.length;i++) {
         value=parseInt(values[i]);
         //console.log("attribute value "+value);
         switch (value) {
           case 0: cursor.bold=false;
                   cursor.underline=false;
                   cursor.blink=false;
                   cursor.intensity="normal";
                   cursor.inverse=false;
                   cursor.fg=7;
                   cursor.bg=0;
                   break;
           case 1: 
                   cursor.bold=true;
                   break;
           case 2:
                   cursor.intensity="low";
                   break;
           case 4:
                   cursor.underline=true;
                   break;
           case 5:
                   cursor.blink=true;
                   break;
           case 7:       
                   cursor.inverse=true;
                   break;
           break;
           case 30:
           case 31:
           case 32:
           case 33:
           case 34:
           case 35:
           case 36:
           case 37:
                cursor.fg=value-30; 
         }         
       }
     }
     
     function clearLine(values) {
        var start=0;
        var end=display.width;
        
        if (values.length === 0 || values[0]===0) {
          start=cursor.x;
        } else if(values[0]===1) {
          end=cursor.x;
        } else if(values[0]!==2) {
          return; //only [],[0],[1],[2] are valid
        }        
        
        var line=cursor.y*display.width;
        for (var i = start;i < end;i++) {            
            var cell = display.cells[line+i];
            neutralizeCell(cell);
        }
     }

			function moveUp(values) {
        var value = 1;
        //if (values.length === 1) value=parseInt(values[0]);
        cursor.y-=value;
        if (cursor.y < 0) cursor.y=0;
			}     
			
			function moveDown(values) {
        var value = 1;
        //if (values.length === 1) value=parseInt(values[0]);
        cursor.y+=value;
        if (cursor.y >= display.height) cursor.y=display.height-1;
			}     

			function moveBackward(values) {
        var value = 1;
        //if (values.length === 1) value=parseInt(values[0]);
        cursor.x-=value;
        if (cursor.x < 0) cursor.x=0;
			}     
			
			function moveForward(values) {
        var value = 1;
        //if (values.length === 1) value=parseInt(values[0]); 
        cursor.x+=value;
        if (cursor.x >= display.width) cursor.x=display.width-1;
			}     

			function backSpace() {
				moveBackward([]);
			  self.setChar(" ");	
			}	
			
     function handleSequence (sequence) {
       var t=sequence.substr(-1);
       if (sequence[0]==="[") {
         var core = sequence.substr(1,sequence.length-1);
         //console.log("core "+core);
         var values = core.split(";");
         switch (t) {
           case "m": setAttr(values);
           break;
           case "K": clearLine(values);
           break;
           case "A": moveUp(values);
           break;
           case "B": moveDown(values);
           break;
           case "C": moveForward(values);
           break;
           case "D": moveBackward(values);
           break;
         }
       }
     }
     
     while (data.length >0) {
       var c = data[0];
       var charCode=c.charCodeAt(0);
       var len=1;
       
       //console.log(c.charCodeAt(0));
       if (charCode===27) {
         //escape sequence
         var escape_sequence ="";
         var terminator="";
         var firstChar=data.charAt(len);
         var terminatorTest = function(t){return (/[a-zA-Z]/.test(t));};
         if (firstChar=="]") terminatorTest = function(t){return (/[\x07]/.test(t));};
         do {
           terminator = data.charAt(len);
           escape_sequence+=terminator;
           len+=1;
         } while ( (len < data.length) && !terminatorTest(terminator));
         //console.log("escape sequence "+escape_sequence);
         handleSequence(escape_sequence);         
       }
       else {
            switch (charCode) {
            case 10:  lineFeed();
            break;
            case 13: cursor.x=0;
            break;
            case 8: backSpace();
            break;
            case 7: //bell();
            break;
            default:
             this.setChar(c);
             advanceChar();
            }
       }    
       data=data.substr(len);
       
     }
        
     
     for (var i=0; i<data.length;i++) {
        this.setChar(data.charAt(i));
     }

     //console.log("end:"+JSON.stringify(cursor));
    
     var cursorCell=display.getCell(cursor.x,cursor.y);
     cursorCell.dataset.cursor=cursor.type;
     
     
  }
  
  var terminalCodes = {
   8:"\x08",9:"\x09",13:"\x0d",16:"",17:"",18:"",19:"",20:"",27:"\x1b",
   32:" ",33:"",34:"\x1b[6~",35:"\x1b[8~",36:"\x1b[7~",37:"\x1b[D",38:"\x1b[A",39:"\x1b[C",40:"\x1b[B",45:"\x1b[2~",46:"\x1b[3",
   48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:";",61:"=",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",
   91:"",93:"Right Click",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",
   112:"\x1bOP",113:"\x1bOQ",114:"\x1bOR",115:"\x1bOS",116:"\x1b15~",117:"\x1b17~",118:"\x1b18~",119:"\x1b19~",120:"\x1b20~",121:"\x1b21~",122:"\x1b22~",123:"\x1b23~",
   144:"",145:"",173:"-",
   182:"",183:"",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"};


  
  Terminal.terminalCodeFromKeyCode = function (keyCode) {
    return terminalCodes[keyCode];
  }
  
  return Terminal;  
}();

