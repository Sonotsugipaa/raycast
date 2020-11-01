const vec2 = {};

vec2.mk = (x, y) => ({x,y});

vec2.normalize = function normalize(a) {
	const mag = vec2.mag(a);
	a.x /= mag;  a.y /= mag;
}

vec2.normalized = function normalized(a) {
	return vec2.normalize({ x: a.x, y: a.y });
}

vec2.mag = function mag(vec) {
	return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
}

vec2.dot = function dot(a, b) {
	return mag(a) * mag(v) * Math.atan2(b.y - a.y, b.x - a.x);
}

vec2.add = function add(a, b) {
	return {
		x: b.x + a.x,
		y: b.y + a.y};
}

vec2.sub = function sub(a, b) {
	return {
		x: b.x - a.x,
		y: b.y - a.y};
}

vec2.mul = function mul(a, factor) {
	return {
		x: a.x * factor,
		y: a.y * factor };
}

vec2.div = function div(a, divisor) {
	return {
		x: a.x / divisor,
		y: a.y / divisor };
}

vec2.avg = function avg() {
	let r = vec2.mk(0, 0);
	for(const i in arguments) {
		r.x += (arguments[i].x) / arguments.length;
		r.y += (arguments[i].y) / arguments.length;
	}
	return r;
}

vec2.direction = function direction(a, b) {
	if(b !== undefined) {
		return Math.atan2(b.y-a.y, b.x-a.x);
	} else {
		return Math.atan2(a.y, a.x);
	}
}

vec2.normal = function normal(a, b) {
	if(b !== undefined)  a = vec2.sub(b, a);
	return { x: a.y, y: -a.x }
}
