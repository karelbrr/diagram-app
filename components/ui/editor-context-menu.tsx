import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import React from "react"
import { useAppStore } from "../store/useAppStore"

export function EditorContextMenu({ children }: { children: React.ReactNode }) {
  const { selectedShapeIds, removeShape, updateShape, shapes, setSelectedShapeIds } = useAppStore()

  const hasSelection = selectedShapeIds.length > 0;
  const isAllLocked = selectedShapeIds.every(id => shapes.find(s => s.id === id)?.isLocked);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="absolute inset-0">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 border-zinc-800 bg-black text-zinc-300">
        {hasSelection ? (
          <>
            <ContextMenuGroup>
              <ContextMenuItem
                className="focus:bg-zinc-800 focus:text-white"
                onClick={() =>
                  selectedShapeIds.forEach(id => updateShape(id, {
                    isLocked: !isAllLocked,
                  }))
                }
              >
                {isAllLocked ? "Unlock Shapes" : "Lock Shapes"}
                <ContextMenuShortcut>⌘L</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator className="bg-zinc-800" />
            <ContextMenuGroup>
              <ContextMenuItem
                className="text-red-500 focus:bg-red-500/20 focus:text-red-500"
                onClick={() => {
                  selectedShapeIds.forEach(id => removeShape(id));
                  setSelectedShapeIds([]);
                }}
              >
                Delete
                <ContextMenuShortcut>Del</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
          </>
        ) : (
          <>
            <ContextMenuGroup>
              <ContextMenuItem className="focus:bg-zinc-800 focus:text-white">
                Reset View
                <ContextMenuShortcut>⌘0</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator className="bg-zinc-800" />
            <ContextMenuGroup>
              <ContextMenuItem className="text-red-500 focus:bg-red-500/20 focus:text-red-500">
                Clear Canvas
              </ContextMenuItem>
            </ContextMenuGroup>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}