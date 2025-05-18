// particle.js
export class Particle {
    constructor(ctx, angle, radius, direction, speed = 1, xAngleOffset = 0, yAngleOffset = 0, baseSize = 5) {
        this.ctx = ctx;
        this.angle = angle;
        this.radius = radius;
        this.direction = direction;
        this.speed = speed;
        this.xAngleOffset = xAngleOffset;
        this.yAngleOffset = yAngleOffset;
        this.baseSize = baseSize;
        this.size = baseSize;
        this.x = 0;
        this.y = 0;
    
        // Only call update if ctx is valid and has a canvas property
        if (this.ctx && this.ctx.canvas) {
            this.update(performance.now());
        } else {
            // Defer update until ctx is available, or throw a clear error
            console.error("Particle created with invalid ctx!", this.ctx);
        }
    }

    update(currentTime) {
        const { width, height } = this.ctx.canvas;
        const centerX = width / 2;
        const centerY = height / 2;

        const currentAngle = this.angle +
                             this.direction * (currentTime / 1000) * this.speed;

        this.x = centerX + Math.cos(this.angle + this.xAngleOffset + this.direction * (currentTime / 1000) * this.speed) * this.radius;
        this.y = centerY + Math.sin(this.angle + this.yAngleOffset + this.direction * (currentTime / 1000) * this.speed) * this.radius;

        // NOTA: Aquí podrías dejar lógica física, como vibración, crecimiento, etc.
    }
    draw() {
        this.ctx.save();
        this.ctx.shadowBlur = 16;
        this.ctx.shadowColor = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
}
