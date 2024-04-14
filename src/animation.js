import { Particle } from './particle.js';
export class Animation {
    constructor(canvasId, config) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.config = config;
        this.particles = [];
        this.direction = 1;
        this.isRunning = false;
        this.baseTime = performance.now();
        this.lastCircleTime = this.baseTime;
        this.lastCircleRadius = config.initialRadius;
        this.planeOffset = 0;
        this.toggleMode();
        this.adjustCanvasSize();
    }

    adjustCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createCircle(radius) {
        const color = this.config.initialColor;
        const size = this.config.size; // Asegurarse de pasar el tamaño actual
        const xOffset = 10 * Math.cos(this.planeOffset);
        const yOffset = 10 * Math.sin(this.planeOffset);
        for (let i = 0; i < this.config.numPoints; i++) {
            const angle = 2 * Math.PI * i / this.config.numPoints;
            this.particles.push(new Particle(this.ctx, angle, radius, this.direction, color, size, xOffset, yOffset));
        }
        this.direction *= -1;
        this.planeOffset += this.config.planeAngle; // Cambia el ángulo para el próximo círculo
    }

    animate() {
        if (!this.isRunning) return;
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        const timeElapsed = (currentTime - this.lastCircleTime) / 1000;
        
        if (timeElapsed > this.config.circleInterval && this.lastCircleRadius > 10) {
            this.lastCircleRadius -= 10;
            this.createCircle(this.lastCircleRadius);
            this.lastCircleTime = currentTime;
            this.toggleMode();
        } else if (this.lastCircleRadius <= 10) {
            this.stop();
            return;
        }

        this.updateBackground();
        this.particles.forEach(particle => {
            particle.update(currentTime);
            particle.draw();
        });
        this.drawEdges();
    }

    drawEdges() {
        const currentTime = performance.now();
        const frameCount = Math.floor(currentTime / this.config.changeFrequency);
        const skip = Math.floor(Math.abs(Math.sin(frameCount)) * (this.particles.length / 2)) + 1;
        const rotation = frameCount % this.particles.length;
        
        this.ctx.strokeStyle = `hsl(${currentTime / 10 % 360}, 100%, 50%)`;
        this.ctx.lineWidth = 1;
    
        this.particles.forEach((start, i) => {
            const end = this.particles[(i + skip + rotation) % this.particles.length];
            this.ctx.beginPath();
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
            this.ctx.stroke();
        });
    }
    
    toggleMode() {
        this.mode = this.mode === 'light' ? 'dark' : 'light';
        this.updateBackground();
    }
    
    updateBackground() {
        this.ctx.fillStyle = this.mode === 'light' ? 'white' : 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateEdgeProperties() {
        this.ctx.strokeStyle = this.mode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = this.mode === 'dark' ? 1 : 1;
    }

    updateConfig(property, value) {
        if (this.config[property] !== value) {
            this.config[property] = value;
            if (property === 'numPoints' || property === 'initialColor') {
                if (this.isRunning) {
                    this.restart();
                }
            } else {
                this.particles.forEach(particle => {
                    if (particle[property] !== undefined) {
                        particle[property] = value;
                    }
                });
            }
        }
    }
    

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastUpdateTime = performance.now(); // Resetea el tiempo para evitar saltos en la animación.
            this.createCircle(this.lastCircleRadius);
            this.lastCircleTime = this.lastUpdateTime;
            this.animate();
        }
    }

    stop() {
        cancelAnimationFrame(this.animationFrameId);
        this.isRunning = false;
    }

    restart() {
        this.stop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = [];
        this.direction = 1;
        this.planeOffset = 0;
        this.lastCircleTime = performance.now();
        this.lastCircleRadius = this.config.initialRadius;
        
        // No necesita actualizar aquí, debería ser gestionado por un método de actualización
        this.createCircle(this.lastCircleRadius);
        this.start();
    }
    
}



export default Animation;