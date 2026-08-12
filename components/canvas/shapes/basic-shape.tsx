import React from "react";
import { Group, Rect, Circle, RegularPolygon } from "react-konva";
import { Shape } from "../../store/useAppStore";
import { useShapeHandlers } from "./use-shape-handlers";

interface BasicShapeProps {
  shape: Shape;
  activeTool: string;
}

export const BasicShape = ({ shape, activeTool }: BasicShapeProps) => {
  const {
    shapeRef,
    isDraggable,
    isSelected,
    handleSelect,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleTransformStart,
    handleTransformEnd,
  } = useShapeHandlers(shape, activeTool);

  return (
    <Group>
      {shape.type === "rect" &&
        (() => {
          const rectShape = shape as Shape & {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation?: number;
          };
          return (
            <Rect
              ref={shapeRef}
              id={rectShape.id}
              x={rectShape.x}
              y={rectShape.y}
              width={rectShape.width}
              height={rectShape.height}
              fill={rectShape.fill}
              stroke={rectShape.stroke}
              strokeWidth={rectShape.strokeWidth}
              rotation={rectShape.rotation}
              draggable={isDraggable}
              onPointerDown={handleSelect}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onTransformStart={handleTransformStart}
              onTransformEnd={handleTransformEnd}
            />
          );
        })()}
      {shape.type === "circle" &&
        (() => {
          const circleShape = shape as Shape & {
            x: number;
            y: number;
            radius: number;
          };
          return (
            <Circle
              ref={shapeRef}
              id={circleShape.id}
              x={circleShape.x}
              y={circleShape.y}
              radius={circleShape.radius}
              fill={circleShape.fill}
              stroke={circleShape.stroke}
              strokeWidth={circleShape.strokeWidth}
              draggable={isDraggable}
              onPointerDown={handleSelect}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          );
        })()}
      {shape.type === "diamond" &&
        (() => {
          const diamondShape = shape as Shape & {
            x: number;
            y: number;
            radius: number;
          };
          return (
            <RegularPolygon
              ref={shapeRef}
              id={diamondShape.id}
              x={diamondShape.x}
              y={diamondShape.y}
              sides={4}
              radius={diamondShape.radius}
              fill={diamondShape.fill}
              stroke={diamondShape.stroke}
              strokeWidth={diamondShape.strokeWidth}
              rotation={45}
              draggable={isDraggable}
              onPointerDown={handleSelect}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          );
        })()}
      {shape.type === "triangle" &&
        (() => {
          const triangleShape = shape as Shape & {
            x: number;
            y: number;
            radius: number;
          };
          return (
            <RegularPolygon
              ref={shapeRef}
              id={triangleShape.id}
              x={triangleShape.x}
              y={triangleShape.y}
              sides={3}
              radius={triangleShape.radius}
              fill={triangleShape.fill}
              stroke={triangleShape.stroke}
              strokeWidth={triangleShape.strokeWidth}
              draggable={isDraggable}
              onPointerDown={handleSelect}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onTransformStart={handleTransformStart}
              onTransformEnd={handleTransformEnd}
            />
          );
        })()}
    </Group>
  );
};
