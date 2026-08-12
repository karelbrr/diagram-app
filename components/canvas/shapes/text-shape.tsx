import React, { useState } from "react";
import { Text } from "react-konva";
import { Html } from "react-konva-utils";
import { Shape, useAppStore } from "../../store/useAppStore";
import { useShapeHandlers } from "./use-shape-handlers";

interface TextShapeProps {
  shape: Shape;
  activeTool: string;
}

export const TextShape = ({ shape, activeTool }: TextShapeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
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
  } = useShapeHandlers(shape, activeTool, isEditing);

  const { updateShape } = useAppStore();

  const textShape = shape as Shape & {
    x: number;
    y: number;
    text: string;
    fontSize: number;
    rotation?: number;
  };

  return (
    <React.Fragment>
      <Text
        ref={shapeRef}
        id={textShape.id}
        x={textShape.x}
        y={textShape.y}
        text={textShape.text}
        fontSize={textShape.fontSize}
        fill={textShape.fill}
        rotation={textShape.rotation || 0}
        draggable={isDraggable && !isEditing}
        onPointerDown={handleSelect}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformStart={handleTransformStart}
        onTransformEnd={handleTransformEnd}
        onDblClick={() => setIsEditing(true)}
        onDblTap={() => setIsEditing(true)}
        visible={!isEditing}
      />
      {isEditing && (
        <Html
          groupProps={{
            x: textShape.x,
            y: textShape.y,
            rotation: textShape.rotation || 0,
          }}
          divProps={{ style: { opacity: 1 } }}
        >
          <textarea
            defaultValue={textShape.text}
            autoFocus
            style={{
              width: `${Math.max(100, textShape.text.length * textShape.fontSize)}px`,
              height: `${textShape.fontSize * 1.5}px`,
              fontSize: `${textShape.fontSize}px`,
              border: "none",
              padding: "0px",
              margin: "0px",
              background: "none",
              outline: "none",
              color: textShape.fill,
              resize: "none",
              overflow: "hidden",
              lineHeight: "1",
              fontFamily: "Arial",
              whiteSpace: "pre-wrap",
            }}
            onBlur={(e) => {
              setIsEditing(false);
              useAppStore.getState().saveHistory();
              updateShape(shape.id, { text: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsEditing(false);
              } else if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setIsEditing(false);
                useAppStore.getState().saveHistory();
                updateShape(shape.id, { text: e.currentTarget.value });
              }
            }}
          />
        </Html>
      )}
    </React.Fragment>
  );
};
