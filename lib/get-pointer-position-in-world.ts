import { Stage as StageType } from "konva/lib/Stage";

// Get the pointer position in the world coordinates
export const getPointerPositionInWorld = (stage: StageType) => {
  const pointer = stage.getPointerPosition();
  const scale = stage.scaleX();
  const position = stage.position();

  if (!pointer) return null;

  return {
    x: (pointer.x - position.x) / scale,
    y: (pointer.y - position.y) / scale,
  };
};