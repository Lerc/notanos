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
	
	return Api;
}();
