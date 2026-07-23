"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
} from "lucide-react";
import { useAppStore, Tool } from "../store/useAppStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ToolButton = ({
  tool,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  tool: Tool;
  icon: any;
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
  const { activeTool, setActiveTool } = useAppStore();

  return (
    <section>
      <Tabs
        defaultValue="account"
        className="w-full absolute top-6 left-6 z-10 max-w-xs  text-white shadow-2xl pointer-events-auto"
      >
        {/* <TabsList className="bg-black rounded-tl-lg rounded-tr-lg mb-0 p-1">
          <TabsTrigger value="account" className="">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList> */}
        <TabsContent value="account">
          <Card className=" w-full max-w-xs bg-black text-white shadow-2xl pointer-events-auto">
            <CardHeader>
              <CardTitle>Diagram Editor</CardTitle>
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
                    onClick={() => setActiveTool("triangle" as any)}
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
                    onClick={() => setActiveTool("line" as any)}
                  />
                  <ToolButton
                    tool="polyline"
                    icon={Activity}
                    label="Polyline"
                    isActive={activeTool === "polyline"}
                    onClick={() => setActiveTool("polyline" as any)}
                  />
                  <ToolButton
                    tool="arrow"
                    icon={ArrowUpRight}
                    label="Arrow"
                    isActive={activeTool === "arrow"}
                    onClick={() => setActiveTool("arrow" as any)}
                  />
                  <ToolButton
                    tool="text"
                    icon={Type}
                    label="Text"
                    isActive={activeTool === "text"}
                    onClick={() => setActiveTool("text" as any)}
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
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </section>
  );
}
