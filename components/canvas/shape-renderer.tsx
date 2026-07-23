import { useRef, useEffect } from "react";
import {
  Rect,
  Circle,
  RegularPolygon,
  Transformer,
  Group,
  Line,
} from "react-konva";
import { Html } from "react-konva-utils";
import { KonvaEventObject } from "konva/lib/Node";
import { useAppStore, Shape } from "../store/useAppStore";

interface ShapeRendererProps {
  shape: Shape;
  activeTool: string;
  scale?: number;
}

export const ShapeRenderer = ({
  shape,
  activeTool,
  scale = 1,
}: ShapeRendererProps) => {
  const isDraggable = activeTool === "pointer" && !shape.isLocked;
  const GRID_SIZE = 20;
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const { selectedShapeId, updateShape, setSelectedShapeId, removeShape } =
    useAppStore();
  const isSelected = selectedShapeId === shape.id;

  // Attach transformer to the shape when it's selected
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, shape.type]);

  // Handle delete key press to remove shape when selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSelected && (e.key === "Delete" || e.key === "Backspace")) {
        removeShape(shape.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, shape.id, removeShape]);

  // Handle shape selection on pointer down, but only if the active tool is the pointer and the shape is not locked
  const handleSelect = (e: KonvaEventObject<PointerEvent>) => {
    e.cancelBubble = true;
    if (activeTool === "pointer") {
      setSelectedShapeId(shape.id);
    }
  };

  // Moving and Snapping logic on drag move and drag end
  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const snappedX = Math.round(e.target.x() / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(e.target.y() / GRID_SIZE) * GRID_SIZE;

    e.target.x(snappedX);
    e.target.y(snappedY);

    updateShape(shape.id, { x: snappedX, y: snappedY });

    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const containerRect = stage.container().getBoundingClientRect();
    const pointerClientX = containerRect.left + pointer.x;
    const pointerClientY = containerRect.top + pointer.y;

    const trashEl = document.getElementById("trash-dock-item");

    if (trashEl) {
      const rect = trashEl.getBoundingClientRect();
      const isOver =
        pointerClientX >= rect.left &&
        pointerClientX <= rect.right &&
        pointerClientY >= rect.top &&
        pointerClientY <= rect.bottom;

      if (useAppStore.getState().isHoveringTrash !== isOver) {
        useAppStore.getState().setIsHoveringTrash(isOver);
      }
    }
  };

  // On drag end, we want to snap the shape to the grid and check if it's dropped over the trash can to delete it
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    useAppStore.getState().setIsHoveringTrash(false);

    const snappedX = Math.round(e.target.x() / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(e.target.y() / GRID_SIZE) * GRID_SIZE;

    e.target.x(snappedX);
    e.target.y(snappedY);

    updateShape(shape.id, { x: snappedX, y: snappedY });

    const stage = e.target.getStage();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const containerRect = stage.container().getBoundingClientRect();
    const pointerClientX = containerRect.left + pointer.x;
    const pointerClientY = containerRect.top + pointer.y;

    const trashEl = document.getElementById("trash-dock-item");

    if (trashEl) {
      const rect = trashEl.getBoundingClientRect();

      if (
        pointerClientX >= rect.left &&
        pointerClientX <= rect.right &&
        pointerClientY >= rect.top &&
        pointerClientY <= rect.bottom
      ) {
        useAppStore.getState().removeShape(shape.id);
      }
    }
  };

  // On drag end, we want to snap the shape to the grid and check if it's dropped over the trash can to delete it
  const handleLinePointMove = (
    index: 0 | 1,
    e: KonvaEventObject<DragEvent>,
  ) => {
    e.cancelBubble = true;
    if (shape.type !== "line") return;

    const snappedX = Math.round(e.target.x() / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(e.target.y() / GRID_SIZE) * GRID_SIZE;

    e.target.x(snappedX);
    e.target.y(snappedY);

    const newPoints = [...shape.points];
    if (index === 0) {
      newPoints[0] = snappedX;
      newPoints[1] = snappedY;
    } else {
      newPoints[2] = snappedX;
      newPoints[3] = snappedY;
    }
    updateShape(shape.id, { points: newPoints });
  };

  const handleTransformEnd = () => {
    // <--- Změna názvu
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset měřítka a zápis do storu děláme AŽ PO DOKONČENÍ transformace
    node.scaleX(1);
    node.scaleY(1);

    if (shape.type === "rect") {
      updateShape(shape.id, {
        x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
        y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,
        width: Math.max(
          GRID_SIZE,
          Math.round((node.width() * scaleX) / GRID_SIZE) * GRID_SIZE,
        ),
        height: Math.max(
          GRID_SIZE,
          Math.round((node.height() * scaleY) / GRID_SIZE) * GRID_SIZE,
        ),
        rotation: node.rotation(),
      });
    } else if (shape.type === "circle" || shape.type === "diamond") {
      updateShape(shape.id, {
        x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
        y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,
        radius: Math.max(
          GRID_SIZE,
          Math.round((node.radius() * scaleX) / GRID_SIZE) * GRID_SIZE,
        ),
        rotation: node.rotation(),
      });
    }
  };

  // Special handling for line shapes to show draggable points and a center handle for better UX
  if (shape.type === "line") {
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
        <Line
          points={points}
          stroke="#ffffff"
          strokeWidth={2}
          hitStrokeWidth={20}
          lineCap="round"
        />

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
  }
  // For rectangles, circles, and diamonds, we render them directly with the appropriate props and attach the transformer if selected
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
            console.log("Resizing from", oldBox, "to", newBox);

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
