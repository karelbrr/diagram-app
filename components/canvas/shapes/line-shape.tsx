import React from "react";
import { Group, Line, Arrow, Circle } from "react-konva";
import { Html } from "react-konva-utils";
import { KonvaEventObject } from "konva/lib/Node";
import { Shape, useAppStore } from "../../store/useAppStore";
import { useShapeHandlers } from "./use-shape-handlers";

interface LineShapeProps {
  shape: Shape;
  activeTool: string;
  scale?: number;
}

export const LineShape = ({ shape, activeTool, scale = 1 }: LineShapeProps) => {
  const {
    shapeRef,
    isDraggable,
    isSelected,
    GRID_SIZE,
    handleSelect,
    handleDragMove,
    handleDragEnd,
  } = useShapeHandlers(shape, activeTool);
  
  const { updateShape } = useAppStore();

  const handleLinePointMove = (
    index: 0 | 1,
    e: KonvaEventObject<DragEvent>,
  ) => {
    e.cancelBubble = true;
    const snappedX = Math.round(e.target.x() / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(e.target.y() / GRID_SIZE) * GRID_SIZE;

    e.target.x(snappedX);
    e.target.y(snappedY);

    const lineShape = shape as Shape & { points: number[] };
    const newPoints = [...lineShape.points];
    if (index === 0) {
      newPoints[0] = snappedX;
      newPoints[1] = snappedY;
    } else {
      newPoints[2] = snappedX;
      newPoints[3] = snappedY;
    }
    updateShape(shape.id, { points: newPoints });
  };

  const lineShape = shape as Shape & {
    x: number;
    y: number;
    points: number[];
  };
  const points = lineShape.points || [0, 0, 0, 0];
  const centerX = (points[0] + points[2]) / 2;
  const centerY = (points[1] + points[3]) / 2;
  const invScale = 1 / scale;

  return (
    <Group
      x={lineShape.x}
      y={lineShape.y}
      draggable={isDraggable}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onPointerDown={handleSelect}
    >
      {shape.type === "line" || shape.type === "polyline" ? (
        <Line
          ref={shapeRef}
          points={points}
          stroke="#ffffff"
          strokeWidth={2}
          hitStrokeWidth={20}
          lineCap="round"
        />
      ) : (
        <Arrow
          ref={shapeRef}
          points={points}
          stroke="#ffffff"
          fill="#ffffff"
          strokeWidth={2}
          hitStrokeWidth={20}
          lineCap="round"
          pointerLength={10}
          pointerWidth={10}
        />
      )}

      {isSelected && (
        <Group listening={true}>
          <Circle
            x={points[0]}
            y={points[1]}
            radius={5 * invScale}
            fill="rgba(255, 255, 255, 0.8)"
            stroke="rgba(255, 255, 255, 1)"
            strokeWidth={1 * invScale}
            draggable={true}
            onDragMove={(e) => handleLinePointMove(0, e)}
            onDragEnd={(e) => {
              e.cancelBubble = true;
            }}
            onPointerDown={(e) => {
              e.cancelBubble = true;
            }}
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              const container =
                stage && stage.container ? stage.container() : null;
              if (container) {
                container.style.cursor = "ns-resize";
              }
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              if (stage && stage.container()) {
                stage.container().style.cursor = "default";
              }
            }}
          />

          <Circle
            x={points[2]}
            y={points[3]}
            radius={5 * invScale}
            fill="rgba(255, 255, 255, 0.8)"
            stroke="rgba(255, 255, 255, 1)"
            strokeWidth={1 * invScale}
            draggable={true}
            onDragMove={(e) => handleLinePointMove(1, e)}
            onDragEnd={(e) => {
              e.cancelBubble = true;
            }}
            onPointerDown={(e) => {
              e.cancelBubble = true;
            }}
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              const container =
                stage && stage.container ? stage.container() : null;
              if (container) {
                container.style.cursor = "ns-resize";
              }
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              const container =
                stage && stage.container ? stage.container() : null;
              if (container) {
                container.style.cursor = "default";
              }
            }}
          />

          <Circle
            x={centerX}
            y={centerY}
            radius={4 * invScale}
            fill="#272e35"
            opacity={0.5}
            listening={false}
          />

          <Html
            divProps={{
              style: {
                position: "absolute",
                top: `${centerY}px`,
                left: `${centerX}px`,
                transform: "translate(-50%, -150%)",
              },
            }}
          ></Html>
        </Group>
      )}
    </Group>
  );
};
