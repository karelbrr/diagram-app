import { Shape } from "../store/useAppStore";
import { BasicShape } from "./shapes/basic-shape";
import { LineShape } from "./shapes/line-shape";
import { TextShape } from "./shapes/text-shape";

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
  if (shape.type === "line" || shape.type === "arrow" || shape.type === "polyline") {
    return <LineShape shape={shape} activeTool={activeTool} scale={scale} />;
  }

  if (shape.type === "text") {
    return <TextShape shape={shape} activeTool={activeTool} />;
  }

  return <BasicShape shape={shape} activeTool={activeTool} />;
};
