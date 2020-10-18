class Ray {
	constructor(pos, yaw) {
		this.pos = pos;
		if(typeof yaw !== 'undefined') {
			this.dir = p5.Vector.fromAngle(yaw); }
	}


	cast(wall, distLimit) {
		distLimit = distLimit ?? Infinity;
		//       3
		//        \    |3-4|=1
		//         4
		//
		//    1---------------2
		const x1 = wall.a.x;
		const y1 = wall.a.y;
		const x2 = wall.b.x;
		const y2 = wall.b.y;
		const x3 = this.pos.x;
		const y3 = this.pos.y;
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;

		const denom = ((x1-x2) * (y3-y4)) - ((y1-y2) * (x3-x4));
		if(denom == 0) {
			return null;
		} else {
			const t = (((x1-x3) * (y3-y4)) - ((y1-y3) * (x3-x4))) / denom;
			const u = - (((x1-x2) * (y1-y3)) - ((y1-y2) * (x1-x3))) / denom;
			if(t>0 && t<1 && u>0) {
				let pt = createVector(
					x1 + (t * (x2-x1)),
					y1 + (t * (y2-y1)));
				return pt;
			} else {
				return null;
			}
		}
	}
}

Ray.fromAngle = Ray.prototype.constructor;

Ray.fromPoints = function fromPoints(p1, p2) {
	let ray = new Ray(p1);
	ray.dir = createVector(
		p2.x - ray.pos.x,
		p2.y - ray.pos.y);
	ray.dir.normalize();
	return ray;
}
