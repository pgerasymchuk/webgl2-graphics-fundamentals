"use strict";

import { createProgram } from "./utils.js";
import m4 from "./m4.js";

const fovRadians = Math.PI / 4;
const near = 0.1;
const far = 100;

let modelMatrix;
let viewMatrix = m4.viewMatrix([0, 0, 5], [0, 0, 0], [0, 1, 0]);
let projectionMatrix;

let isPerspective = false;
let isRotating = true;
let rotationAngle = 0;
let dz = 0;
let dzStep = 0.01;
let angleStep = 0.01;

document.getElementById('projection-btn').addEventListener('click', () => {
    isPerspective = !isPerspective;
    document.getElementById('projection').textContent = isPerspective ? 'Perspective projection' : 'Orthographic projection';
    updateProjection();
});

document.getElementById('rotation-btn').addEventListener('click', () => {
    isRotating = !isRotating;
});

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');
gl.viewport(0, 0, canvas.width, canvas.height);

const vs = await (await fetch('./vertex.vert')).text();
const fs = await (await fetch('./fragment.frag')).text();

const program = createProgram(gl, vs, fs);
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const vertices = new Float32Array([
    // Positions         // Colors
    // Front face
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,
    0.5, -0.5,  0.5,  1.0, 0.0, 0.0,
    0.5,  0.5,  0.5,  1.0, 0.0, 0.0,
    -0.5,  0.5,  0.5,  1.0, 0.0, 0.0,
    // Back face
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
    0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
    0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
    // Top face
    -0.5,  0.5, -0.5,  0.0, 0.0, 1.0,
    0.5,  0.5, -0.5,  0.0, 0.0, 1.0,
    0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
    // Bottom face
    -0.5, -0.5, -0.5,  1.0, 1.0, 0.0,
    0.5, -0.5, -0.5,  1.0, 1.0, 0.0,
    0.5, -0.5,  0.5,  1.0, 1.0, 0.0,
    -0.5, -0.5,  0.5,  1.0, 1.0, 0.0,
    // Right face
    0.5, -0.5, -0.5,  0.0, 1.0, 1.0,
    0.5,  0.5, -0.5,  0.0, 1.0, 1.0,
    0.5,  0.5,  0.5,  0.0, 1.0, 1.0,
    0.5, -0.5,  0.5,  0.0, 1.0, 1.0,
    // Left face
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0,
    -0.5,  0.5, -0.5,  1.0, 0.0, 1.0,
    -0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
    -0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
]);

const indices = new Uint16Array([
    0,  1,  2,   0,  2,  3,    // Front
    4,  5,  6,   4,  6,  7,    // Back
    8,  9,  10,  8,  10, 11,   // Top
    12, 13, 14,  12, 14, 15,   // Bottom
    16, 17, 18,  16, 18, 19,   // Right
    20, 21, 22,  20, 22, 23    // Left
]);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


const positionLoc = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 6 * 4, 0);

const colorLoc = gl.getAttribLocation(program, 'aColor');
gl.enableVertexAttribArray(colorLoc);
gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

const modelMatrixLoc = gl.getUniformLocation(program, 'uModelMatrix');
const viewMatrixLoc = gl.getUniformLocation(program, 'uViewMatrix');
const projectionMatrixLoc = gl.getUniformLocation(program, 'uProjectionMatrix');

function updateProjection() {
    if (isPerspective) {
        projectionMatrix = m4.perspectiveMatrix(fovRadians, canvas.width / canvas.height, near, far);
    } else {
        const size = 1;
        projectionMatrix = m4.orthoMatrix(-size, size, -size, size, 0.1, 100);
    }
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
}

updateProjection();

function animate() {
    if (isRotating) {
        rotationAngle += angleStep;
        dz += dzStep;
        if (dz < -2 || dz > 2) { dzStep = -dzStep; }

        modelMatrix = m4.identityMatrix();
        modelMatrix = m4.translate(modelMatrix, [0, 0, dz]);
        modelMatrix = m4.rotate(modelMatrix, [rotationAngle, rotationAngle, rotationAngle]);
    }

    gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(animate);
}

animate();
