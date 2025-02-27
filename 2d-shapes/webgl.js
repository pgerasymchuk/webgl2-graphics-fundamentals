"use strict";

export default class WebGL {
    #vs = `
        uniform vec3 u_color;   
        attribute vec2 a_position;
        
        varying vec4 v_color;
    
        void main() {
            gl_Position = vec4(a_position, 0, 1);
            gl_PointSize = 3.0;
            v_color = vec4(u_color, 1.0);
        }
    `;
    #fs = `
        precision highp float;
        varying vec4 v_color;
    
        void main() {
            gl_FragColor = v_color;
        }
    `;

    constructor(canvas) {
        this.gl = canvas.getContext('webgl2');

        this.points = [];
        this.triangles = [];
        this.circles = [];

        const program = this._createProgramFromSources([this.#vs, this.#fs]);
        this.gl.useProgram(program);

        this.colorLocation = this.gl.getUniformLocation(program, 'u_color');
        this.positionLocation = this.gl.getAttribLocation(program, 'a_position');
    }

    _createProgramFromSources(shaderSources) {
        const defaultShaderType = [
            'VERTEX_SHADER',
            'FRAGMENT_SHADER',
        ];

        const program = this.gl.createProgram();

        for (let i = 0; i < shaderSources.length; ++i) {
            const shader = this.gl.createShader(this.gl[defaultShaderType[i]]);
            this.gl.shaderSource(shader, shaderSources[i]);
            this.gl.compileShader(shader);
            this.gl.attachShader(program, shader);
        }
        this.gl.linkProgram(program);

        return program;
    }

    _hexToNormalizedRGB(hex) {
        hex = hex.replace('#', '');

        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        return [r, g, b];
    }


    drawFigures(circleSegmentsNum = 100) {
        for (const [figuresType, figuresAllColors] of Object.entries({'POINT' : this.points,
                                                                                'TRIANGLE' : this.triangles,
                                                                                'CIRCLE' : this.circles}
        )) {
            if (figuresAllColors.length > 0) {
                const figuresGroupedByColor = figuresAllColors.reduce((acc, elem) => {
                    const key = elem.color;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(elem);
                    return acc;
                }, {})

                for (const [color, figures] of Object.entries(figuresGroupedByColor)){
                    let vertices;

                    switch (figuresType) {
                        case 'POINT':
                            vertices = figures.flatMap(point => [point.x, point.y]);
                            break;

                        case 'TRIANGLE':
                            vertices = figures.flatMap(triangle =>
                                triangle.points.flatMap(point => [point.x, point.y]));
                            break;

                        case 'CIRCLE':
                            vertices = [];
                            for (const circle of figures){
                                vertices.push(circle.centerX, circle.centerY);

                                for (let i = 0; i <= circleSegmentsNum; i++) {
                                    const angle = 2 * Math.PI * i / circleSegmentsNum;
                                    const x = circle.centerX + circle.radius * Math.cos(angle);
                                    const y = circle.centerY + circle.radius * Math.sin(angle);
                                    vertices.push(x, y);
                                }
                            }
                    }

                    const buffer = this.gl.createBuffer();
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

                    this.gl.enableVertexAttribArray(this.positionLocation);
                    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

                    this.gl.uniform3fv(this.colorLocation, this._hexToNormalizedRGB(color));

                    switch (figuresType) {
                        case 'POINT':
                            this.gl.drawArrays(this.gl.POINTS, 0, figures.length);
                            break;

                        case 'TRIANGLE':
                            this.gl.drawArrays(this.gl.TRIANGLES, 0, figures.length * 3);
                            break;

                        case 'CIRCLE':
                            for (let i = 0; i < figures.length; i++){
                                this.gl.drawArrays(this.gl.TRIANGLE_FAN, i * (circleSegmentsNum + 2), circleSegmentsNum + 2);
                            }
                            break;
                    }

                    this.gl.deleteBuffer(buffer);
                }
            }
        }
    }

    drawPoint(point){
        this.points.push(point);
        this.drawFigures();
    }

    drawTriangle(triangle){
        this.triangles.push(triangle);
        this.drawFigures();
    }

    drawCircle(circle) {
        this.circles.push(circle);
        this.drawFigures();
    }

    clearCanvas() {
        this.points = [];
        this.triangles = [];
        this.circles = [];

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}
