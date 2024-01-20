import CanvasContext from './canvas-context.js';
import { fill, font, fontSize, fontWeight, noFill, noShadow, noStroke, shadow, shadowBlur, shadowOffset, stroke, strokeWidth, text, textAlign, _draw, _updateContext } from './prototype/draw.js';
import { linearGradient, radialGradient } from './prototype/gradient.js';
import { begin, bezierVertex, curveVertex, end, quadraticVertex, vertex } from './prototype/path.js';
import { arc, bezier, circle, curve, ellipse, line, point, quad, rect, square, triangle } from './prototype/primitive.js';

// CanvasContext default options
CanvasContext.defaults = {
    fillStyle: null,
    font: 'sans-serif',
    fontSize: 10,
    fontWeight: null,
    lineWidth: 1,
    shadowBlur: 0,
    shadowColor: null,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    strokeStyle: '#000',
};

// CanvasContext prototype
const proto = CanvasContext.prototype;

proto.arc = arc;
proto.begin = begin;
proto.bezier = bezier;
proto.bezierVertex = bezierVertex;
proto.circle = circle;
proto.curve = curve;
proto.curveVertex = curveVertex;
proto.ellipse = ellipse;
proto.end = end;
proto.fill = fill;
proto.font = font;
proto.fontSize = fontSize;
proto.fontWeight = fontWeight;
proto.line = line;
proto.linearGradient = linearGradient;
proto.noFill = noFill;
proto.noShadow = noShadow;
proto.noStroke = noStroke;
proto.point = point;
proto.quad = quad;
proto.quadraticVertex = quadraticVertex;
proto.radialGradient = radialGradient;
proto.rect = rect;
proto.shadow = shadow;
proto.shadowBlur = shadowBlur;
proto.shadowOffset = shadowOffset;
proto.square = square;
proto.stroke = stroke;
proto.strokeWidth = strokeWidth;
proto.text = text;
proto.textAlign = textAlign;
proto.triangle = triangle;
proto.vertex = vertex;
proto._draw = _draw;
proto._updateContext = _updateContext;

export default CanvasContext;
