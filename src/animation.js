import { Particle } from './particle.js';
import { ParticleRenderer } from './particle_render.js'; // o './particleRenderer.js'

export class Animation {
    static defaultConfig = {
        numPoints: 72,
        initialRadius: 380,
        radiusDecrementStep: 10,
        color: '#FF0000', // Color por defecto para las partículas
        initialColor: '#FF0000', // Podría usarse para un reset muy específico o el primer círculo
        size: 5,
        speed: 1,
        lineWidth: 1,
        planeAngle: 0.1, // Ángulo para el offset del plano de los círculos
        circleInterval: 5, // segundos
        changeFrequency: 3500, // milisegundos para la lógica de `drawEdges`
        lightBackgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo claro con transparencia
        darkBackgroundColor: 'rgba(0, 0, 0, 0.1)',     // Fondo oscuro con transparencia
    };

    constructor(canvasId, userConfig = {}, styleConfig = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with ID "${canvasId}" not found.`);
            return;
        }
        this.particleRenderer = new ParticleRenderer(styleConfig.particleStyle || {
            color: "#FF0000",
            glow: true,
            gradiente: false
        });
        this.ctx = this.canvas.getContext("2d");
        this.config = { ...Animation.defaultConfig, ...userConfig };

        this.particles = [];
        this.direction = 1; // Para alternar la dirección de rotación de las partículas
        this.isRunning = false;
        this.animationFrameId = null;

        this.lastCircleTime = 0; // Se inicializará correctamente en start() o restart()
        this.lastCircleRadius = this.config.initialRadius;
        this.planeOffset = 0; // Para el efecto 3D simulado de los círculos

        this.mode = 'dark'; // Modo inicial (dark/light)
        // this.toggleMode(); // Llama si quieres que el modo inicial sea 'light'

        this.adjustCanvasSize();
        window.addEventListener('resize', () => this.adjustCanvasSize());
    }

    adjustCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Si la animación está corriendo, podría ser bueno redibujar o reiniciar elementos
        // para que se ajusten al nuevo tamaño. Por ahora, solo ajusta dimensiones.
        if (this.isRunning) {
            this.updateBackground(); // Redibuja el fondo inmediatamente
        }
    }

    createCircle(radius) {
        const color = this.config.color || this.config.initialColor; // Usa el color actual, o el inicial como fallback
        const size = this.config.size;
        const xOffset = 10 * Math.cos(this.planeOffset); // Efecto de profundidad
        const yOffset = 10 * Math.sin(this.planeOffset); // Efecto de profundidad

        for (let i = 0; i < this.config.numPoints; i++) {
            const angle = (2 * Math.PI * i) / this.config.numPoints;
            const p = new Particle(
                this.ctx,    // ctx
                angle,       // angle
                radius,      // radius
                this.direction, // direction
                this.config.speed, // speed
                xOffset,     // xAngleOffset
                yOffset,     // yAngleOffset
                this.config.size   // baseSize
            );
            p.color = color; // opcional
            this.particles.push(p);
        }
        this.direction *= -1; // Alterna la dirección para el siguiente círculo
        this.planeOffset += this.config.planeAngle;
    }

    animate() {
        if (!this.isRunning) return;

        this.animationFrameId = requestAnimationFrame(() => this.animate());

        const currentTime = performance.now();
        const timeElapsedSinceLastCircle = (currentTime - this.lastCircleTime) / 1000; // en segundos

        if (timeElapsedSinceLastCircle > this.config.circleInterval && this.lastCircleRadius > this.config.radiusDecrementStep) {
            this.lastCircleRadius -= this.config.radiusDecrementStep;
            this.createCircle(this.lastCircleRadius);
            this.lastCircleTime = currentTime;
            // this.toggleMode(); // Opcional: cambiar el modo cada vez que se crea un círculo
        }

        this.updateBackground(); // Limpia y dibuja el fondo

        this.particles.forEach(particle => {
            particle.update(currentTime); // Asumimos que Particle usa currentTime para su movimiento
            this.particleRenderer.draw(this.ctx, particle);
        });

        if (this.particles.length > 1) { // Solo dibujar bordes si hay suficientes partículas
            this.drawEdges(currentTime);
        }
    }

    drawEdges(currentTime) {
        // Dinamismo en la selección de partículas para conectar
        const frameCount = Math.floor(currentTime / this.config.changeFrequency);
        // La rotación añade otro nivel de dinamismo, cambiando el "punto de inicio" del patrón de conexión.
        const rotation = frameCount % this.particles.length;
        const frame  = Math.floor(currentTime / this.config.changeFrequency);
        const skip   = Math.floor(Math.abs(Math.sin(frame * 0.1)) * (this.particles.length / 3)) + 1;
        const offset = frame % this.particles.length;
        this.ctx.save();
        this.ctx.strokeStyle = `hsl(${(currentTime / 20) % 360},100%,70%)`;
        this.ctx.lineWidth   = this.config.lineWidth;
        this.ctx.globalAlpha = 0.5;
        for (let i = 0; i < this.particles.length; i++) {
            const a = this.particles[i];
            const b = this.particles[(i + skip + offset) % this.particles.length];
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.ctx.globalAlpha = 1.0; // Restaurar alpha global
    }

    toggleMode() {
        this.mode = this.mode === 'light' ? 'dark' : 'light';
        this.updateBackground(); // Actualiza el fondo inmediatamente al cambiar de modo
        console.log("Animation mode toggled to:", this.mode);
    }

    updateBackground() {
        // Guardar estado actual del contexto (opcional, pero buena práctica si se cambian muchos estados)
        // this.ctx.save();

        this.ctx.fillStyle = this.mode === 'light' ? this.config.lightBackgroundColor : this.config.darkBackgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Restaurar estado (si se guardó)
        // this.ctx.restore();
    }
    updateConfig(property, value) {
        if (this.config[property] === value) return; // Evita cambios innecesarios
        this.config[property] = value;
    
        // Cambios que requieren reiniciar toda la animación
        if (property === 'numPoints' || property === 'initialColor' || property === 'initialRadius') {
            if (this.isRunning) this.restart();
            return;
        }
    
        // Cambio de color: sincroniza renderer y partículas existentes
        if (property === 'color') {
            this.particleRenderer.style.color = value;
            this.particles.forEach(p => p.color = value);
            return;
        }
    
        // Cambios que afectan a las partículas existentes
        if (property === 'size') {
            this.particles.forEach(p => { p.size = value; p.baseSize = value; });
            return;
        }
        if (property === 'speed') {
            this.particles.forEach(p => { p.speed = value; });
            return;
        }
    
        // Cambios globales (se reflejan en cada frame, ej: lineWidth)
        // No se requiere acción aquí, ya que drawEdges lee de this.config.lineWidth, etc.
    
        // Si tienes propiedades que afectan el renderer (gradiente, glow, etc.):
        if (property === 'gradiente' || property === 'glow') {
            this.particleRenderer.style[property] = value;
            return;
        }
        // Otros casos pueden ir aquí...
    }
    

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastCircleTime = performance.now(); // Establecer el tiempo de referencia
            this.lastCircleRadius = this.config.initialRadius; // Reiniciar radio para el primer círculo

            if (this.particles.length === 0) { // Solo crear círculo si el array está vacío (inicio fresco)
                this.createCircle(this.lastCircleRadius);
                 // this.toggleMode(); // Opcional: si quieres cambiar de modo al iniciar la primera vez
            }
            this.animate();
        }
    }

    stop() {
        if (this.isRunning) {
            cancelAnimationFrame(this.animationFrameId);
            this.isRunning = false;
        }
    }

    restart() {
        this.stop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpia el canvas
        this.particles = []; // Vacía el array de partículas
        this.direction = 1; // Resetea la dirección
        this.planeOffset = 0; // Resetea el offset del plano
        // this.mode = 'dark'; // Opcional: resetear el modo a un valor por defecto
        this.lastCircleRadius = this.config.initialRadius; // Restaura el radio inicial
        this.start(); // Llama a start, que configurará lastCircleTime y creará el primer círculo
    }
}

export default Animation;