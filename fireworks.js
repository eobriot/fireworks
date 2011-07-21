// Returns a random number between 0 (inclusive) and 1 (exclusive)
function getRandom()
{
  return Math.random();
}
// Returns a random number between min and max
function getRandomArbitary(min, max)
{
  return Math.random() * (max - min) + min;
}
// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_RGB() {
	return 'rgb(' + getRandomInt(0,255) + ','  + getRandomInt(0,255)+ ','  + getRandomInt(0,255) + ')';
}
 
function Firework(x_delta, y_delta, x , y, color, duration) {
	this.x_delta = x_delta;
	this.y_delta = y_delta;
	this.x = x;
	this.y = y;
	this.color = color;
	this.duration = duration;
	this.dirty = false;
}

Firework.prototype.update = function() {
	this.duration--;
			
	this.x = this.x - this.x_delta;
	this.y = this.y - this.y_delta;
	
	if (getRandomInt(0,15) > this.duration) {
		this.y_delta--;
	}
	
	if (this.x < 0 || this.x > 640 || this.y < 0 || this.y > 480 || this.duration < 1) {
		if (this.duration < 1) {
			if (this.y < 220) {
			    flowers.push(new VerticalFlower(this.x, this.y, this.x_delta, get_random_RGB(),getRandomInt(10,15)));			
			} else {
			    flowers.push(new Flower(this.x, this.y, this.x_delta, get_random_RGB(),getRandomInt(10,25)));
			}
		}
		this.dirty = true;
	}
}

function Flower(x, y, dx, color, duration) {
    this.x = x;
    this.y = y;
    this.delta_x = dx;
    this.color = color;
    this.duration = duration;
}

Flower.prototype.draw = function(ctx) {
	ctx.fillStyle=this.color;
	var dist = (20 - this.duration) * 2;
	if (dist < 5) {
		dist = 5;
	}
	ctx.fillRect(this.x - dist, this.y - dist, 5, 5);
	ctx.fillRect(this.x + dist, this.y - dist, 5, 5);
	ctx.fillRect(this.x - dist, this.y + dist, 5, 5);
	ctx.fillRect(this.x + dist, this.y + dist, 5, 5);
	ctx.fillRect(this.x , this.y , 5, 5);
}

Flower.prototype.update = function() {

    this.duration--;
    this.y = this.y + Math.round((10 - this.duration)/2);
    this.x = this.x - this.delta_x;

}

function VerticalFlower(x, y, dx, color, duration) {
    this.x = x;
    this.y = y;
    this.delta_x = dx;
    this.color = color;
    this.duration = duration;
    this.initial_duration = duration;
}

VerticalFlower.prototype = new Flower;

VerticalFlower.prototype.draw = function(ctx) {
	
	ctx.fillStyle = this.color;
	var dist = (20 - this.duration) * 2;
	if (dist < 2) {
		dist = 2;
	} 
	
	ctx.fillRect(this.x - dist, this.y, 5,5);
	ctx.fillRect(this.x , this.y, 5,5);
	ctx.fillRect(this.x + dist, this.y, 5,5);

}

VerticalFlower.prototype.update = function() {

    this.duration--;
    this.y = this.y + Math.round((this.initial_duration - this.duration )/ 2);
    this.x = this.x - this.delta_x;

    if (this.duration < 1) {
	flowers.push(new Flower(flower.x - 40, flower.y + getRandomInt(20,40), this.delta_x, get_random_RGB(),getRandomInt(5,15)));
	flowers.push(new Flower(flower.x, flower.y, this.delta_x, get_random_RGB(),getRandomInt(5,15)));
	flowers.push(new Flower(flower.x + 40, flower.y + getRandomInt(20,40), this.delta_x, get_random_RGB(),getRandomInt(5,15)));
    }

}

function is_clean(firework) {
	return !firework.dirty;
}

function is_flower_dead(flower) {
	return flower.duration > 0;
}

var flowers = [];
var fireworks = [];
var launch_fireworks = 0;

function setup() {
	setInterval(animate, 100);
}

function animate() {
	var canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		if (launch_fireworks < 1){
			launch_fireworks = getRandomInt(2,10);
			if (fireworks.length < 15) {
				fireworks.push(new Firework(getRandomInt(-3,3), getRandomInt(5,10), getRandomInt(160,480), 480, get_random_RGB(),getRandomInt(25,40)));
			}
		} else {
			launch_fireworks--;
		}
		for (var i = 0; i < fireworks.length; i++) {
			firework = fireworks[i];
			firework.update();
		}
		
		for (var i = 0; i < flowers.length; i++){
			flower = flowers[i];
			flower.update()
		}
		
		var clean_fireworks = fireworks.filter(is_clean);
		var clean_flowers = flowers.filter(is_flower_dead);
		fireworks = clean_fireworks;
		flowers = clean_flowers;
		draw()
	}
}

function draw() {
	var canvas = document.getElementById('canvas');
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,640,480);
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(0,0,640,480);
		
		for (var i = 0; i < fireworks.length; i++) {
			firework = fireworks[i];
			ctx.fillStyle = firework.color;
			//ctx.fillStyle = 'rgb(255,0,0)';
			ctx.fillRect(firework.x, firework.y, 5, 5);
			//ctx.fillRect(50, 50, 10, 10);
		}
		
		for (var i=0; i< flowers.length; i++){
			flower = flowers[i];
			ctx.save();
			flower.draw(ctx);
			ctx.restore();
		}
	}
}
