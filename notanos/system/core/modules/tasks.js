(function() {
	var Module = {name:"tasks" };
	var ResourceIdCounter =1;
	var allTasks = [];
	
	function Task() {
		allTasks.push(this);
		this.resources = Object.extended();
	}
	
	Task.prototype.createResource = function(name) {
			function Resource(task) {
				this.task=task;
				this.resourceId=(ResourceIdCounter.toString(16));
				ResourceIdCounter++;
			}
			Resource.prototype.free = function () {
				if (this.destructor) {
					this.destructor();
				}
				delete this.task.resources[this.resourceId];
			}
			Resource.prototype.encapsulate = function (content) {
				//content is an object with a destroy() method
			  this.destructor = function () {content.destroy()};	
			}
			
			var result = new Resource(this);
			if (name) result.name=name;//name is only for debug info
			this.resources[result.resourceId]=result;
			return result;
	} 
	
	Task.prototype.freeResources = function() {
		 this.resources.values(function(value){value.free()});
	}
	Task.prototype.kill = function() {
		this.killed=true;
		this.destroy();
	}
	Task.prototype.destroy = function() {
		console.log("task destroyed");
	  this.freeResources();	
	  allTasks.remove(this);
	  this.dead = true;
	}
	
	Task.prototype.createTask = function () {
		 var result = new Task();
		 var taskResource = this.createResource("task");
		 taskResource.encapsulate(result);
		 taskResource.destructor = function () {result.destroy};
		 return result;
	}
	
	Module.primaryTask = function () {
		if (allTasks.length==0)	new Task();
		return allTasks[0];
	}	
	
  return Module;
}());
