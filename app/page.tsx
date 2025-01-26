"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import ControlPanel from "../components/ControlPanel"

const Canvas = dynamic(() => import("../components/Canvas"), { ssr: false })

export default function Home() {
  const [config, setConfig] = useState({
    numPoints: 72,
    initialRadius: 380,
    initialColor: "#ffffff",
    size: 10,
    speed: 5,
    circleInterval: 2,
    changeFrequency: 3000,
    planeAngle: 0.1,
    direction: 1,
  })

  const [isRunning, setIsRunning] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const updateConfig = useCallback((key: string, value: number | string) => {
    setConfig((prevConfig) => ({ ...prevConfig, [key]: value }))
  }, [])

  const toggleAnimation = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  const resetAnimation = useCallback(() => {
    setConfig({
      numPoints: 72,
      initialRadius: 380,
      initialColor: "#ffffff",
      size: 10,
      speed: 5,
      circleInterval: 2,
      changeFrequency: 3000,
      planeAngle: 0.1,
      direction: 1,
    })
    setIsRunning(false)
  }, [])

  const randomizeConfig = useCallback(() => {
    setConfig({
      numPoints: Math.floor(Math.random() * (200 - 3 + 1)) + 3,
      initialRadius: 380,
      initialColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      size: Math.random() * (20 - 1) + 1,
      speed: Math.random() * (20 - 1) + 1,
      circleInterval: 2,
      changeFrequency: 3000,
      planeAngle: Math.random() * Math.PI * 2,
      direction: Math.random() < 0.5 ? -1 : 1,
    })
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">Animación Interactiva</h1>
      </header>
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="flex-grow relative">{isLoaded && <Canvas config={config} isRunning={isRunning} />}</div>
        <ControlPanel
          config={config}
          updateConfig={updateConfig}
          isRunning={isRunning}
          toggleAnimation={toggleAnimation}
          resetAnimation={resetAnimation}
          randomizeConfig={randomizeConfig}
        />
      </main>
    </div>
  )
}

