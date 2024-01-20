import assert from 'node:assert/strict';
import Vector from './../src/vector/index.js';

describe('Vector', function() {
    describe('#create', function() {
        it('creates a vector', function() {
            const vector = Vector.create(1, 2);

            assert.strictEqual(
                vector.x,
                1,
            );
            assert.strictEqual(
                vector.y,
                2,
            );
        });
    });

    describe('#random', function() {
        it('creates a random vector', function() {
            const foundX = new Set;
            const foundY = new Set;

            let i;
            for (i = 0; i < 1000; i++) {
                const vector = Vector.random();
                assert.ok(vector.x >= 0 && vector.x < 1);
                assert.ok(vector.y >= 0 && vector.y < 1);
                foundX.add(vector.x);
                foundY.add(vector.y);
            }

            assert.ok(foundX.size > 100);
            assert.ok(foundY.size > 100);
        });
    });

    describe('#add', function() {
        it('adds a vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = Vector.create(2, 3);
            const vector3 = vector1.add(vector2);

            assert.strictEqual(
                vector1.x,
                3,
            );
            assert.strictEqual(
                vector1.y,
                5,
            );
            assert.strictEqual(
                vector1,
                vector3,
            );
        });

        it('adds a vector from X/Y', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.add(2, 3);

            assert.strictEqual(
                vector1.x,
                3,
            );
            assert.strictEqual(
                vector1.y,
                5,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#angleTo', function() {
        it('calculates the angle to a vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = Vector.create(2, 3);

            assert.strictEqual(
                vector1.angleTo(vector2),
                -0.12435499454676135,
            );
        });

        it('calculates the angle to a vector from X/Y', function() {
            const vector = Vector.create(1, 2);

            assert.strictEqual(
                vector.angleTo(2, 3),
                -0.12435499454676135,
            );
        });
    });

    describe('#distTo', function() {
        it('calculates the distance to a vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = Vector.create(2, 3);

            assert.strictEqual(
                vector1.distTo(vector2),
                1.4142135623730951,
            );
        });

        it('calculates the distance to a vector from X/Y', function() {
            const vector = Vector.create(1, 2);

            assert.strictEqual(
                vector.distTo(2, 3),
                1.4142135623730951,
            );
        });
    });

    describe('#div', function() {
        it('divides by a vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = Vector.create(2, 3);
            const vector3 = vector1.div(vector2);

            assert.strictEqual(
                vector1.x,
                .5,
            );
            assert.strictEqual(
                vector1.y,
                0.6666666666666666,
            );
            assert.strictEqual(
                vector1,
                vector3,
            );
        });

        it('divides by a vector from X/Y', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.div(2, 3);

            assert.strictEqual(
                vector1.x,
                .5,
            );
            assert.strictEqual(
                vector1.y,
                0.6666666666666666,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#dot', function() {
        it('dot product multiplies by a vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = Vector.create(2, 3);
            const vector3 = vector1.dot(vector2);

            assert.strictEqual(
                vector1.x,
                3,
            );
            assert.strictEqual(
                vector1.y,
                4,
            );
            assert.strictEqual(
                vector1,
                vector3,
            );
        });

        it('dot product multiplies by a vector from X/Y', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.dot(2, 3);

            assert.strictEqual(
                vector1.x,
                3,
            );
            assert.strictEqual(
                vector1.y,
                4,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#getHeading', function() {
        it('gets the vector heading', function() {
            const vector = Vector.create(1, 2);

            assert.strictEqual(
                vector.getHeading(),
                1.1071487177940904,
            );
        });
    });

    describe('#getMag', function() {
        it('gets the vector magnitude', function() {
            const vector = Vector.create(1, 2);

            assert.strictEqual(
                vector.getMag(),
                2.23606797749979,
            );
        });
    });

    describe('#limit', function() {
        it('limits the vector magnitude', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.limit(2);

            assert.strictEqual(
                vector1.getMag(),
                2,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });

        it('does not limit if the magnitude is less than the limit', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.limit(3);

            assert.strictEqual(
                vector1.getMag(),
                2.23606797749979,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#mult', function() {
        it('multiplies by a vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = Vector.create(2, 3);
            const vector3 = vector1.mult(vector2);

            assert.strictEqual(
                vector1.x,
                2,
            );
            assert.strictEqual(
                vector1.y,
                6,
            );
            assert.strictEqual(
                vector1,
                vector3,
            );
        });

        it('multiplies by a vector from X/Y', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.mult(2, 3);

            assert.strictEqual(
                vector1.x,
                2,
            );
            assert.strictEqual(
                vector1.y,
                6,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#normalize', function() {
        it('normalizes the vector magnitude', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.normalize();

            assert.strictEqual(
                vector1.getMag(),
                1,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#rotate', function() {
        it('rotates the vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.rotate(0.45);

            assert.strictEqual(
                vector1.getHeading(),
                1.5571487177940904,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#setHeading', function() {
        it('sets the vector heading', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.setHeading(0.45);

            assert.strictEqual(
                vector1.getHeading(),
                0.45,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#setMag', function() {
        it('sets the vector magnitude', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.setMag(3);

            assert.strictEqual(
                vector1.getMag(),
                3,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });

    describe('#sub', function() {
        it('subtracts a vector', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = Vector.create(2, 3);
            const vector3 = vector1.sub(vector2);

            assert.strictEqual(
                vector1.x,
                -1,
            );
            assert.strictEqual(
                vector1.y,
                -1,
            );
            assert.strictEqual(
                vector1,
                vector3,
            );
        });

        it('subtracts a vector from X/Y', function() {
            const vector1 = Vector.create(1, 2);
            const vector2 = vector1.sub(2, 3);

            assert.strictEqual(
                vector1.x,
                -1,
            );
            assert.strictEqual(
                vector1.y,
                -1,
            );
            assert.strictEqual(
                vector1,
                vector2,
            );
        });
    });
});
