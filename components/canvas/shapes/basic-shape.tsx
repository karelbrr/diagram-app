import React from "react";
import { Group, Rect, Circle, RegularPolygon, Transformer } from "react-konva";
import { Shape } from "../../store/useAppStore";
import { useShapeHandlers } from "./use-shape-handlers";

interface BasicShapeProps {
  shape: Shape;
  activeTool: string;
}

export const BasicShape = ({ shape, activeTool }: BasicShapeProps) => {
  const {
    shapeRef,
    trRef,
    isDraggable,
    isSelected,
    handleSelect,
    handleDragMove,
    handleDragEnd,
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
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
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
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
            />
          );
        })()}
      {isSelected && (
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
    </Group>
  );
};
