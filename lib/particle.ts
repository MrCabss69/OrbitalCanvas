export class Particle {
  private ctx: CanvasRenderingContext2D
  private angle: number
  private radius: number
  private direction: number
  private color: string
  private size: number
  private xOffset: number
  private yOffset: number
  private speed: number
  public x: number
  public y: number

  constructor(
    ctx: CanvasRenderingContext2D,
    angle: number,
    radius: number,
    direction: number,
    color: string,
    size: number,
    xOffset = 0,
    yOffset = 0,
    centerX: number,
    centerY: number,
  ) {
    if (!ctx || angle === undefined || !radius) {
      throw new Error("Missing required parameters")
    }
    this.ctx = ctx
    this.angle = angle
    this.radius = Math.max(0, radius)
    this.direction = direction
    this.color = color
    this.size = Math.max(0, size)
    this.xOffset = xOffset
    this.yOffset = yOffset
    this.speed = 1
    this.x = centerX + Math.cos(angle) * radius
    this.y = centerY + Math.sin(angle) * radius
  }

  update(currentTime: number, centerX: number, centerY: number) {
    const timeScale = (currentTime / 1000) * this.speed
    const angle = this.angle + this.xOffset + this.direction * timeScale
    this.x = centerX + Math.cos(angle) * this.radius
    this.y = centerY + Math.sin(angle) * this.radius
  }

  draw() {
    this.ctx.save()
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }
}

