let squares;
let canvas;
let dLine;



function mainAxisPt(angle, pos) {
	const pt = { x: WIDTH/2, y: HEIGHT/2 };
	pt.x += Math.cos(angle) * pos;
	pt.y += Math.sin(angle) * pos;
	return pt;
}

function projectLn(angle, a, b) {
	const projB = this.projectPt(angle, b);
	const projA = this.projectPt(angle, a);
	const r = projB - projA;
	if(DEBUG) {
		x = Math.cos(angle) * r;
		y = Math.sin(angle) * r;
		stroke(255, 0, 255);
		line(a.x, a.y, a.x+x, a.y+y);
	}
	return r;
}

function projectPt(angle, pt) {
	const r = vec2.mag(pt) * Math.cos(Math.atan2(pt.y, pt.x) - angle);
	return r;
}

function mkProjection(pa, pb) {
	return { pa: pa,  pb: pb,  length: pb - pa };
}

function mkCollision(spacing, side) {
	return { spacing: spacing,  side: side };
}

function projectOnAxis(vertices, axis, ptReference) {
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	const shift = (ptReference === undefined)?
		0 : -axis.projectPt(ptReference);
	let p;
	for(const vtx of vertices) {
		p = axis.projectPt(vtx) + shift;
		if(min > p)  min = p;  // do *NOT* use 'else if' here
		if(max < p)  max = p;
	}
	return mkProjection(min, max);
}


class Axis {
	set angle(value) {
		this._angle = value;
		this.cos = Math.cos(value);
		this.sin = Math.sin(value);
	}

	get angle() { return this._angle; }

	constructor(angle) {
		this.angle = angle;
	}

	projectPt(pt) {
		return vec2.mag(pt) * Math.cos(Math.atan2(pt.y, pt.x) - this._angle);
	}
}


class Boundary {
	constructor(x1, y1, x2, y2) {
		this.a = createVector(x1, y1);
		this.b = createVector(x2, y2);
	}

	show() {
		line(
			this.a.x, this.a.y,
			this.b.x, this.b.y);
	}
}


class Square {
	constructor(center, size, rotation) {
		rotation += Math.PI / 4;
		size /= 2;
		let x = Math.cos(rotation) * size;
		let y = Math.sin(rotation) * size;
		this.center = center;
		this.vertices = [
			{ x: center.x +y,  y: center.y +x},
			{ x: center.x +x,  y: center.y -y},
			{ x: center.x -y,  y: center.y -x},
			{ x: center.x -x,  y: center.y +y}];
		this.boundaries = [
			new Boundary(
				this.vertices[0].x, this.vertices[0].y,
				this.vertices[1].x, this.vertices[1].y),
			new Boundary(
				this.vertices[1].x, this.vertices[1].y,
				this.vertices[2].x, this.vertices[2].y),
			new Boundary(
				this.vertices[2].x, this.vertices[2].y,
				this.vertices[3].x, this.vertices[3].y),
			new Boundary(
				this.vertices[3].x, this.vertices[3].y,
				this.vertices[0].x, this.vertices[0].y)];
		this.normals = [];
		this.normalAngles = [];
		for(const bd of this.boundaries) {
			const nrm = vec2.normal(bd.a, bd.b);
			this.normals.push(nrm);
			this.normalAngles.push(Math.atan2(nrm.y, nrm.x));
		}
	}

	projectOnAxis(axis, ptReference) {
		return projectOnAxis(this.vertices, axis, ptReference);
	}

	get normalAngleSet() {
		return this.normalAngles;
	}

	/// Returns an object with the properties 'spacing' and 'direction'.
	/// The 'spacing' property is the minimum space (detected) between
	/// any two points of this shape and the one contained in the vertex array;
	/// if the spacing value is negative, the number represents the
	/// minimum overlap.
	/// The 'direction' property is the (possibly approximate) axis
	/// of the normal of the closest side of this shape.
	collideShape(vertexArray, angleSet) {
		let minOverlap = { spacing: Number.NEGATIVE_INFINITY, direction: null };
		let minSpacing = { spacing: Number.POSITIVE_INFINITY, direction: null };
		for(let axis of angleSet) {
			axis = new Axis(axis);
			const projThis = projectOnAxis(this.vertices, axis);
			const projOthr = projectOnAxis(vertexArray, axis);
			const spacing =
				Math.max(
					Math.abs(projThis.pa - projOthr.pa), Math.abs(projThis.pa - projOthr.pb),
					Math.abs(projThis.pb - projOthr.pa), Math.abs(projThis.pb - projOthr.pb)
				) - (projThis.length + projOthr.length);
			const overlap = -spacing;
			if(overlap >= 0) {
				if(minOverlap.spacing < overlap) {
					minOverlap.spacing = -overlap;
					minOverlap.direction = axis;
				}
			} else {
				if(minSpacing.spacing > spacing) {
					minSpacing.spacing = spacing;
					minSpacing.direction = axis;
				}
			}
		}
		if(minSpacing.direction !== null) {
			return minSpacing;
		} else {
			return minOverlap;
		}
	}

