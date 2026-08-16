import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore, Shape } from "../store/useAppStore";
import {
  Square,
  Circle,
  Triangle,
  Diamond,
  Minus,
  Activity,
  ArrowUpRight,
  Type,
  Trash2,
  Undo2,
} from "lucide-react";

interface TrashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrashDialog({ open, onOpenChange }: TrashDialogProps) {
  const { trashedShapes, restoreShape, permanentlyDeleteShape, emptyTrash } =
    useAppStore();

  const getShapeIcon = (type: string) => {
    switch (type) {
      case "rect":
        return <Square size={16} />;
      case "circle":
        return <Circle size={16} />;
      case "triangle":
        return <Triangle size={16} />;
      case "diamond":
        return <Diamond size={16} />;
      case "line":
        return <Minus size={16} />;
      case "polyline":
        return <Activity size={16} />;
      case "arrow":
        return <ArrowUpRight size={16} />;
      case "text":
        return <Type size={16} />;
      default:
        return <Square size={16} />;
    }
  };

  const getShapeName = (shape: Shape) => {
    if (shape.type === "text") {
      return `Text: "${shape.text.length > 15 ? shape.text.substring(0, 15) + "..." : shape.text}"`;
    }
    return shape.type.charAt(0).toUpperCase() + shape.type.slice(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center pr-8">
            <span>Trash</span>
            {trashedShapes.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={emptyTrash}
                className="h-8 text-xs"
              >
                Empty Trash
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {trashedShapes.length === 0
              ? "Your trash is empty."
              : "Review and restore your deleted shapes."}
          </DialogDescription>
        </DialogHeader>

        {trashedShapes.length > 0 && (
          <ScrollArea className="h-75 w-full rounded-md border border-zinc-800 p-4">
            <div className="flex flex-col gap-3 pr-4">
              {trashedShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg border border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-zinc-400">
                      {getShapeIcon(shape.type)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {getShapeName(shape)}
                      </span>
                      <span className="text-xs text-zinc-500 font-sans">
                        ID: {shape.id.substring(0, 8)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-zinc-800 hover:bg-zinc-700 hover:text-white border-zinc-700"
                      onClick={() => restoreShape(shape.id)}
                      title="Restore Shape"
                    >
                      <Undo2 size={14} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 border-0"
                      onClick={() => permanentlyDeleteShape(shape.id)}
                      title="Delete Permanently"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
