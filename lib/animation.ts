import { Particle } from "./particle"

export class Animation {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private config: any
  private particles: Particle[]
  private direction: number
  private isRunning: boolean
  private baseTime: number
  private lastCircleTime: number
  private lastCircleRadius: number
  private planeOffset: number
  private mode: "light" | "dark"
  private animationFrameId: number | null
  private aspectRatio: number
  private maxParticles = 200

  constructor(canvas: HTMLCanvasElement, config: any) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.config = config
    this.particles = []
    this.direction = 1
    this.isRunning = false
    this.baseTime = performance.now()
    this.lastCircleTime = this.baseTime
    this.aspectRatio = 16 / 9
    this.lastCircleRadius = this.calculateInitialRadius()
    this.planeOffset = 0
    this.mode = "dark"
    this.animationFrameId = null
    this.createCircle(this.lastCircleRadius)
  }

  private calculateInitialRadius(): number {
    const canvasAspectRatio = this.canvas.width / this.canvas.height
    let radius
    if (canvasAspectRatio > this.aspectRatio) {
      radius = (this.canvas.height / 2) * 0.8
    } else {
      radius = (this.canvas.width / 2) * 0.8
    }
    return radius
  }

  updateCanvasSize(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
    this.lastCircleRadius = this.calculateInitialRadius()
    this.recreateParticles()
  }

  private recreateParticles() {
    this.particles = []
    this.createCircle(this.lastCircleRadius)
  }

  createCircle(radius: number) {
    if (!this.ctx || !this.config) return
    if (!radius || radius <= 0) return

    const color = this.config.initialColor || "#ffffff"
    const size = this.config.size || 10
    const xOffset = 10 * Math.cos(this.planeOffset)
    const yOffset = 10 * Math.sin(this.planeOffset)

    const numPoints = Math.min(this.config.numPoints || 72, this.maxParticles)
    for (let i = 0; i < numPoints; i++) {
      const angle = (2 * Math.PI * i) / numPoints
      this.particles.push(
        new Particle(
          this.ctx,
          angle,
          radius,
          this.direction || 1,
          color,
          size || 1,
          xOffset,
          yOffset,
          this.canvas.width / 2,
          this.canvas.height / 2,
        ),
      )
    }
    this.direction *= -1
    this.planeOffset += this.config.planeAngle || 0.1
  }

  animate(time: number) {
    if (!this.isRunning) return

    const deltaTime = time - this.lastCircleTime

    if (deltaTime > this.config.circleInterval * 1000 && this.lastCircleRadius > 10) {
      this.lastCircleRadius -= 10
      this.createCircle(this.lastCircleRadius)
      this.lastCircleTime = time
      this.toggleMode()
    } else if (this.lastCircleRadius <= 10) {
      this.stop()
      return
    }

    this.draw(time)
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this))
  }

  draw(time: number = performance.now()) {
    this.updateBackground()
    this.particles.forEach((particle) => {
      particle.update(time, this.canvas.width / 2, this.canvas.height / 2)
      particle.draw()
    })
    this.drawEdges(time)
  }

  calculateEdgeParameters(time: number) {
    const frameCount = Math.floor(time / this.config.changeFrequency)
    return {
      skip: Math.floor(Math.abs(Math.sin(frameCount)) * (this.particles.length / 2)) + 1,
      rotation: frameCount % this.particles.length,
      color: `hsl(${(time / 10) % 360}, 100%, 50%)`,
    }
  }

  drawEdges(time: number) {
    const { skip, rotation, color } = this.calculateEdgeParameters(time)

    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 1

    this.ctx.beginPath()
    this.particles.forEach((start, i) => {
      const end = this.particles[(i + skip + rotation) % this.particles.length]
      this.ctx.moveTo(start.x, start.y)
      this.ctx.lineTo(end.x, end.y)
    })
    this.ctx.stroke()
  }

  toggleMode() {
    this.mode = this.mode === "light" ? "dark" : "light"
    this.updateBackground()
  }

  updateBackground() {
    this.ctx.fillStyle = this.mode === "light" ? "white" : "black"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  updateConfig(newConfig: any) {
    this.config = { ...this.config, ...newConfig }
    this.recreateParticles()
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.lastCircleTime = performance.now()
      this.animate(this.lastCircleTime)
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.isRunning = false
  }

  restart() {
    this.stop()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.particles = []
    this.direction = 1
    this.planeOffset = 0
    this.lastCircleTime = performance.now()
    this.lastCircleRadius = this.calculateInitialRadius()
    this.createCircle(this.lastCircleRadius)
    this.start()
  }
}

