import { toast } from "sonner";
import { create } from "zustand";

export type Tool =
  | "pointer"
  | "pan"
  | "rect"
  | "circle"
  | "diamond"
  | "arrow"
  | "line"
  | "polyline"
  | "triangle"
  | "text";
export type ShapeType = "rect" | "circle" | "diamond" | "line";

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  rotation: number;
  isLocked: boolean;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface RectShape extends BaseShape {
  type: "rect";
  width: number;
  height: number;
}

export interface CircleShape extends BaseShape {
  type: "circle";
  radius: number;
}

export interface DiamondShape extends BaseShape {
  type: "diamond";
  radius: number;
}

export interface LineShape extends BaseShape {
  type: "line";
  points: number[];
}

export type Shape = RectShape | CircleShape | DiamondShape | LineShape;

interface AppState {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  updateShape: (id: string, newProps: Partial<Shape>) => void;
  removeShape: (id: string) => void;
  selectedShapeId: string | null;
  setSelectedShapeId: (id: string | null) => void;
  isHoveringTrash: boolean;
  setIsHoveringTrash: (isHovering: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTool: "pointer",
  setActiveTool: (tool) => set({ activeTool: tool }),
  shapes: [],
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, newProps) =>
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? ({ ...shape, ...newProps } as Shape) : shape,
      ),
    })),
  removeShape: (id) => {
    const shapeToRemove = get().shapes.find((s) => s.id === id);

    set((state) => ({
      shapes: state.shapes.filter((shape) => shape.id !== id),
      selectedShapeId:
        state.selectedShapeId === id ? null : state.selectedShapeId,
    }));

    if (shapeToRemove) {
      toast.info(
        `Shape ${shapeToRemove.type.toUpperCase()} has been removed.`,
        { position: "top-right" },
      );
    }
  },
  selectedShapeId: null,
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),
  isHoveringTrash: false,
  setIsHoveringTrash: (val) => set({ isHoveringTrash: val }),
}));
