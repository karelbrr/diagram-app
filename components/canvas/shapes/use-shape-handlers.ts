import { useRef, useEffect } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { useAppStore, Shape } from "../../store/useAppStore";

export function useShapeHandlers(
  shape: Shape,
  activeTool: string,
  isEditing: boolean = false,
) {
  const isDraggable = activeTool === "pointer" && !shape.isLocked;
  const GRID_SIZE = 20;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shapeRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trRef = useRef<any>(null);
  const { selectedShapeId, updateShape, setSelectedShapeId } = useAppStore();
  const isSelected = selectedShapeId === shape.id;

  // Attach transformer to the shape when it's selected
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current && !isEditing) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, isEditing, shape.type]);

  // Handle shape selection on pointer down
  const handleSelect = (e: KonvaEventObject<PointerEvent>) => {
    e.cancelBubble = true;
    if (activeTool === "pointer") {
      setSelectedShapeId(shape.id);
    }
  };

  // Moving and Snapping logic on drag move
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

  // On drag end, snap to grid and check if over trash can
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

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

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
    } else if (
      shape.type === "circle" ||
      shape.type === "diamond" ||
      shape.type === "triangle"
    ) {
      updateShape(shape.id, {
        x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
        y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,
        radius: Math.max(
          GRID_SIZE,
          Math.round((node.radius() * scaleX) / GRID_SIZE) * GRID_SIZE,
        ),
        rotation: node.rotation(),
      });
    } else if (shape.type === "text") {
      updateShape(shape.id, {
        x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
        y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,
        fontSize: Math.max(
          10,
          Math.round(node.fontSize() * Math.max(scaleX, scaleY)),
        ),
        rotation: node.rotation(),
      });
    }
  };

  return {
    shapeRef,
    trRef,
    isDraggable,
    isSelected,
    GRID_SIZE,
    handleSelect,
    handleDragMove,
    handleDragEnd,
    handleTransformEnd,
  };
}
