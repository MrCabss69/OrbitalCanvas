export class Particle {
    constructor(ctx, angle, radius, direction, color, size, xOffset = 0, yOffset = 0) {
        this.ctx = ctx;
        this.angle = angle;
        this.radius = radius;
        this.direction = direction;
        this.color = color;
        this.size = size; // Ahora el tamaño es dinámico
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.speed = 1; // Velocidad inicial (puede ser ajustada)
        this.update(0)
    }

    update(currentTime) {
        const { width, height } = this.ctx.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        // Usar la velocidad para ajustar cómo se mueve la partícula en el tiempo
        this.x = centerX + Math.cos(this.angle + this.xOffset + this.direction * (currentTime / 1000) * this.speed) * this.radius;
        this.y = centerY + Math.sin(this.angle + this.yOffset + this.direction * (currentTime / 1000) * this.speed) * this.radius;
    }

    draw(lineWidth) {
        this.ctx.lineWidth = lineWidth; // Establecer el lineWidth antes de comenzar el path
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}