export class Point {
    // coordinates are transformed into WebGL Normalized Device Coordinates
    constructor(canvas, event, color){
        const rect = canvas.getBoundingClientRect();
        this.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
        this.y = -(((event.clientY - rect.top) / canvas.height) * 2 - 1);
        this.color = color;
    }
}

export class Triangle {
    constructor(points, color) {
        this.points = points;
        this.color = color;
    }
}

export class Circle {
    constructor(centerX, centerY, radius, color) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.color = color;
    }
}
