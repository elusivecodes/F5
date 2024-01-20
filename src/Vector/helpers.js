import Vector from './vector.js';

/**
 * Parse a Vector or X/Y co-ordinates.
 * @param {Vector|number} x A Vector, or the X position.
 * @param {number} [y] The Y position.
 * @return {Vector} The new Vector.
 */
export function parseVector(x, y) {
    if (x instanceof Vector) {
        return x;
    }

    return new Vector(x, y);
};
