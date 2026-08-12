"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Square,
  Circle,
  Triangle,
  Diamond,
  Minus,
  Activity,
  ArrowUpRight,
  Type,
  MousePointer2,
  Hand,
  Shapes,
} from "lucide-react";
import { ElementType } from "react";
import { useAppStore, Tool } from "../store/useAppStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ToolButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  tool: Tool;
  icon: ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={`h-20 flex-col gap-2 border-zinc-800 ${
        isActive
          ? "bg-accent text-white hover:bg-accent/70"
          : "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      <Icon className="h-6 w-6" strokeWidth={1.5} />
      <span className="text-[10px] font-normal">{label}</span>
    </Button>
  );
};

export function LeftBar() {
  const { activeTool, setActiveTool, selectedShapeIds, shapes, updateShape, saveHistory } = useAppStore();
  const selectedShape = selectedShapeIds.length > 0 ? shapes.find(s => s.id === selectedShapeIds[0]) : undefined;

  const getHexValue = (color: string) => {
    if (color && color.startsWith("#")) return color;
    return "#ffffff"; // Default fallback for rgba or named colors
  };

  const handleUpdateMany = (updates: Partial<import("../store/useAppStore").Shape>) => {
    selectedShapeIds.forEach(id => updateShape(id, updates));
  };

  return (
    <section>
      <Tabs
        defaultValue="tools"
        className="w-full absolute top-6 left-6 z-10 max-w-xs  text-white shadow-2xl pointer-events-auto"
      >
        <TabsList className="bg-black rounded-tl-lg rounded-tr-lg mb-0 p-1 w-full flex">
          <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
          <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
        </TabsList>
        <TabsContent value="tools">
          <Card className=" w-full max-w-xs bg-black text-white shadow-2xl pointer-events-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shapes className="h-5 w-5 text-zinc-300" />
                diagram editor
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Select shapes and tools to draw.
              </CardDescription>
              <CardAction>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-white bg-transparent hover:bg-zinc-800 hover:text-white"
                >
                  View
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4">
                <span className="text-sm font-medium text-zinc-300">
                  Basic Tools
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <ToolButton
                    tool="pointer"
                    icon={MousePointer2}
                    label="Pointer"
                    isActive={activeTool === "pointer"}
                    onClick={() => setActiveTool("pointer")}
                  />
                  <ToolButton
                    tool="pan"
                    icon={Hand}
                    label="Pan"
                    isActive={activeTool === "pan"}
                    onClick={() => setActiveTool("pan")}
                  />
                </div>

                <span className="text-sm font-medium text-zinc-300 mt-2">
                  Shapes
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <ToolButton
                    tool="rect"
                    icon={Square}
                    label="Rect"
                    isActive={activeTool === "rect"}
                    onClick={() => setActiveTool("rect")}
                  />
                  <ToolButton
                    tool="circle"
                    icon={Circle}
                    label="Circle"
                    isActive={activeTool === "circle"}
                    onClick={() => setActiveTool("circle")}
                  />
                  <ToolButton
                    tool="triangle"
                    icon={Triangle}
                    label="Triangle"
                    isActive={activeTool === "triangle"}
                    onClick={() => setActiveTool("triangle")}
                  />
                  <ToolButton
                    tool="diamond"
                    icon={Diamond}
                    label="Diamond"
                    isActive={activeTool === "diamond"}
                    onClick={() => setActiveTool("diamond")}
                  />
                  <ToolButton
                    tool="line"
                    icon={Minus}
                    label="Line"
                    isActive={activeTool === "line"}
                    onClick={() => setActiveTool("line")}
                  />
                  <ToolButton
                    tool="polyline"
                    icon={Activity}
                    label="Polyline"
                    isActive={activeTool === "polyline"}
                    onClick={() => setActiveTool("polyline")}
                  />
                  <ToolButton
                    tool="arrow"
                    icon={ArrowUpRight}
                    label="Arrow"
                    isActive={activeTool === "arrow"}
                    onClick={() => setActiveTool("arrow")}
                  />
                  <ToolButton
                    tool="text"
                    icon={Type}
                    label="Text"
                    isActive={activeTool === "text"}
                    onClick={() => setActiveTool("text")}
                  />
                </div>
              </div>
            </CardContent>

            {/* <CardFooter className="flex-col gap-3 bg-black">
        <Button
          variant="outline"
          className="w-full border-zinc-800 text-white bg-white/5 hover:bg-zinc-800 hover:text-white"
        >
          Clear Canvas
        </Button>
        <Button
          variant="outline"
          className="w-full border-zinc-800 text-white bg-white/5 hover:bg-zinc-800 hover:text-white"
        >
          Save Diagram
        </Button>
      </CardFooter> */}
          </Card>
        </TabsContent>
        <TabsContent value="properties">
          <Card className="w-full max-w-xs bg-black text-white shadow-2xl pointer-events-auto">
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription className="text-zinc-400">
                Edit the selected shape.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedShape ? (
                <div className="text-sm text-zinc-400">Select a shape to edit its properties.</div>
              ) : (
                <div className="flex flex-col gap-6">
                  {selectedShapeIds.length > 1 && (
                    <div className="text-xs text-blue-400 bg-blue-900/30 p-2 rounded border border-blue-800/50">
                      Multiple shapes selected. Changes will apply to all.
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-300">Fill Color</label>
                    <div className="flex gap-3 items-center bg-zinc-900/50 p-2 rounded-md border border-zinc-800">
                      <input 
                        type="color" 
                        value={getHexValue(selectedShape.fill)} 
                        onPointerDown={() => saveHistory()}
                        onChange={(e) => handleUpdateMany({ fill: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-sm text-zinc-400 font-mono">{selectedShape.fill}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-300">Stroke Color</label>
                    <div className="flex gap-3 items-center bg-zinc-900/50 p-2 rounded-md border border-zinc-800">
                      <input 
                        type="color" 
                        value={getHexValue(selectedShape.stroke)} 
                        onPointerDown={() => saveHistory()}
                        onChange={(e) => handleUpdateMany({ stroke: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-sm text-zinc-400 font-mono">{selectedShape.stroke}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-zinc-300">Stroke Width</label>
                      <span className="text-xs text-zinc-400">{selectedShape.strokeWidth}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="20" 
                      value={selectedShape.strokeWidth} 
                      onPointerDown={() => saveHistory()}
                      onChange={(e) => handleUpdateMany({ strokeWidth: parseInt(e.target.value) })}
                      className="w-full accent-white"
                    />
                  </div>

                  {selectedShape.type === "text" && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <label className="text-xs font-medium text-zinc-300">Font Size</label>
                        <span className="text-xs text-zinc-400">{(selectedShape as import("../store/useAppStore").TextShape).fontSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={(selectedShape as import("../store/useAppStore").TextShape).fontSize} 
                        onPointerDown={() => saveHistory()}
                        onChange={(e) => handleUpdateMany({ fontSize: parseInt(e.target.value) })}
                        className="w-full accent-white"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
