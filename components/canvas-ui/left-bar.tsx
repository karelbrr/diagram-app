"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { ElementType } from "react";
import { useAppStore, Tool } from "../store/useAppStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ToolButton = ({
  icon: Icon,
  label,
  shortcut,
  isActive,
  onClick,
}: {
  tool: Tool;
  icon: ElementType;
  label: string;
  shortcut?: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={5}
        className="bg-zinc-800 text-white border-zinc-700"
      >
        <p className="text-xs">
          {label}{" "}
          {shortcut && <span className="text-zinc-400">({shortcut})</span>}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export function LeftBar() {
  const {
    activeTool,
    setActiveTool,
    selectedShapeIds,
    shapes,
    updateShape,
    saveHistory,
    clearShapes,
  } = useAppStore();
  const selectedShape =
    selectedShapeIds.length > 0
      ? shapes.find((s) => s.id === selectedShapeIds[0])
      : undefined;

  const getHexValue = (color: string) => {
    if (color && color.startsWith("#")) return color;
    return "#ffffff"; // Default fallback for rgba or named colors
  };

  const handleUpdateMany = (
    updates: Partial<import("../store/useAppStore").Shape>,
  ) => {
    selectedShapeIds.forEach((id) => updateShape(id, updates));
  };

  return (
    <section>
      <Tabs
        defaultValue="tools"
        className="w-full absolute top-6 left-6 z-10 max-w-xs  text-white shadow-2xl pointer-events-auto"
      >
        <TabsList className="bg-black rounded-tl-lg rounded-tr-lg mb-0 p-1 w-full flex">
          <TabsTrigger value="tools" className="flex-1">
            Tools
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
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
                    shortcut="V"
                    isActive={activeTool === "pointer"}
                    onClick={() => setActiveTool("pointer")}
                  />
                  <ToolButton
                    tool="pan"
                    icon={Hand}
                    label="Pan"
                    shortcut="H"
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
                    shortcut="R"
                    isActive={activeTool === "rect"}
                    onClick={() => setActiveTool("rect")}
                  />
                  <ToolButton
                    tool="circle"
                    icon={Circle}
                    label="Circle"
                    shortcut="C"
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
                    shortcut="D"
                    isActive={activeTool === "diamond"}
                    onClick={() => setActiveTool("diamond")}
                  />
                  <ToolButton
                    tool="line"
                    icon={Minus}
                    label="Line"
                    shortcut="L"
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
                    shortcut="T"
                    isActive={activeTool === "text"}
                    onClick={() => setActiveTool("text")}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-3 bg-black pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-zinc-800 text-white bg-white/5 hover:bg-zinc-800 hover:text-white"
                  >
                    Clear Canvas
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-black text-white border-zinc-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      This will move all shapes on the canvas to the trash.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent text-white border-zinc-800 hover:bg-zinc-800 hover:text-white">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearShapes}
                      className="bg-red-900/50 text-red-400 hover:bg-red-900/70 border-0"
                    >
                      Clear Canvas
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
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
                <div className="text-sm text-zinc-400">
                  Select a shape to edit its properties.
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {selectedShapeIds.length > 1 && (
                    <div className="text-xs text-blue-400 bg-blue-900/30 p-2 rounded border border-blue-800/50">
                      Multiple shapes selected. Changes will apply to all.
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-300">
                      Fill Color
                    </label>
                    <div className="flex gap-3 items-center bg-zinc-900/50 p-2 rounded-md border border-zinc-800">
                      <input
                        type="color"
                        value={getHexValue(selectedShape.fill)}
                        onPointerDown={() => saveHistory()}
                        onChange={(e) =>
                          handleUpdateMany({ fill: e.target.value })
                        }
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-sm text-zinc-400 font-sans">
                        {selectedShape.fill}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-300">
                      Stroke Color
                    </label>
                    <div className="flex gap-3 items-center bg-zinc-900/50 p-2 rounded-md border border-zinc-800">
                      <input
                        type="color"
                        value={getHexValue(selectedShape.stroke)}
                        onPointerDown={() => saveHistory()}
                        onChange={(e) =>
                          handleUpdateMany({ stroke: e.target.value })
                        }
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                      />
                      <span className="text-sm text-zinc-400 font-sans">
                        {selectedShape.stroke}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-zinc-300">
                        Stroke Width
                      </label>
                      <span className="text-xs text-zinc-400">
                        {selectedShape.strokeWidth}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={selectedShape.strokeWidth}
                      onPointerDown={() => saveHistory()}
                      onChange={(e) =>
                        handleUpdateMany({
                          strokeWidth: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-zinc-300">
                      Stroke Style
                    </label>
                    <Select
                      value={
                        selectedShape.dash?.length
                          ? selectedShape.dash[0] === 10
                            ? "dashed"
                            : "dotted"
                          : "solid"
                      }
                      onValueChange={(val) => {
                        saveHistory();
                        handleUpdateMany({
                          dash:
                            val === "dashed"
                              ? [10, 10]
                              : val === "dotted"
                                ? [2, 6]
                                : [],
                        });
                      }}
                    >
                      <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-800 h-8 text-xs focus:ring-1 focus:ring-zinc-700">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 text-white border-zinc-800">
                        <SelectItem
                          value="solid"
                          className="focus:bg-zinc-800 focus:text-white"
                        >
                          Solid
                        </SelectItem>
                        <SelectItem
                          value="dashed"
                          className="focus:bg-zinc-800 focus:text-white"
                        >
                          Dashed
                        </SelectItem>
                        <SelectItem
                          value="dotted"
                          className="focus:bg-zinc-800 focus:text-white"
                        >
                          Dotted
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-medium text-zinc-300">
                        Opacity
                      </label>
                      <span className="text-xs text-zinc-400">
                        {Math.round((selectedShape.opacity ?? 1) * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[(selectedShape.opacity ?? 1) * 100]}
                      max={100}
                      step={1}
                      onPointerDown={() => saveHistory()}
                      onValueChange={(vals) =>
                        handleUpdateMany({ opacity: vals[0] / 100 })
                      }
                      className="py-1"
                    />
                  </div>

                  {selectedShape.type === "text" && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-zinc-300">
                          Text Align
                        </label>
                        <div className="flex gap-1">
                          <Button
                            variant={
                              (selectedShape as any).textAlign === "left" ||
                              !(selectedShape as any).textAlign
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={`flex-1 h-8 ${(selectedShape as any).textAlign === "left" || !(selectedShape as any).textAlign ? "" : "bg-transparent text-zinc-400 hover:text-white border-zinc-800"}`}
                            onClick={() => {
                              saveHistory();
                              handleUpdateMany({ textAlign: "left" });
                            }}
                          >
                            <AlignLeft size={14} />
                          </Button>
                          <Button
                            variant={
                              (selectedShape as any).textAlign === "center"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={`flex-1 h-8 ${(selectedShape as any).textAlign === "center" ? "" : "bg-transparent text-zinc-400 hover:text-white border-zinc-800"}`}
                            onClick={() => {
                              saveHistory();
                              handleUpdateMany({ textAlign: "center" });
                            }}
                          >
                            <AlignCenter size={14} />
                          </Button>
                          <Button
                            variant={
                              (selectedShape as any).textAlign === "right"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={`flex-1 h-8 ${(selectedShape as any).textAlign === "right" ? "" : "bg-transparent text-zinc-400 hover:text-white border-zinc-800"}`}
                            onClick={() => {
                              saveHistory();
                              handleUpdateMany({ textAlign: "right" });
                            }}
                          >
                            <AlignRight size={14} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <label className="text-xs font-medium text-zinc-300">
                            Font Size
                          </label>
                          <span className="text-xs text-zinc-400">
                            {
                              (
                                selectedShape as import("../store/useAppStore").TextShape
                              ).fontSize
                            }
                            px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={
                            (
                              selectedShape as import("../store/useAppStore").TextShape
                            ).fontSize
                          }
                          onPointerDown={() => saveHistory()}
                          onChange={(e) =>
                            handleUpdateMany({
                              fontSize: parseInt(e.target.value),
                            })
                          }
                          className="w-full accent-white"
                        />
                      </div>
                    </>
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
