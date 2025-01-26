"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Animation } from "../lib/animation"

interface CanvasProps {
  config: any
  isRunning: boolean
}

const Canvas: React.FC<CanvasProps> = ({ config, isRunning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      const aspectRatio = 16 / 9
      let newWidth, newHeight

      if (width / height > aspectRatio) {
        newHeight = height
        newWidth = height * aspectRatio
      } else {
        newWidth = width
        newHeight = width / aspectRatio
      }

      setDimensions({ width: newWidth, height: newHeight })
    }
  }, [])

  useEffect(() => {
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [updateDimensions])

  useEffect(() => {
    if (canvasRef.current && dimensions.width > 0 && dimensions.height > 0) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = dimensions.width
        canvas.height = dimensions.height
        if (!animationRef.current) {
          animationRef.current = new Animation(canvas, config)
        } else {
          animationRef.current.updateCanvasSize(dimensions.width, dimensions.height)
          animationRef.current.updateConfig(config)
        }
        animationRef.current.draw()
      }
    }
  }, [config, dimensions])

  useEffect(() => {
    if (animationRef.current) {
      if (isRunning) {
        animationRef.current.start()
      } else {
        animationRef.current.stop()
      }
    }
  }, [isRunning])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      />
    </div>
  )
}

export default Canvas

