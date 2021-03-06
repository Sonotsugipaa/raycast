const PARTICLE_RAYS = 1000;
const WIDTH = PARAM_WIDTH ?? 1000;
const HEIGHT = PARAM_HEIGHT ?? 800;
const CANVAS_SCALE = Math.min(WIDTH, HEIGHT);
const PARTICLE_LINE_WIDTH = Math.max(0.03 * CANVAS_SCALE);
const PARTICLE_LINE_OPACITY = 0.7;
const BOUNDARY_LINE_WIDTH = Math.max(0.0125 * CANVAS_SCALE);
const BOUNDARY_OPACITY = 1;
const BOUNDARY_COUNT = 10;
const BOUNDARY_MAX_LENGTH = CANVAS_SCALE;
const BOUNDARY_MIN_LENGTH = BOUNDARY_MAX_LENGTH / 3;
const MOVEMENT_FACTOR = 20 / CANVAS_SCALE;
const PADDING = 5;
