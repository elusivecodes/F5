import Path from './path.js';
import { bezierVertex, close, curveVertex, quadraticVertex, vertex } from './prototype/path.js';
import { arc, bezier, circle, curve, ellipse, line, quad, rect, square, triangle } from './prototype/primitive.js';

// Path prototype
const proto = Path.prototype;

proto.arc = arc;
proto.bezier = bezier;
proto.bezierVertex = bezierVertex;
proto.circle = circle;
proto.close = close;
proto.curve = curve;
proto.curveVertex = curveVertex;
proto.ellipse = ellipse;
proto.line = line;
proto.quad = quad;
proto.quadraticVertex = quadraticVertex;
proto.rect = rect;
proto.square = square;
proto.triangle = triangle;
proto.vertex = vertex;

export default Path;
