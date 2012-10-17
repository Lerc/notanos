var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var ParticleSystem = $hxClasses["ParticleSystem"] = function(ix,iy,count) {
	if(ParticleSystem.angleTable == null) this.initTable();
	this.liveParticles = new List();
	this.spareParticles = new List();
	this.initialX = ix;
	this.initialY = iy;
	var _g = 1;
	while(_g < count) {
		var p = _g++;
		this.addParticle();
	}
};
ParticleSystem.__name__ = ["ParticleSystem"];
ParticleSystem.angleTable = null;
ParticleSystem.prototype = {
	draw: function() {
		var c = ShowRunner.canvas;
		c.ctx.globalCompositeOperation = "lighter";
		var $it0 = this.liveParticles.iterator();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			c.drawSprite(p.sprite,p.x,p.y);
		}
		c.ctx.globalCompositeOperation = "source-over";
	}
	,move: function() {
		var $it0 = this.liveParticles.iterator();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			if(p.timeToLive > 0) {
				p.x += p.dx;
				p.y += p.dy;
				p.dx *= 0.98;
				p.dy *= 0.98;
				p.timeToLive--;
			} else {
				this.liveParticles.remove(p);
				this.spareParticles.push(p);
			}
		}
	}
	,addParticle: function() {
		var v = ParticleSystem.angleTable[Math.floor(Math.random() * ParticleSystem.angleTable.length)];
		var p = { x : this.initialX, y : this.initialY, dx : v.dx * 4, dy : v.dy * 4, sprite : Media.dot, timeToLive : Math.floor(100 + Math.random() * 100)};
		this.liveParticles.add(p);
	}
	,initTable: function() {
		ParticleSystem.angleTable = new Array();
		var angleToRadians = Math.PI * 2 / 1024;
		var _g = 0;
		while(_g < 1023) {
			var i = _g++;
			var r = i * angleToRadians;
			ParticleSystem.angleTable.push({ dx : Math.sin(r), dy : Math.cos(r)});
		}
	}
	,spareParticles: null
	,liveParticles: null
	,initialY: null
	,initialX: null
	,__class__: ParticleSystem
}
var Boom = $hxClasses["Boom"] = function(ix,iy,count) {
	if(count == null) count = 25;
	ParticleSystem.call(this,ix,iy,count);
};
Boom.__name__ = ["Boom"];
Boom.__super__ = ParticleSystem;
Boom.prototype = $extend(ParticleSystem.prototype,{
	move: function() {
		var $it0 = this.liveParticles.iterator();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			if(p.timeToLive > 0) {
				p.x += p.dx;
				p.y += p.dy;
				p.dx *= 0.98;
				p.dy *= 0.98;
				var scatter = 8 / (p.timeToLive / 2);
				p.dy += (Math.random() - 0.5) * scatter;
				p.dx += (Math.random() - 0.5) * scatter;
				var frame = 4 - (p.timeToLive >> 4);
				if(frame < 0) frame = 0;
				p.sprite = Media.dots[frame];
				p.timeToLive--;
			} else {
				this.liveParticles.remove(p);
				this.spareParticles.push(p);
			}
		}
	}
	,addParticle: function() {
		var v = ParticleSystem.angleTable[Math.floor(Math.random() * ParticleSystem.angleTable.length)];
		var p = { x : this.initialX, y : this.initialY, dx : v.dx * Math.random() * 4, dy : v.dy * Math.random() * 4, sprite : Media.dot, timeToLive : Math.floor(20 + Math.random() * 120)};
		this.liveParticles.add(p);
	}
	,__class__: Boom
});
var GameEntity = $hxClasses["GameEntity"] = function() {
};
GameEntity.__name__ = ["GameEntity"];
GameEntity.prototype = {
	distance: function(other) {
		var l2 = this.distanceSquared(other);
		if(l2 == 0) return 0;
		return Math.sqrt(l2);
	}
	,distanceSquared: function(other) {
		var dx = this.x - other.x;
		var dy = this.y - other.y;
		return dx * dx + dy * dy;
	}
	,free: function() {
		HxOverrides.remove(ShowRunner.world.entities,this);
	}
	,draw: function() {
	}
	,move: function() {
	}
	,y: null
	,x: null
	,__class__: GameEntity
}
var Gibs = $hxClasses["Gibs"] = function(ix,iy,count) {
	if(count == null) count = 300;
	ParticleSystem.call(this,ix,iy,count);
};
Gibs.__name__ = ["Gibs"];
Gibs.__super__ = ParticleSystem;
Gibs.prototype = $extend(ParticleSystem.prototype,{
	move: function() {
		var $it0 = this.liveParticles.iterator();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			if(p.timeToLive > 0) {
				p.x += p.dx;
				p.y += p.dy;
				p.dx *= 0.99;
				p.dy += 0.1;
				p.dy *= 0.99;
				var scatter = 8 / (p.timeToLive / 2);
				p.dy += (Math.random() - 0.5) * scatter;
				p.dx += (Math.random() - 0.5) * scatter;
				var frame = 4 - (p.timeToLive >> 4);
				if(frame < 0) frame = 0;
				p.sprite = Media.gibs[frame];
				p.timeToLive--;
			} else {
				this.liveParticles.remove(p);
				this.spareParticles.push(p);
			}
		}
	}
	,addParticle: function() {
		var v = ParticleSystem.angleTable[Math.floor(Math.random() * ParticleSystem.angleTable.length)];
		var force = Math.random() * 2;
		var p = { x : this.initialX, y : this.initialY, dx : v.dx * force, dy : -Math.abs(v.dy * force * 2), sprite : Media.dot, timeToLive : Math.floor(20 + Math.random() * 120)};
		this.liveParticles.add(p);
	}
	,__class__: Gibs
});
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var ImageLoader = $hxClasses["ImageLoader"] = function() {
	this.imagesPending = new Array();
};
ImageLoader.__name__ = ["ImageLoader"];
ImageLoader.prototype = {
	isWaiting: function() {
		return this.imagesPending.length > 0;
	}
	,handleLoad: function(e) {
		var S = e.target;
		HxOverrides.remove(this.imagesPending,S);
		if(S.handleX == null) S.handleX = S.width / 2;
		if(S.handleY == null) S.handleY = S.height / 2;
	}
	,loadImage: function(name,handleX,handleY,additive) {
		if(additive == null) additive = false;
		var newimage = js.Lib.document.createElement("img");
		var I = newimage;
		var S = I;
		S.handleX = handleX;
		S.handleY = handleY;
		I.onload = $bind(this,this.handleLoad);
		I.src = name;
		this.imagesPending.push(S);
		return S;
	}
	,imagesPending: null
	,__class__: ImageLoader
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var JsCanvas = $hxClasses["JsCanvas"] = function(canvas) {
	this.ctx = canvas.getContext("2d");
};
JsCanvas.__name__ = ["JsCanvas"];
JsCanvas.COL = function(color) {
	return "rgb(" + (color >> 16) + "," + (color >> 8 & 255) + "," + (color & 255) + ")";
}
JsCanvas.prototype = {
	drawSprite: function(image,dx,dy) {
		this.ctx.drawImage(image,dx - image.handleX | 0,dy - image.handleY | 0);
	}
	,drawImage: function(image,dx,dy) {
		this.ctx.drawImage(image,dx,dy);
	}
	,drawLine: function(x1,y1,x2,y2) {
		this.ctx.beginPath();
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		this.ctx.stroke();
	}
	,lineTo: function(x,y) {
		this.ctx.lineTo(x,y);
	}
	,moveTo: function(x,y) {
		this.ctx.moveTo(x,y);
	}
	,fillRect: function(x,y,w,h) {
		this.ctx.fillRect(x,y,w,h);
	}
	,drawRect: function(x,y,w,h) {
		this.ctx.rect(x,y,w,h);
	}
	,fillCircle: function(x,y,radius) {
		this.ctx.beginPath();
		this.ctx.arc(x,y,radius,0,6.29,true);
		this.ctx.fill();
	}
	,drawCircle: function(x,y,radius) {
		this.ctx.beginPath();
		this.ctx.arc(x,y,radius,0,6.29,true);
		this.ctx.stroke();
	}
	,endFill: function() {
		this.ctx.fill();
		this.ctx.stroke();
	}
	,beginFill: function(color,alpha) {
		this.ctx.fillStyle = "rgb(" + (color >> 16) + "," + (color >> 8 & 255) + "," + (color & 255) + ")";
		this.ctx.beginPath();
	}
	,fillStyle: function(color) {
		this.ctx.fillStyle = "rgb(" + (color >> 16) + "," + (color >> 8 & 255) + "," + (color & 255) + ")";
	}
	,lineStyle: function(width,color) {
		if(width == null) return;
		this.ctx.lineWidth = width;
		this.ctx.strokeStyle = "rgb(" + (color >> 16) + "," + (color >> 8 & 255) + "," + (color & 255) + ")";
	}
	,clear: function() {
		this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	}
	,normal: function() {
		this.ctx.globalCompositeOperation = "source-over";
	}
	,add: function() {
		this.ctx.globalCompositeOperation = "lighter";
	}
	,ctx: null
	,__class__: JsCanvas
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Main = $hxClasses["Main"] = function() { }
Main.__name__ = ["Main"];
Main.main = function() {
	var thing = new ShowRunner("main");
}
var Media = $hxClasses["Media"] = function() {
	var l = ShowRunner.imageLoader;
	Media.fredleft = new Array();
	Media.fredright = new Array();
	var _g = 1;
	while(_g < 9) {
		var i = _g++;
		Media.fredleft.push(l.loadImage("fred0" + i + ".png",32,72));
		Media.fredright.push(l.loadImage("fred0" + i + "r.png",32,72));
	}
	Media.gum = new Array();
	var _g = 1;
	while(_g < 13) {
		var i = _g++;
		Media.gum.push(l.loadImage("gum" + i + ".png"));
	}
	Media.dots = new Array();
	Media.gibs = new Array();
	var _g = 1;
	while(_g < 6) {
		var i = _g++;
		Media.dots.push(l.loadImage("dot" + i + ".png"));
		Media.gibs.push(l.loadImage("gib" + i + ".png"));
	}
	Media.flowers = new Array();
	var _g = 1;
	while(_g < 6) {
		var i = _g++;
		Media.flowers.push(l.loadImage("flower" + i + ".png"));
	}
	Media.waspleft = new Array();
	Media.waspright = new Array();
	var _g = 1;
	while(_g < 3) {
		var i = _g++;
		Media.waspleft.push(l.loadImage("waspl" + i + ".png"));
		Media.waspright.push(l.loadImage("waspr" + i + ".png"));
	}
	Media.platform1 = l.loadImage("platform1.png",163,125);
	Media.platform2 = l.loadImage("platform2.png",319,65);
	Media.platform3 = l.loadImage("platform3.png",50,5);
	Media.platform2_tree = l.loadImage("platform2_tree.png",300,250);
	Media.dot = l.loadImage("dot1.png");
	Media.wtf = l.loadImage("wtf.png");
	Media.spring = l.loadImage("spring.png");
	Media.waspdead = l.loadImage("waspdead.png");
	Media.movingplatform = l.loadImage("movingplatform.png",33,0);
	Media.backdrop = l.loadImage("spacebackdrop.jpg");
};
Media.__name__ = ["Media"];
Media.platform1 = null;
Media.platform2 = null;
Media.platform3 = null;
Media.platform2_tree = null;
Media.fredleft = null;
Media.fredright = null;
Media.gum = null;
Media.flowers = null;
Media.dots = null;
Media.gibs = null;
Media.waspleft = null;
Media.waspright = null;
Media.waspdead = null;
Media.dot = null;
Media.wtf = null;
Media.spring = null;
Media.movingplatform = null;
Media.backdrop = null;
Media.prototype = {
	__class__: Media
}
var Platform = $hxClasses["Platform"] = function() {
	GameEntity.call(this);
	this.ground = new Array();
	var _g = 0;
	while(_g < 320) {
		var i = _g++;
		this.ground.push(-5 + Math.sin(3.2 + i / 100) * 15);
	}
	this.sprite = Media.platform1;
};
Platform.__name__ = ["Platform"];
Platform.__super__ = GameEntity;
Platform.prototype = $extend(GameEntity.prototype,{
	draw: function() {
		var C = ShowRunner.canvas;
		C.drawSprite(this.sprite,this.x,this.y);
		return;
		var width = this.ground.length;
		var left = Math.floor(this.x - width / 2);
		var _g1 = left, _g = left + width;
		while(_g1 < _g) {
			var tx = _g1++;
			if((tx & 15) == 0) {
				C.ctx.beginPath();
				C.ctx.moveTo(tx,this.y);
				C.ctx.lineTo(tx,this.findFloor(tx));
				C.ctx.stroke();
			}
		}
		C.ctx.beginPath();
		C.ctx.moveTo(this.x - this.sprite.width / 2,this.y);
		C.ctx.lineTo(this.x + this.sprite.width / 2,this.y);
		C.ctx.stroke();
	}
	,findFloor: function(px) {
		var localx = px - this.x;
		var index = Math.floor(localx + this.ground.length / 2);
		if(index < 0) return null;
		if(index >= this.ground.length) return null;
		return this.y + this.ground[index];
	}
	,sprite: null
	,ground: null
	,__class__: Platform
});
var MovingPlatform = $hxClasses["MovingPlatform"] = function() {
	Platform.call(this);
	this.dx = -2;
	this.ground = new Array();
	var _g = 0;
	while(_g < 72) {
		var i = _g++;
		this.ground.push(2);
	}
	this.sprite = Media.movingplatform;
};
MovingPlatform.__name__ = ["MovingPlatform"];
MovingPlatform.__super__ = Platform;
MovingPlatform.prototype = $extend(Platform.prototype,{
	move: function() {
		if(this.leftLimit == null) {
			this.leftLimit = this.x - 200;
			this.rightLimit = this.x + 200;
		}
		if(this.x <= this.leftLimit) this.dx = 2;
		if(this.x >= this.rightLimit) this.dx = -2;
		this.x += this.dx;
		var player = ShowRunner.world.player;
		if(player.terrain == this && player.onFloor) player.x += this.dx;
	}
	,dx: null
	,rightLimit: null
	,leftLimit: null
	,__class__: MovingPlatform
});
var Pickup = $hxClasses["Pickup"] = function() {
	GameEntity.call(this);
	this.anim = Media.gum;
	this.frame = 0;
	this.frametrans = [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,2,2,2,2,3,3,3,4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,4,4,4,3,3,3,2,2,2,2,1,1,1,1,1,1,1,0,0,0,0,0];
};
Pickup.__name__ = ["Pickup"];
Pickup.__super__ = GameEntity;
Pickup.prototype = $extend(GameEntity.prototype,{
	draw: function() {
		var C = ShowRunner.canvas;
		C.drawSprite(this.anim[this.frametrans[this.frame]],this.x,this.y);
	}
	,move: function() {
		this.frame++;
		if(this.frame >= this.frametrans.length) this.frame = 0;
		var world = ShowRunner.world;
		if(this.distance(world.player) < 32) {
			world.particles.push(new Boom(this.x,this.y));
			HxOverrides.remove(ShowRunner.world.entities,this);
		}
	}
	,age: null
	,frametrans: null
	,frame: null
	,anim: null
	,__class__: Pickup
});
var Platform1 = $hxClasses["Platform1"] = function() {
	Platform.call(this);
	this.ground = new Array();
	var _g = 0;
	while(_g < 320) {
		var i = _g++;
		this.ground.push(-5 + Math.sin(3.2 + i / 100) * 15);
	}
	this.sprite = Media.platform1;
};
Platform1.__name__ = ["Platform1"];
Platform1.__super__ = Platform;
Platform1.prototype = $extend(Platform.prototype,{
	__class__: Platform1
});
var Platform2 = $hxClasses["Platform2"] = function() {
	Platform.call(this);
	this.ground = new Array();
	var _g = 0;
	while(_g < 630) {
		var i = _g++;
		this.ground.push(-5 + Math.sin(3.2 + i / 200) * 40);
	}
	this.sprite = Media.platform2;
};
Platform2.__name__ = ["Platform2"];
Platform2.__super__ = Platform;
Platform2.prototype = $extend(Platform.prototype,{
	__class__: Platform2
});
var Platform3 = $hxClasses["Platform3"] = function() {
	Platform.call(this);
	this.ground = new Array();
	var _g = 0;
	while(_g < 95) {
		var i = _g++;
		this.ground.push(-2 + Math.sin(3.2 + i / 50) * 5);
	}
	this.sprite = Media.platform3;
};
Platform3.__name__ = ["Platform3"];
Platform3.__super__ = Platform;
Platform3.prototype = $extend(Platform.prototype,{
	__class__: Platform3
});
var Player = $hxClasses["Player"] = function() {
	GameEntity.call(this);
	this.reset();
};
Player.__name__ = ["Player"];
Player.__super__ = GameEntity;
Player.prototype = $extend(GameEntity.prototype,{
	die: function() {
		if(this.dead) return;
		this.dead = true;
		ShowRunner.world.particles.push(new Gibs(this.x,this.y - 8));
		ShowRunner.world.particles.push(new Gibs(this.x,this.y - 24));
		ShowRunner.world.particles.push(new Gibs(this.x,this.y - 40));
	}
	,draw: function() {
		if(this.dead) return;
		ShowRunner.canvas.drawSprite(this.walkanim[this.frame],this.x,this.y);
	}
	,move: function() {
		if(this.dy > 50) this.dead = true;
		if(this.dead) {
			this.reset();
			return;
		}
		if(this.y > 10000) {
			this.reset();
			return;
		}
		var walking = false;
		this.y += this.dy;
		if(ShowRunner.input.keyIsDown(39)) {
			this.x += this.walkspeed;
			this.walkanim = Media.fredright;
			walking = true;
		}
		if(ShowRunner.input.keyIsDown(37)) {
			this.x -= this.walkspeed;
			this.walkanim = Media.fredleft;
			walking = true;
		}
		if(!this.onFloor) walking = false;
		if(walking) {
			if(this.frametick-- <= 0) {
				this.frametick = 2;
				this.frame++;
				if(this.frame >= this.walkanim.length) this.frame = 0;
			}
		} else {
			this.frametick = 1;
			this.frame = this.onFloor?2:4;
		}
		if(this.terrain != null) {
			var floor = this.terrain.findFloor(this.x);
			if(this.onFloor) {
				if(floor == null) this.onFloor = false; else this.y = floor;
			} else if(floor == null) this.onFloor = false; else if(this.y >= floor) {
				this.dy = 0;
				this.y = floor;
				this.onFloor = true;
			}
		}
		if(this.onFloor) {
			if(ShowRunner.input.keyWentDown(32)) {
				this.dy = -12;
				this.onFloor = false;
			}
		} else {
			this.terrain = ShowRunner.world.platformUnder(this.x,this.y);
			this.dy += 0.55;
		}
	}
	,reset: function() {
		this.x = 400;
		this.y = 220;
		this.dy = 0;
		this.walkspeed = 4;
		this.walkanim = Media.fredleft;
		this.dead = false;
		this.onFloor = false;
	}
	,walkspeed: null
	,terrain: null
	,onFloor: null
	,dy: null
	,frame: null
	,frametick: null
	,walkanim: null
	,dead: null
	,__class__: Player
});
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var ShowRunner = $hxClasses["ShowRunner"] = function(TargetDiv) {
	ShowRunner.world = this;
	this.canvasElement = js.Lib.document.getElementById("MainFrame");
	ShowRunner.canvas = new JsCanvas(this.canvasElement);
	this.entities = new Array();
	this.scenery_back = new Array();
	this.scenery_fore = new Array();
	this.particles = new List();
	this.platforms = new Array();
	ShowRunner.imageLoader = new ImageLoader();
	new Media();
	this.timer = new FrameTimer(60,$bind(this,this.move),$bind(this,this.draw));
	ShowRunner.input = new InputManager();
	this.addPlatform(Platform1,500,240);
	this.addPlatform(Platform2,0,190);
	this.addPlatform(Platform2,850,100);
	this.addPlatform(MovingPlatform,1400,200);
	this.addPlatform(Platform2,2050,150);
	this.addPlatform(Platform3,2500,190);
	this.addPickup(2600,100);
	this.addPickup(2650,70);
	this.addPickup(2700,100);
	var spring = new Spring();
	spring.x = 930;
	spring.y = 45;
	this.entities.push(spring);
	this.addPlatform(Platform3,800,300);
	this.addPlatform(Platform3,950,400);
	this.addPlatform(Platform3,1100,500);
	this.addPlatform(Platform2,1300,900);
	this.addPlatform(Platform2,600,850);
	this.addPlatform(Platform1,1400,600);
	var spring1 = new Spring();
	spring1.x = 1750;
	spring1.y = 684;
	this.entities.push(spring1);
	this.addPlatform(Platform3,1900,600);
	this.addPlatform(Platform3,1780,700);
	this.addPlatform(Platform3,1650,800);
	this.addPlatform(Platform2,2400,550);
	this.addPlatform(Platform2,3050,420);
	this.addPlatform(Platform1,3000,165);
	this.addPlatform(Platform3,3300,260);
	this.addPlatform(MovingPlatform,3520,300);
	this.addPlatform(Platform1,4000,250);
	this.addPlatform(Platform2,4600,400);
	this.addPlatform(Platform2,5300,600);
	this.addPlatform(Platform3,4800,700);
	this.scenery_fore.push(new StaticScenery(5300,600));
	this.addPlatform(Platform3,4500,900);
	this.addPlatform(Platform3,4650,1200);
	this.addPlatform(Platform3,3500,900);
	this.addEntity(Spring,4650,1184);
	var p = this.addPlatform(MovingPlatform,4000,850);
	p.leftLimit = 3650;
	p.rightLimit = 4350;
	this.addPickup(4000,750);
	this.addPickup(3900,700);
	this.addPickup(3800,750);
	this.addPickup(3700,700);
	this.addPickup(3600,750);
	this.addPickup(3500,700);
	this.addPlatform(Platform1,3100,1050);
	this.addPlatform(Platform2,3500,1400);
	this.scenery_fore.push(new StaticScenery(3500,1400));
	this.addPickup(3600,1330);
	this.addPickup(3675,1340);
	this.addPickup(3750,1360);
	this.addPlatform(Platform2,3000,1600);
	var p1 = this.addPlatform(MovingPlatform,2000,1500);
	p1.leftLimit = 1500;
	p1.rightLimit = 2700;
	this.addPickup(1500,1600);
	this.addPickup(1500,1700);
	this.addPickup(1500,1800);
	this.addPickup(1500,1900);
	this.addPlatform(Platform3,1500,2100);
	this.addPlatform(Platform2,800,1950);
	this.addPlatform(Platform3,950,2150);
	this.addPlatform(Platform3,800,2400);
	this.addEntity(Spring,800,2384);
	this.addPlatform(Platform3,1700,2250);
	this.addPlatform(Platform3,1500,2400);
	var p2 = this.addPlatform(MovingPlatform,1000,2300);
	p2.leftLimit = 830;
	p2.rightLimit = 1400;
	var p3 = this.addPlatform(MovingPlatform,600,2100);
	p3.leftLimit = 600;
	p3.rightLimit = 850;
	this.addPlatform(Platform3,575,2000);
	this.addPickup(650,2080);
	this.addPickup(700,2080);
	this.addPickup(750,2080);
	this.addPickup(800,2080);
	this.addPickup(850,2080);
	this.addPickup(900,2080);
	this.addPlatform(Platform2,400,1800);
	this.addEntity(Spring,200,1750);
	this.addPlatform(Platform1,300,1500);
	this.addPickup(250,1470);
	this.addPickup(300,1470);
	this.addPickup(350,1470);
	this.addPickup(400,1470);
	this.addEntity(Spring,200,1480);
	this.addPlatform(Platform3,200,1290);
	this.addEntity(Spring,200,1274);
	this.addPlatform(Platform2,400,1100);
	this.addPlatform(Platform3,800,970);
	this.addPickup(800,940);
	this.platforms.sort(function(A,B) {
		return Math.floor(A.y - B.y);
	});
	this.addPickup(500,200);
	this.addPickup(550,200);
	this.addPickup(750,50);
	this.addPickup(340,820);
	this.addPickup(320,790);
	this.addPickup(360,790);
	this.addPickup(300,760);
	this.addPickup(340,760);
	this.addPickup(380,760);
	this.addPickup(824,-112);
	this.addPickup(824,-112);
	this.addPickup(824,-112);
	this.scenery_fore.push(new StaticScenery(850,100));
	this.scenery_fore.push(new StaticScenery(230,170,Media.flowers[4]));
	this.scenery_back.push(new StaticScenery(250,150,Media.flowers[1]));
	this.scenery_back.push(new StaticScenery(170,140,Media.flowers[3]));
	var _g = 0;
	while(_g < 7) {
		var i = _g++;
		var wasp = new Wasp();
		wasp.x = Math.random() * 4600;
		wasp.y = Math.random() * 2000;
		this.entities.push(wasp);
	}
	this.player = new Player();
	this.entities.push(this.player);
	this.cameraX = this.player.x;
	this.cameraY = this.player.y;
};
ShowRunner.__name__ = ["ShowRunner"];
ShowRunner.world = null;
ShowRunner.canvas = null;
ShowRunner.input = null;
ShowRunner.imageLoader = null;
ShowRunner.prototype = {
	draw: function() {
		if(ShowRunner.imageLoader.isWaiting()) return;
		ShowRunner.canvas.ctx.save();
		ShowRunner.canvas.ctx.drawImage(Media.backdrop,0,0);
		if(this.player.terrain != null || this.player.dy < 16) {
			this.cameraX = this.player.x;
			this.cameraY = this.player.y;
		}
		ShowRunner.canvas.ctx.translate(400 - this.cameraX,240 - this.cameraY);
		var _g = 0, _g1 = this.platforms;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			e.draw();
		}
		var _g = 0, _g1 = this.scenery_back;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			e.draw();
		}
		var _g = 0, _g1 = this.entities;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			e.draw();
		}
		var _g = 0, _g1 = this.scenery_fore;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			e.draw();
		}
		var $it0 = this.particles.iterator();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			p.draw();
		}
		ShowRunner.canvas.ctx.restore();
	}
	,move: function() {
		if(ShowRunner.imageLoader.isWaiting()) return;
		ShowRunner.input.cycle();
		this.tx += 2;
		this.ty += 1;
		var _g = 0, _g1 = this.platforms;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			e.move();
		}
		var _g = 0, _g1 = this.entities;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			e.move();
		}
		var $it0 = this.particles.iterator();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			p.move();
			if(p.liveParticles.length == 0) this.particles.remove(p);
		}
		if(ShowRunner.input.keyWentDown(90)) console.log("......     x:" + Math.floor(this.cameraX) + "      y:" + Math.floor(this.cameraY));
	}
	,platformUnder: function(tx,ty) {
		var _g = 0, _g1 = this.platforms;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(ty < p.y) {
				var floor = p.findFloor(tx);
				if(floor != null) {
					if(floor > ty) return p;
				}
			}
		}
		return null;
	}
	,addEntity: function(kind,x,y) {
		var e = Type.createInstance(kind,[]);
		e.x = x;
		e.y = y;
		this.entities.push(e);
		return e;
	}
	,addPlatform: function(Kind,x,y) {
		var platform = Type.createInstance(Kind,[]);
		this.platforms.push(platform);
		platform.x = x;
		platform.y = y;
		return platform;
	}
	,addPickup: function(x,y) {
		var pickup = new Pickup();
		pickup.x = x;
		pickup.y = y;
		this.entities.push(pickup);
	}
	,particles: null
	,cameraY: null
	,cameraX: null
	,scenery_fore: null
	,scenery_back: null
	,platforms: null
	,entities: null
	,player: null
	,ty: null
	,tx: null
	,canvasElement: null
	,timer: null
	,__class__: ShowRunner
}
var Spring = $hxClasses["Spring"] = function() {
	GameEntity.call(this);
	this.sprite = Media.spring;
};
Spring.__name__ = ["Spring"];
Spring.__super__ = GameEntity;
Spring.prototype = $extend(GameEntity.prototype,{
	draw: function() {
		var C = ShowRunner.canvas;
		C.drawSprite(this.sprite,this.x,this.y);
	}
	,move: function() {
		var player = ShowRunner.world.player;
		if(player.dy <= 0) return;
		if(Math.abs(this.x - player.x) < 24) {
			if(Math.abs(this.y - player.y) < 16) {
				player.onFloor = false;
				player.dy = ShowRunner.input.keyIsDown(32)?-18:-16;
			}
		}
	}
	,sprite: null
	,__class__: Spring
});
var StaticScenery = $hxClasses["StaticScenery"] = function(nx,ny,image) {
	GameEntity.call(this);
	this.x = nx;
	this.y = ny;
	if(image == null) image = Media.platform2_tree;
	this.sprite = image;
};
StaticScenery.__name__ = ["StaticScenery"];
StaticScenery.__super__ = GameEntity;
StaticScenery.prototype = $extend(GameEntity.prototype,{
	draw: function() {
		var C = ShowRunner.canvas;
		C.drawSprite(this.sprite,this.x,this.y);
	}
	,sprite: null
	,__class__: StaticScenery
});
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var Wasp = $hxClasses["Wasp"] = function() {
	GameEntity.call(this);
	this.flap = 0;
	this.dx = 1;
	this.turnCountDown = 100;
	this.anim = Media.waspright;
	this.deadSprite = Media.waspdead;
};
Wasp.__name__ = ["Wasp"];
Wasp.__super__ = GameEntity;
Wasp.prototype = $extend(GameEntity.prototype,{
	draw: function() {
		if(this.dead) ShowRunner.canvas.drawSprite(this.deadSprite,this.x,this.y); else {
			this.flap = 1 - this.flap;
			ShowRunner.canvas.drawSprite(this.anim[this.flap],this.x,this.y);
		}
	}
	,die: function() {
		this.dead = true;
		this.dx = -this.dx * 3;
		this.dy = -5;
	}
	,move: function() {
		if(this.dead) {
			this.x += this.dx;
			this.y += this.dy;
			this.dy += 0.4;
			if(this.dy > 200) HxOverrides.remove(ShowRunner.world.entities,this);
			return;
		}
		if(--this.turnCountDown <= 0) {
			this.turnCountDown = Math.floor(Math.random() * 200 + 30);
			this.dx = -this.dx;
			this.anim = this.dx < 0?Media.waspleft:Media.waspright;
		}
		var player = ShowRunner.world.player;
		if(!player.dead) {
			var d2 = this.distanceSquared(player);
			if(d2 < 2000) {
				if(player.dy > 1) {
					player.dy = -10;
					this.die();
				} else player.die();
			}
			if(d2 < 50000) this.dy += player.y < this.y?-0.05:0.05;
		}
		this.dy = (this.dy + Math.random() - 0.5) * 0.95;
		this.y = this.y + this.dy;
		this.x = this.x + this.dx;
	}
	,deadSprite: null
	,dead: null
	,dy: null
	,dx: null
	,turnCountDown: null
	,anim: null
	,flap: null
	,__class__: Wasp
});
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.Lib.onerror = null;
Main.main();
