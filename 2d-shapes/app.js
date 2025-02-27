"use strict";

import { Point, Triangle, Circle } from "./Figures.js";
import WebGL from "./webgl.js";

const MODES = {
    POINTS : 'POINTS',
    TRIANGLE : 'TRIANGLE',
    CIRCLE : 'CIRCLE',
}

let currentMode = MODES.POINTS;
let currentColor = '#000000';
let selectedPoints = [];

const canvas = document.querySelector('#canvas');
const webgl = new WebGL(canvas);

const chooseColorBtn = document.querySelector('#choose-color-btn');
const modal = document.querySelector("#modal");
const colorPicker = document.querySelector('#color-picker');
const saveColorBtn = document.querySelector('#save-color-btn');

colorPicker.value = currentColor;

const drawPointsBtn = document.querySelector('#draw-points-btn');
const drawTriangleBtn = document.querySelector('#draw-triangle-btn');
const drawCircleBtn = document.querySelector('#draw-circle-btn');
const clearCanvasBtn = document.querySelector('#clear-canvas-btn');

canvas.addEventListener('click', (e) => {
    switch (currentMode) {
        case 'POINTS':
            webgl.drawPoint(new Point(canvas, e, currentColor));
            break;

        case 'TRIANGLE':
            selectedPoints.push(new Point(canvas, e));
            webgl.drawPoint(new Point(canvas, e, currentColor));

            if (selectedPoints.length === 3){
                webgl.drawTriangle(new Triangle(selectedPoints, currentColor));
                selectedPoints = [];
            }
            break;

        case 'CIRCLE':
            selectedPoints.push(new Point(canvas, e));
            webgl.drawPoint(new Point(canvas, e, currentColor));

            if (selectedPoints.length === 2) {
                const center = selectedPoints[0];
                const point2 = selectedPoints[1];
                const radius = Math.sqrt(Math.pow(center.x - point2.x, 2) +
                                                 Math.pow(center.y - point2.y, 2));
                webgl.drawCircle(new Circle(center.x, center.y, radius, currentColor));
                selectedPoints = [];
            }
            break;
    }
});

chooseColorBtn.addEventListener('click', (e) => {
    modal.style.display = 'block';
})

saveColorBtn.addEventListener('click', e => {
    modal.style.display = 'none';
    currentColor = colorPicker.value;
});

drawPointsBtn.addEventListener('click', e => {
    currentMode = MODES.POINTS;
});

drawTriangleBtn.addEventListener('click', e => {
    currentMode = MODES.TRIANGLE;
});

drawCircleBtn.addEventListener('click', e => {
    currentMode = MODES.CIRCLE;
});

clearCanvasBtn.addEventListener('click', e => {
    webgl.clearCanvas();
});
