import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
export type ShapeType = "rect" | "circle" | "diamond" | "line" | "arrow" | "triangle" | "polyline" | "text";

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

export interface ArrowShape extends BaseShape {
  type: "arrow";
  points: number[];
}

export interface TriangleShape extends BaseShape {
  type: "triangle";
  radius: number;
}

export interface PolylineShape extends BaseShape {
  type: "polyline";
  points: number[];
}

export interface TextShape extends BaseShape {
  type: "text";
  text: string;
  fontSize: number;
}

export type Shape = RectShape | CircleShape | DiamondShape | LineShape | ArrowShape | TriangleShape | PolylineShape | TextShape;

interface AppState {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  updateShape: (id: string, newProps: Partial<Shape>) => void;
  removeShape: (id: string) => void;
  selectedShapeIds: string[];
  setSelectedShapeIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  isHoveringTrash: boolean;
  setIsHoveringTrash: (isHovering: boolean) => void;
  trashedShapes: Shape[];
  restoreShape: (id: string) => void;
  permanentlyDeleteShape: (id: string) => void;
  emptyTrash: () => void;
  pastShapes: Shape[][];
  futureShapes: Shape[][];
  pastTrashedShapes: Shape[][];
  futureTrashedShapes: Shape[][];
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  copyShapes: () => Promise<void>;
  pasteShapes: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTool: "pointer",
      setActiveTool: (tool) => set({ activeTool: tool }),
  shapes: [],
  addShape: (shape) => {
    get().saveHistory();
    set((state) => ({ shapes: [...state.shapes, shape] }));
  },
  updateShape: (id, newProps) =>
    set((state) => ({
      shapes: state.shapes.map((shape) =>
        shape.id === id ? ({ ...shape, ...newProps } as Shape) : shape,
      ),
    })),
  removeShape: (id) => {
    get().saveHistory();
    const shapeToRemove = get().shapes.find((s) => s.id === id);

    set((state) => ({
      shapes: state.shapes.filter((shape) => shape.id !== id),
      trashedShapes: shapeToRemove ? [...state.trashedShapes, shapeToRemove] : state.trashedShapes,
      selectedShapeIds: state.selectedShapeIds.filter((sId) => sId !== id),
    }));

    if (shapeToRemove) {
      toast.info(
        `Shape ${shapeToRemove.type.toUpperCase()} moved to trash.`,
        { position: "top-right" },
      );
    }
  },
  restoreShape: (id) => {
    const shapeToRestore = get().trashedShapes.find((s) => s.id === id);
    if (shapeToRestore) {
      get().saveHistory();
      set((state) => ({
        trashedShapes: state.trashedShapes.filter((shape) => shape.id !== id),
        shapes: [...state.shapes, shapeToRestore],
      }));
      toast.success("Shape restored.");
    }
  },
  permanentlyDeleteShape: (id) => {
    get().saveHistory();
    set((state) => ({
      trashedShapes: state.trashedShapes.filter((shape) => shape.id !== id),
    }));
  },
  emptyTrash: () => {
    get().saveHistory();
    set({ trashedShapes: [] });
    toast.success("Trash emptied.");
  },
  selectedShapeIds: [],
  setSelectedShapeIds: (ids) => set({ selectedShapeIds: ids }),
  toggleSelection: (id) =>
    set((state) => ({
      selectedShapeIds: state.selectedShapeIds.includes(id)
        ? state.selectedShapeIds.filter((sId) => sId !== id)
        : [...state.selectedShapeIds, id],
    })),
  isHoveringTrash: false,
  setIsHoveringTrash: (val) => set({ isHoveringTrash: val }),
  trashedShapes: [],
  pastShapes: [],
  futureShapes: [],
  pastTrashedShapes: [],
  futureTrashedShapes: [],
  saveHistory: () => set((state) => ({
    pastShapes: [...state.pastShapes, state.shapes],
    futureShapes: [],
    pastTrashedShapes: [...state.pastTrashedShapes, state.trashedShapes],
    futureTrashedShapes: [],
  })),
  undo: () => set((state) => {
    if (state.pastShapes.length === 0) return state;
    const previousShapes = state.pastShapes[state.pastShapes.length - 1];
    const newPastShapes = state.pastShapes.slice(0, -1);
    
    const previousTrashed = state.pastTrashedShapes[state.pastTrashedShapes.length - 1];
    const newPastTrashed = state.pastTrashedShapes.slice(0, -1);
    
    return {
      pastShapes: newPastShapes,
      futureShapes: [state.shapes, ...state.futureShapes],
      shapes: previousShapes,
      pastTrashedShapes: newPastTrashed,
      futureTrashedShapes: [state.trashedShapes, ...state.futureTrashedShapes],
      trashedShapes: previousTrashed,
      selectedShapeIds: [],
    };
  }),
  redo: () => set((state) => {
    if (state.futureShapes.length === 0) return state;
    const nextShapes = state.futureShapes[0];
    const newFutureShapes = state.futureShapes.slice(1);
    
    const nextTrashed = state.futureTrashedShapes[0];
    const newFutureTrashed = state.futureTrashedShapes.slice(1);
    
    return {
      pastShapes: [...state.pastShapes, state.shapes],
      futureShapes: newFutureShapes,
      shapes: nextShapes,
      pastTrashedShapes: [...state.pastTrashedShapes, state.trashedShapes],
      futureTrashedShapes: newFutureTrashed,
      trashedShapes: nextTrashed,
      selectedShapeIds: [],
    };
  }),
  copyShapes: async () => {
    const state = get();
    const selected = state.shapes.filter(s => state.selectedShapeIds.includes(s.id));
    if (selected.length > 0) {
      const json = JSON.stringify({ type: "diagram-app-clipboard", shapes: selected });
      try {
        await navigator.clipboard.writeText(json);
        toast.success("Copied to clipboard");
      } catch (err) {
        toast.error("Failed to copy to clipboard");
      }
    }
  },
  pasteShapes: async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (parsed.type === "diagram-app-clipboard" && Array.isArray(parsed.shapes)) {
        const newShapes = parsed.shapes.map((s: Shape) => ({
          ...s,
          id: crypto.randomUUID(),
          x: s.x + 20,
          y: s.y + 20,
        }));
        
        get().saveHistory();
        set((state) => ({
          shapes: [...state.shapes, ...newShapes],
          selectedShapeIds: newShapes.map((s: Shape) => s.id),
        }));
      }
    } catch (err) {
      // Silently ignore if clipboard doesn't contain valid JSON or permission denied
    }
  },
}),
  {
    name: "diagram-app-storage",
    partialize: (state) => ({
      shapes: state.shapes,
      trashedShapes: state.trashedShapes,
    }),
  }
));
