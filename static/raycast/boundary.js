class Boundary {
	constructor(x1, y1, x2, y2, width) {
		if(typeof width === 'undefined')  width = 2;
		this.width = width;
		this.a = createVector(x1, y1);
		this.b = createVector(x2, y2);
	}

	show() {
		stroke(255, 255);
		strokeWeight(this.width);
		line(
			this.a.x, this.a.y,
			this.b.x, this.b.y);
	}
}


Boundary.Tracer = class BoundaryTracer {
	constructor(wall) {
		this.wall = wall;
		this.closestToA = null;
		this.closestToB = null;
		this.distanceToA = Infinity;
		this.distanceToB = Infinity;
	}

	_tryClosestA(pt, da) {
		let doSet = da < this.distanceToA;
		if(doSet) {
			this.distanceToA = da;
			this.closestToA = pt;
		}
		return doSet;
	}

	_tryClosestB(pt, db) {
		let doSet = db < this.distanceToB;
		if(doSet) {
			this.distanceToB = db;
			this.closestToB = pt;
		}
		return doSet;
	}

	see(pt) {
		let da = p5.Vector.dist(this.wall.a, pt);
		let db = p5.Vector.dist(this.wall.b, pt);
		this._tryClosestA(pt, da);
		this._tryClosestB(pt, db);
	}

	draw(gray, transparency, strokeWidth) {
		stroke(gray, transparency);
		strokeWeight(strokeWidth);
		if(this.closestToA != null) {
			if(this.closestToB != null) {
				line(
					this.closestToA.x, this.closestToA.y,
					this.closestToB.x, this.closestToB.y);
			} else {
				point(this.closestToA.x, this.closestToA.y);
			}
		} else {
			if(this.closestToB != null) {
				point(this.closestToB.x, this.closestToB.y);
			}
		}
	}
}
