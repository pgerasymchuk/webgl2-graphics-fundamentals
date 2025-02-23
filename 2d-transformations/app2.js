"use strict";

import {createProgramFromSources} from "./utils.js";

const vs = `
uniform mat3 u_matrix;

attribute vec2 a_position;
attribute vec3 a_color;

varying vec4 v_color;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
  v_color = vec4(a_color, 1.0);
}
`;

const fs = `
precision highp float;

varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;

function main() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    const program = createProgramFromSources(gl, [vs, fs]);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        200, 200,
        250, 250,
        200, 100,
        150, 250,
        200, 230,
        250, 250,
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        1.0, 0.0, 0.0,  // red
        0.0, 1.0, 0.0,  // green
        0.0, 0.0, 1.0,  // blue
        1.0, 1.0, 1.0,  // white
        1.0, 0.5, 0.0,  // orange
        0.0, 0.0, 0.0   // black
    ]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);

    let step = 2;
    let dy = 0;

    function drawScene() {
        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, 0, dy);

        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

        dy += step;
        if (Math.abs(dy) > gl.canvas.clientHeight / 5) {
            step = -step;
        }
        requestAnimationFrame(drawScene);
    }

    drawScene();
}

window.addEventListener("load", main);
