"use client";
import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Transformer, Rect } from "react-konva";
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
  const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);

  const {
    activeTool,
    shapes,
    addShape,
    updateShape,
    setSelectedShapeIds,
    setActiveTool,
    selectedShapeIds,
    removeShape,
    undo,
    redo,
  } = useAppStore();

  // Attach nodes to transformer when selection changes
  useEffect(() => {
    if (trRef.current && stageRef.current) {
      const nodes = selectedShapeIds
        .map(id => stageRef.current.findOne(`#${id}`))
        .filter(Boolean);
      trRef.current.nodes(nodes);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeIds, shapes.length]);

  // Handle global keydown events, such as deleting the selected shape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if we are typing inside an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (selectedShapeIds.length > 0 && (e.key === "Delete" || e.key === "Backspace")) {
        selectedShapeIds.forEach(id => removeShape(id));
        setSelectedShapeIds([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedShapeIds, removeShape, undo, redo]);

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
        setSelectedShapeIds([]);
        const stage = e.target.getStage();
        if (stage) {
          const worldPos = getPointerPositionInWorld(stage);
          if (worldPos) {
            setSelectionBox({
              x: worldPos.x,
              y: worldPos.y,
              width: 0,
              height: 0,
            });
          }
        }
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
    const stage = e.target.getStage();
    if (!stage) return;

    const worldPos = getPointerPositionInWorld(stage);
    if (!worldPos) return;

    if (activeTool === "pointer" && selectionBox) {
      setSelectionBox((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          width: worldPos.x - prev.x,
          height: worldPos.y - prev.y,
        };
      });
      return;
    }

    if (!isDrawing || !currentShapeId || !drawableTools.includes(activeTool))
      return;

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
  const handlePointerUp = (e: KonvaEventObject<PointerEvent>) => {
    if (activeTool === "pointer" && selectionBox) {
      const box = {
        x: Math.min(selectionBox.x, selectionBox.x + selectionBox.width),
        y: Math.min(selectionBox.y, selectionBox.y + selectionBox.height),
        width: Math.abs(selectionBox.width),
        height: Math.abs(selectionBox.height),
      };

      const shapesInBox = shapes.filter((shape) => {
        return shape.x >= box.x && shape.x <= box.x + box.width &&
               shape.y >= box.y && shape.y <= box.y + box.height;
      });
      
      setSelectedShapeIds(shapesInBox.map(s => s.id));
      setSelectionBox(null);
      return;
    }

    if (!isDrawing) return;

    setIsDrawing(false);
    setSelectedShapeIds([currentShapeId as string]);
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
          ref={stageRef}
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
            {selectedShapeIds.length > 0 && (
              <Transformer
                ref={trRef}
                borderStroke="#ffffff"
                ignoreStroke={true}
                borderStrokeWidth={1}
                anchorSize={10}
                anchorFill="#ffffff"
                anchorStroke="#ffffff"
                anchorStrokeWidth={1}
                anchorCornerRadius={5}
                rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
                    return oldBox;
                  }
                  const gridSize = 20;
                  return {
                    ...newBox,
                    x: Math.round(newBox.x / gridSize) * gridSize,
                    y: Math.round(newBox.y / gridSize) * gridSize,
                    width: Math.round(newBox.width / gridSize) * gridSize,
                    height: Math.round(newBox.height / gridSize) * gridSize,
                  };
                }}
              />
            )}
            {selectionBox && (
              <Rect
                x={selectionBox.x}
                y={selectionBox.y}
                width={selectionBox.width}
                height={selectionBox.height}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="#3b82f6"
                strokeWidth={1}
                listening={false}
              />
            )}
          </Layer>
        </Stage>
      </EditorContextMenu>
    </div>
  );
}
