(function() {
	var Module = {name:"resources" };
	
	function ResourceWrapper(resource,remover) {
	  this.resource = resource;
	  if(remover) this.remover = remover;
	}

	ResourceWrapper.prototype.remove = function() {
	  if (this.remover) this.remover(this.resource);	
	}
	
	function ResourceList() {
		this.resources = [];
	}	
	
	ResourceList.prototype.add = function (resource,remover) {
		this.resources.push( new ResourceWrapper(resource,remover) );
	}
	
	
  return Module;
}());