	draw() {
		for(const boundary of this.boundaries) {
			line(boundary.a.x, boundary.a.y, boundary.b.x, boundary.b.y); }
	}
}



function randomSquares(n) {
	const squares = [];
	for(let i=0; i<n; ++i) {
		const x = random(WIDTH);
		const y = random(HEIGHT);
		const theta = random(Math.PI / 2);
		const size = random(CANVAS_SCALE / 2);
		squares.push(new Square({x:x, y:y}, size, theta));
	}
	return squares;
}


function onClick(ctx) {
	let x = ctx.x - canvas.canvas.offsetLeft;
	let y = ctx.y - canvas.canvas.offsetTop;
	if(dLine === undefined) {
		dLine = {
			p1: createVector(x, y),
			p2: undefined
		}
	} else {
		if(dLine.p2 === undefined) {
			dLine.p2 = createVector();
		} else {
			dLine.p1.x = x;
			dLine.p1.y = y;
		}
	}
}


function moveDLine() {
	if(
			dLine !== undefined && dLine.p2 !== undefined &&
			typeof mouseX !== 'undefined' &&
			typeof mouseY !== 'undefined'
	) {
		dLine.p2.x = mouseX;
		dLine.p2.y = mouseY;
		dLine.atan2 = Math.atan2(
			dLine.p2.y - dLine.p1.y,
			dLine.p2.x - dLine.p1.x);
	}
}

function drawDLine(hasCollision) {
	if(dLine !== undefined) {
		let color = hasCollision? [ 255, 0, 0 ] : [ 255 ];
		if(dLine.p2 !== undefined) {
			stroke(...color);
			strokeWeight(hasCollision? 2 : 1);
			line(dLine.p1.x, dLine.p1.y, dLine.p2.x, dLine.p2.y);
		} else {
			fill(...color);
			ellipse(dLine.p1.x, dLine.p1.y, 6);
		}
	}
}


function setup() {
	canvas = createCanvas(WIDTH, HEIGHT);
	canvas.id('main-canvas');
	canvas.canvas.onclick = onClick;
	document.getElementById('main-canvas');
	squares = randomSquares(SHAPES_COUNT);
	frameRate(FPS);
}


function draw() {
	background(0);

	moveDLine();

	let hasCollision = false;
	stroke(255);
	strokeWeight(2);
	for(const square of squares) {
		if(dLine !== undefined && dLine.p2 !== undefined) {
			let sqCollision = square.collideShape(
				[ dLine.p1, dLine.p2 ],
				[ ...square.normalAngleSet, dLine.atan2 + radians(90)]
			);
			if(0 >= sqCollision.spacing) {
				hasCollision = true;
				if(DEBUG) {
					const DELTA_MAG = 5;
					const center = vec2.avg(dLine.p1, dLine.p2);
					const dirAxis = new Axis(sqCollision.direction.angle + radians(90));
					const delta = {
						x: (DELTA_MAG * +dirAxis.sin),
						y: (DELTA_MAG * -dirAxis.cos) };
					const dirPtr = {
						x: (dirAxis.cos * sqCollision.spacing) + delta.x,
						y: (dirAxis.sin * sqCollision.spacing) + delta.y };
					stroke(255, 0, 255);
					line(
						center.x, center.y,
						center.x + delta.x, center.y + delta.y);
					line(
						center.x + delta.x, center.y + delta.y,
						center.x + dirPtr.x, center.y + dirPtr.y);
				}
				stroke(255, 0, 0);
			} else {
				stroke(255, 255, 255);
			}
			square.draw();
		} else {
			stroke(255, 255, 255);
			square.draw();
		}
	}

	drawDLine(hasCollision);
}
