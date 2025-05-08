"use strict";

import { createProgram } from "./utils.js";
import m4 from "./m4.js";
import { vertices, normals, indices } from "./coords.js";

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');
gl.viewport(0, 0, canvas.width, canvas.height);

const vs = await (await fetch('./vertex.vert')).text();
const fs = await (await fetch('./fragment.frag')).text();

const program = createProgram(gl, vs, fs);
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const modelMatrixLoc = gl.getUniformLocation(program, 'uModelMatrix');
const viewMatrixLoc = gl.getUniformLocation(program, 'uViewMatrix');
const projectionMatrixLoc = gl.getUniformLocation(program, 'uProjectionMatrix');
const normalMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");
const lightPosLoc = gl.getUniformLocation(program, "uLightPos");
const viewPosLoc = gl.getUniformLocation(program, "uViewPos");
const ambientColorLoc = gl.getUniformLocation(program, "uAmbientColor");
const diffuseColorLoc = gl.getUniformLocation(program, "uDiffuseColor");
const specularColorLoc = gl.getUniformLocation(program, "uSpecularColor");
const textureLoc = gl.getUniformLocation(program, "uTexture");

const positionLoc = gl.getAttribLocation(program, 'aPosition');
const vertexNormalLoc = gl.getAttribLocation(program, "aVertexNormal");
const vertexColorLoc = gl.getAttribLocation(program, "aVertexColor");
const texCoordLoc = gl.getAttribLocation(program, 'aTexCoord');

const textures = [];
const textureUrls = [
    'textures/texture1.jpg',
    'textures/texture2.jpg',
    'textures/texture3.jpg',
];
let currentTextureIndex = 0;

async function loadTexture(url) {
    return new Promise((resolve) => {
        const texture = gl.createTexture();
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            resolve(texture);
        };
        image.src = url;
    });
}

await Promise.all(textureUrls.map(url => loadTexture(url))).then(loadedTextures => {
    textures.push(...loadedTextures);
});

const stride = 8 * 4;
const colorOffset = 3 * 4;
const textureOffset = 6 * 4;

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const verticesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, stride, 0);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(vertexColorLoc, 3, gl.FLOAT, false, stride, colorOffset);
gl.enableVertexAttribArray(vertexColorLoc);
gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, stride, textureOffset);
gl.enableVertexAttribArray(texCoordLoc);

const normalsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
gl.vertexAttribPointer(vertexNormalLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertexNormalLoc);

const indicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const fovRadians = Math.PI / 4;
const near = 0.1;
const far = 100;
const cameraLocation = [0, 0, 5];

let crateModelMatrix;
let viewMatrix = m4.viewMatrix(cameraLocation, [0, 0, 0], [0, 1, 0]);
let projectionMatrix = m4.perspectiveMatrix(fovRadians, canvas.width / canvas.height, near, far);

let rotationAngles = [0, 0, 0];
let rotationStep = 0.01;
let dz = 0;
let dzStep = 0.01;
let dzLimit = 3;

let lightPos = [0.0, 5.0, 10.0];

let ambientColor = [1.0, 1.0, 1.0];
let diffuseColor = [1.0, 1.0, 1.0];
let specularColor = [1.0, 1.0, 1.0];

function animate() {
    rotationAngles[0] += rotationStep;
    rotationAngles[1] += rotationStep;
    rotationAngles[2] += rotationStep;
    dz += dzStep;
    if (dz < -dzLimit || dz > dzLimit) { dzStep = -dzStep; }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);

    gl.uniform3fv(lightPosLoc, lightPos);
    gl.uniform3fv(viewPosLoc, cameraLocation);
    gl.uniform3fv(ambientColorLoc, ambientColor);
    gl.uniform3fv(diffuseColorLoc, diffuseColor);
    gl.uniform3fv(specularColorLoc, specularColor);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[currentTextureIndex]);
    gl.uniform1i(textureLoc, 0);

    gl.bindVertexArray(vao);
    crateModelMatrix = m4.translate(m4.identityMatrix(), [0, 0, dz]);
    crateModelMatrix = m4.rotate(crateModelMatrix, rotationAngles);
    gl.uniformMatrix4fv(modelMatrixLoc, false, crateModelMatrix);
    let normalMatrix = m4.invert(crateModelMatrix);
    normalMatrix = m4.transpose(normalMatrix);
    gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(animate);
}

canvas.addEventListener('click', () => {
    currentTextureIndex = (currentTextureIndex + 1) % textures.length;
});

animate();
