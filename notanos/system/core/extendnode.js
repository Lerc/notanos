Node.prototype.appendNew = function(type,className,id) {
  var result = this.ownerDocument.createElement(type);
  this.appendChild(result);
  if (id) result.id=id;
  if (className) result.className=className;  
  return result;
}

Node.prototype.clear = function() {
	this.innerHTML="";
}

Node.prototype.removeClass = function (classNameToRemove) {
  this.className=this.className.replace(new RegExp('(\\s|^)' + classNameToRemove + '(\\s|$)'), '' );
}

Node.prototype.hasClass = function (className) {
	return this.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

Node.prototype.addClass = function(className) {
	if (!this.hasClass(className)) this.className+=" "+className;
}

Node.prototype.toggleClass = function(className) {
	if (this.hasClass(className)) {
		 removeClass(className);
	} else {
		this.className+=" "+className;
	}
}
