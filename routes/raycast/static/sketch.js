let walls;
let particle;
let lastCast = true;
let canvas;


// checks if the line between src and dest is interrupted;
// if so, returns the point of interruption.
function makeMoveVector(src, dest, walls) {
	const ray = Ray.fromPoints(src, dest);
	const maxDist = p5.Vector.dist(src, dest);
	let closestPt = null;
	let record = maxDist;
	for(let i=0; i < walls.length; ++i) {
		const wall = walls[i];
		const cast = ray.cast(wall, maxDist);
		if(cast) {
			const dist = p5.Vector.dist(src, cast);
			if(dist < record) {
				record = dist;
				closestPt = cast;
			}
		}
	}
	if(closestPt) {
		return src;
	} else {
		return dest;
	}
}


// returns the actual point where to move the particle
function moveParticle(particle, dest, walls) {
	dest.sub(particle.pos);
	const mag = Math.log(p5.Vector.mag(dest));
	dest.mult(mag * MOVEMENT_FACTOR);
	dest.add(particle.pos);
	dest = makeMoveVector(particle.pos, dest, walls);
	particle.pos.x = dest.x;
	particle.pos.y = dest.y;
}


function randomBoundaries(n) {
	let walls = [
		new Boundary(-PADDING, -PADDING, WIDTH+PADDING, -PADDING),
		new Boundary(WIDTH+PADDING, -PADDING, WIDTH+PADDING, HEIGHT+PADDING),
		new Boundary(WIDTH+PADDING, HEIGHT+PADDING, -PADDING, HEIGHT+PADDING),
		new Boundary(-PADDING, HEIGHT+PADDING, -PADDING, -PADDING)
	];
	for(let i=0; i<n; ++i) {
		const x1 = random(WIDTH - (PADDING*4)) + (PADDING*2);
		const x2 = random(WIDTH - (PADDING*4)) + (PADDING*2);
		const y1 = random(HEIGHT - (PADDING*4)) + (PADDING*2);
		const y2 = random(HEIGHT - (PADDING*4)) + (PADDING*2);
		const dx = x2 - x1;
		const dy = y2 - y1;
		const d = Math.sqrt((dx*dx) + (dy*dy));
		if(d > BOUNDARY_MIN_LENGTH && d < BOUNDARY_MAX_LENGTH) {
			walls.push(new Boundary(x1, y1, x2, y2));
		} else {
			--i;
		}
	}
	return walls;
}


function setup() {
	canvas = createCanvas(WIDTH, HEIGHT);
	walls = randomBoundaries(BOUNDARY_COUNT);
	particle = new Particle(
		10, 10,
		PARTICLE_RAYS);
}


function draw() {
	background(0);

	if(typeof mouseX !== 'undefined' && typeof mouseY !== 'undefined') {
		moveParticle(particle, createVector(mouseX, mouseY), walls); }

	particle.show();
	particle.cast(walls);

	//for(let wall of walls) { wall.show(); }
}
