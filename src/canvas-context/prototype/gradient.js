/**
 * Create a linear gradient.
 * @param {number} x1 The starting X position.
 * @param {number} y1 The starting Y position.
 * @param {number} x2 The ending X position.
 * @param {number} y2 The ending Y position.
 * @return {CanvasGradient} The CanvasGradient.
 */
export function linearGradient(x1, y1, x2, y2) {
    return this._context.createLinearGradient(x1, y1, x2, y2);
};

/**
 * Create a radial gradient.
 * @param {number} x1 The starting X position.
 * @param {number} y1 The starting Y position.
 * @param {number} r1 Th starting radius.
 * @param {number} x2 The ending X position.
 * @param {number} y2 The ending Y position.
 * @param {number} r2 Th ending radius.
 * @return {CanvasGradient} The CanvasGradient.
 */
export function radialGradient(x1, y1, r1, x2, y2, r2) {
    return this._context.createRadialGradient(x1, y1, r1, x2, y2, r2);
};
