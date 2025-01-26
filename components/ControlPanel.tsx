import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ControlPanelProps {
  config: any
  updateConfig: (key: string, value: number | string) => void
  isRunning: boolean
  toggleAnimation: () => void
  resetAnimation: () => void
  randomizeConfig: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  updateConfig,
  isRunning,
  toggleAnimation,
  resetAnimation,
  randomizeConfig,
}) => {
  return (
    <div className="w-full md:w-96 p-4 bg-gray-800 overflow-y-auto">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="numPoints" className="text-sm font-medium">
              Número de Puntos
            </Label>
            <Slider
              id="numPoints"
              min={3}
              max={200}
              step={1}
              value={[config.numPoints]}
              onValueChange={(value) => updateConfig("numPoints", value[0])}
              className="my-2"
            />
            <Input
              type="number"
              value={config.numPoints}
              onChange={(e) => updateConfig("numPoints", Math.min(Number.parseInt(e.target.value), 200))}
              className="w-20 text-black"
            />
          </div>

          <div>
            <Label htmlFor="speed" className="text-sm font-medium">
              Velocidad
            </Label>
            <Slider
              id="speed"
              min={1}
              max={20}
              step={0.1}
              value={[config.speed]}
              onValueChange={(value) => updateConfig("speed", value[0])}
              className="my-2"
            />
            <Input
              type="number"
              value={config.speed}
              onChange={(e) => updateConfig("speed", Number.parseFloat(e.target.value))}
              className="w-20 text-black"
            />
          </div>

          <div>
            <Label htmlFor="color" className="text-sm font-medium">
              Color
            </Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="color"
                type="color"
                value={config.initialColor}
                onChange={(e) => updateConfig("initialColor", e.target.value)}
                className="w-10 h-10 p-1 rounded"
              />
              <Input
                type="text"
                value={config.initialColor}
                onChange={(e) => updateConfig("initialColor", e.target.value)}
                className="flex-grow text-black"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label htmlFor="size" className="text-sm font-medium">
              Tamaño
            </Label>
            <Slider
              id="size"
              min={1}
              max={20}
              step={0.1}
              value={[config.size]}
              onValueChange={(value) => updateConfig("size", value[0])}
              className="my-2"
            />
            <Input
              type="number"
              value={config.size}
              onChange={(e) => updateConfig("size", Number.parseFloat(e.target.value))}
              className="w-20 text-black"
            />
          </div>

          <div>
            <Label htmlFor="planeAngle" className="text-sm font-medium">
              Ángulo del Plano
            </Label>
            <Slider
              id="planeAngle"
              min={0}
              max={Math.PI * 2}
              step={0.01}
              value={[config.planeAngle]}
              onValueChange={(value) => updateConfig("planeAngle", value[0])}
              className="my-2"
            />
            <Input
              type="number"
              value={config.planeAngle.toFixed(2)}
              onChange={(e) => updateConfig("planeAngle", Number.parseFloat(e.target.value))}
              className="w-20 text-black"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 space-y-2">
        <Button onClick={toggleAnimation} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isRunning ? "Detener Animación" : "Iniciar Animación"}
        </Button>
        <Button onClick={resetAnimation} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
          Reiniciar Animación
        </Button>
        <Button onClick={randomizeConfig} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Configuración Aleatoria
        </Button>
      </div>
    </div>
  )
}

export default ControlPanel

