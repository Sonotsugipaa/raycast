function mkBoundaryTracers(walls) {
	let tracers = [];
	for(let wall of walls) {
		tracers.push(new Boundary.Tracer(wall)); }
	return tracers;
}


class Particle {
	constructor(x, y, rays) {
		if(typeof rays === 'undefined')  rays = 36;
		const degInterval = 360 / rays;
		this.pos = createVector(x/2, y/2);
		this.rays = [];
		for(let yaw = 0; yaw < 360; yaw += degInterval) {
			this.rays.push(new Ray(this.pos, radians(yaw)));
		}
	}

	show() {
		stroke(255, 100);
		ellipse(this.pos.x, this.pos.y, 7);
	}

	cast(walls) {
		let bTracers;
		if(BOUNDARY_OPACITY > 0) {
			bTracers = mkBoundaryTracers(walls); }
		stroke(255, PARTICLE_LINE_OPACITY);
		strokeWeight(PARTICLE_LINE_WIDTH);
		for(let ray of this.rays) {
			let closestPt = null;
			let closestWallIndex = null;
			let record = Infinity;
			for(let i=0; i < walls.length; ++i) {
				const wall = walls[i];
				const cast = ray.cast(wall);
				if(cast) {
					const dist = p5.Vector.dist(this.pos, cast);
					if(dist < record) {
						record = dist;
						closestPt = cast;
						closestWallIndex = i;
					}
				}
			}
			if(closestPt) {
				line(this.pos.x, this.pos.y, closestPt.x, closestPt.y);
				if(BOUNDARY_OPACITY > 0) {
					bTracers[closestWallIndex].see(closestPt); }
			}
		}
		if(BOUNDARY_OPACITY > 0) {
			stroke(255, BOUNDARY_OPACITY);
			strokeWeight(BOUNDARY_LINE_WIDTH);
			for(let tracer of bTracers) {
				tracer.draw(); }
		}
	}
}
