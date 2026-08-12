"use client";
import { useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { getPointerPositionInWorld } from "@/lib/get-pointer-position-in-world";
import { EditorContextMenu } from "../ui/editor-context-menu";
import { ShapeRenderer } from "./shape-renderer";
import { useAppStore } from "../store/useAppStore";

export default function CanvasGrid() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const gridSize = 20;
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShapeId, setCurrentShapeId] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const {
    activeTool,
    shapes,
    addShape,
    updateShape,
    setSelectedShapeId,
    setActiveTool,
    selectedShapeId,
    removeShape,
  } = useAppStore();

  // Handle global keydown events, such as deleting the selected shape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't delete if we are typing inside an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLElement && e.target.isContentEditable
      ) {
        return;
      }

      if (selectedShapeId && (e.key === "Delete" || e.key === "Backspace")) {
        removeShape(selectedShapeId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapeId, removeShape]);

  // Handle window resize to update stage dimensions
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (dimensions.width === 0) return null;

  // Handle zooming and panning
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;

    if (e.evt.ctrlKey) {
      const scaleBy = 1.02;
      const oldScale = scale;
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stagePos.x) / oldScale,
        y: (pointer.y - stagePos.y) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      setScale(newScale);
      setStagePos({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    } else {
      setStagePos((prev) => ({
        x: prev.x - e.evt.deltaX,
        y: prev.y - e.evt.deltaY,
      }));
    }
  };

  // Update stage position after dragging
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (activeTool === "pan") {
      setStagePos({ x: e.target.x(), y: e.target.y() });
    }
  };

  const drawableTools = ["rect", "circle", "diamond", "line", "arrow", "triangle", "polyline", "text"];

  // Handle drawing new shapes
  const handlePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    if (activeTool === "pointer") {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        useAppStore.getState().setSelectedShapeId(null);
      }
      return;
    }

    if (!drawableTools.includes(activeTool)) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const worldPos = getPointerPositionInWorld(stage);
    if (!worldPos) return;

    const snappedStartX = Math.round(worldPos.x / gridSize) * gridSize;
    const snappedStartY = Math.round(worldPos.y / gridSize) * gridSize;
    const snappedStartPos = { x: snappedStartX, y: snappedStartY };

    setIsDrawing(true);
    const newId = crypto.randomUUID();
    setCurrentShapeId(newId);
    setStartPos(snappedStartPos);

    const baseProps = {
      id: newId,
      x: snappedStartX,
      y: snappedStartY,
      rotation: 0,
      isLocked: false,
      fill: "rgba(255, 255, 255, 0.1)",
      stroke: "rgba(255, 255, 255, 0.5)",
      strokeWidth: 1,
    };

    if (activeTool === "rect") {
      addShape({ ...baseProps, type: "rect", width: 0, height: 0 });
    } else if (activeTool === "circle") {
      addShape({ ...baseProps, type: "circle", radius: 0 });
    } else if (activeTool === "diamond" || activeTool === "triangle") {
      addShape({ ...baseProps, type: activeTool as "diamond" | "triangle", radius: 0 });
    } else if (activeTool === "line" || activeTool === "arrow" || activeTool === "polyline") {
      addShape({ ...baseProps, type: activeTool as "line" | "arrow" | "polyline", points: [0, 0, 0, 0] });
    } else if (activeTool === "text") {
      addShape({ ...baseProps, type: "text", text: "Type here...", fontSize: 20, fill: "#ffffff", strokeWidth: 0 });
    }
  };

  // Handle updating shape dimensions while drawing
  const handlePointerMove = (e: KonvaEventObject<PointerEvent>) => {
    if (!isDrawing || !currentShapeId || !drawableTools.includes(activeTool))
      return;

    const stage = e.target.getStage();
    if (!stage) return;

    const worldPos = getPointerPositionInWorld(stage);
    if (!worldPos) return;

    const snappedCurrentX = Math.round(worldPos.x / gridSize) * gridSize;
    const snappedCurrentY = Math.round(worldPos.y / gridSize) * gridSize;

    if (activeTool === "rect") {
      const width = snappedCurrentX - startPos.x;
      const height = snappedCurrentY - startPos.y;
      updateShape(currentShapeId, { width, height });
    } else if (activeTool === "circle" || activeTool === "diamond" || activeTool === "triangle") {
      const dx = snappedCurrentX - startPos.x;
      const dy = snappedCurrentY - startPos.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      updateShape(currentShapeId, { radius });
    } else if (activeTool === "line" || activeTool === "arrow" || activeTool === "polyline") {
      const dx = snappedCurrentX - startPos.x;
      const dy = snappedCurrentY - startPos.y;
      updateShape(currentShapeId, { points: [0, 0, dx, dy] });
    }
  };

  // Handle pointer up event to finalize shape drawing
  const handlePointerUp = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    setSelectedShapeId(currentShapeId);
    setActiveTool("pointer");
    setCurrentShapeId(null);
  };

  const lines = [];

  // Draw vertical grid lines
  for (let i = 0; i < dimensions.width / gridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[
          Math.round(i * gridSize) + 0.5,
          0,
          Math.round(i * gridSize) + 0.5,
          dimensions.height,
        ]}
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={1}
      />,
    );
  }

  // Draw horizontal grid lines
  for (let j = 0; j < dimensions.height / gridSize; j++) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[
          0,
          Math.round(j * gridSize) + 0.5,
          dimensions.width,
          Math.round(j * gridSize) + 0.5,
        ]}
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={1}
      />,
    );
  }

  // Determine cursor style based on active tool
  const getCursorStyle = () => {
    if (activeTool === "pan") return "cursor-grab active:cursor-grabbing";
    if (activeTool === "pointer") return "cursor-default";
    return "cursor-crosshair";
  };

  return (
    <div className={`absolute inset-0 bg-black ${getCursorStyle()}`}>
      <EditorContextMenu>
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          x={stagePos.x}
          y={stagePos.y}
          scaleX={scale}
          scaleY={scale}
          onWheel={handleWheel}
          draggable={activeTool === "pan"}
          onDragEnd={handleDragEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <Layer listening={false}>{lines}</Layer>
          <Layer>
            {shapes.map((shape) => (
              <ShapeRenderer
                key={shape.id}
                shape={shape}
                activeTool={activeTool}
              />
            ))}
          </Layer>
          <Layer listening={false}>
            {/* Zde bude budoucí UI selekce (modrý obdélník při tažení) */}
          </Layer>
        </Stage>
      </EditorContextMenu>
    </div>
  );
}
