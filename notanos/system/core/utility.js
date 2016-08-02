//This provides a set of general utility classes.
//class Utility provides miscelaneous stateless functions
//class FifoBuffer is a buffer of bytes in a fifo
var Utility = function () {
	var Api={};
	
	function spanify(value) {
		if (value && typeof value === "object") {
			var result = "";
			for (k in value) {
				if (Object.prototype.hasOwnProperty.call(value, k)) {
					result+= '<span class="'+k+'">'+spanify(value[k])+'</span>';
				}
			}
			return result;
		}
		if (value) return String(value);
	}
	
	Api.spanify = function (value,className) {
		if (className) {
			wrap = {};
			wrap[className]=value;
			value = wrap;
		}
		return spanify(value);
	}

	/* UTF-8 array to DOMString and vice versa */
	// from  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
	Api.UTF8ArrToStr =function(arrayOfBytes) {
		  var aBytes=new Uint8Array(arrayOfBytes);
			var sView = "";

			for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
					nPart = aBytes[nIdx];
					sView += String.fromCharCode(
						nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
							/* (nPart - 252 << 32) is not possible in ECMAScript! So...: */
							(nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
							(nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
							(nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
							(nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
							(nPart - 192 << 6) + aBytes[++nIdx] - 128
						: /* nPart < 127 ? */ /* one byte */
							nPart
					);
				}

			return sView;
	}

	Api.strToUTF8Arr=function(sDOMStr) {

		var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;

		/* mapping... */

		for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
			nChr = sDOMStr.charCodeAt(nMapIdx);
			nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
		}

		aBytes = new Uint8Array(nArrLen);

		/* transcription... */

		for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
			nChr = sDOMStr.charCodeAt(nChrIdx);
			if (nChr < 128) {
				/* one byte */
				aBytes[nIdx++] = nChr;
			} else if (nChr < 0x800) {
				/* two bytes */
				aBytes[nIdx++] = 192 + (nChr >>> 6);
				aBytes[nIdx++] = 128 + (nChr & 63);
			} else if (nChr < 0x10000) {
				/* three bytes */
				aBytes[nIdx++] = 224 + (nChr >>> 12);
				aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
				aBytes[nIdx++] = 128 + (nChr & 63);
			} else if (nChr < 0x200000) {
				/* four bytes */
				aBytes[nIdx++] = 240 + (nChr >>> 18);
				aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
				aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
				aBytes[nIdx++] = 128 + (nChr & 63);
			} else if (nChr < 0x4000000) {
				/* five bytes */
				aBytes[nIdx++] = 248 + (nChr >>> 24);
				aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
				aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
				aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
				aBytes[nIdx++] = 128 + (nChr & 63);
			} else /* if (nChr <= 0x7fffffff) */ {
				/* six bytes */
				aBytes[nIdx++] = 252 + /* (nChr >>> 32) is not possible in ECMAScript! So...: */ (nChr / 1073741824);
				aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
				aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
				aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
				aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
				aBytes[nIdx++] = 128 + (nChr & 63);
			}
		}

		return aBytes;

	}
	return Api;
}();

var Path = function() {
    var API={};
    API.normalise = function (path) {
      if (path[0]=="~") path=sys.environment.HOME+'/'+path.from(1);
      var parts=path.split("/");
      var result=[];
      for (var i=0; i< parts.length;i++) {
        var part=parts[i];
        switch (part) {
            case "..": 
                result.pop();
                break;
            case ".","": 
                break;
            default:
                result.push(part);
        }                
      }
      return path[0]=='/'?'/'+result.join('/'):result.join('/');
    }
    API.normalize = API.normalise;

    API.dirname = function (path) {
        return path.to(path.lastIndexOf("/"));
    }
    
    API.basename = function (path,ext) {
        var filename = path.from(path.lastIndexOf("/")+1);
        if (ext) {
          filename= filename.to(fileName,lastIndexOf(ext));
        }
        return filename;
    }
    
    API.extname = function (path) {
        var pos=path.lastIndexOf(".");
        if (pos < 0) return "";
        return path.from(pos);    
    }
    
    return API;
}();

var FifoBuffer = function () {

    function FifoBuffer() {
        this.length=0;
        this.head=0;
        this.tail=0;
        this.granularity=16384;
        this.advance=1024;
        this.bytes=new Uint8Array(0);
    };

    
    FifoBuffer.prototype.clear = function() {
        this.length=0;
        this.head=0;
        this.tail=0;
    }
    
    FifoBuffer.prototype.add = function(data) {
        var newData=new Uint8Array(data);
        var requiredLength=this.head+newData.byteLength;
        if (requiredLength > this.bytes.length) {
            var newSize=this.tail+this.length+newData.byteLength+this.advance;            
            newSize=Math.ceil(newSize/this.granularity)*this.granularity;
            var newBuffer=new Uint8Array(newSize);
            var existingData=this.bytes.subarray(this.tail,this.tail+this.length);
            newBuffer.set(existingData);
            this.bytes=newBuffer;
            this.tail=0;
            this.head=this.length;
				}
        this.bytes.set(newData,this.head);
        this.head+=newData.byteLength;
        this.length+=newData.byteLength;
        
    }
    
    FifoBuffer.prototype.disposeBytes = function(dataLength) {
        this.tail+=dataLength;
        this.length-=dataLength;
        if ( (this.length<0) || ( (this.head-this.tail) != this.length) ) {
            throw new Error("FifoBuffer underrun");
        }
        if (this.length===0) {
          this.head=0;
          this.tail=0;
        }
    }

    FifoBuffer.prototype.peek = function (maxLength) {
        if (!maxLength) maxlength=this.length;
        var resultLength = Math.min(maxLength,this.length);
        return this.bytes.subarray(this.tail,this.tail+resultLength);
    }
    
    FifoBuffer.prototype.find = function (value) {
      for (var i=this.tail; i<this.head; i++) {
        if (this.bytes[i]==value) return (i-this.tail)
      }
      return -1;
    }
    
    return FifoBuffer;

}();

var CustomEvents=(function() {
	var API = {};
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
	
		function reactsTo(type) {
        if (!this) return false;
        if (!this.attachedEvents) return false;        
        if (!this.attachedEvents[type]) return false; 			
        return this.attachedEvents[type].length !==0;
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
        classConstructor.prototype.reactsTo=reactsTo;
    }
    
    function CustomEventEmitter() {
    
    }

    API.makeEventEmitter= function () {
        return new CustomEventEmitter();
    }
    API.bindEventsToClass(CustomEventEmitter);
    //API._init_ =function(callback) {  }

		function reportClickAway(element,handler,handlerParameter) {
			// this function calls the handler for the first click that happens to the window
			// but not in the element.  The attached handlers are removed after the click.
			var elementClicked = true;
			
			function elementClick() {
				elementClicked=true;
			}
			
			function windowClick() {
				if (elementClicked === false) {
					removeEvents();
					handler(handlerParameter);
				}
				elementClicked=false;
			}
			function removeEvents() {
					element.removeEventListener("click",elementClick)
					window.removeEventListener("click",windowClick);				
			}
			element.addEventListener("click",elementClick);
			window.addEventListener("click",windowClick);			
			
			return removeEvents;
		}
    
    API.reportClickAway = reportClickAway;
    
  return API;
}());

