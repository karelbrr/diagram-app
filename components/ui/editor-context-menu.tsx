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
  const { selectedShapeId, removeShape, updateShape, shapes } = useAppStore()

  const selectedShape = shapes.find((s) => s.id === selectedShapeId)

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="absolute inset-0">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 border-zinc-800 bg-black text-zinc-300">
        {selectedShapeId ? (
          <>
            <ContextMenuGroup>
              <ContextMenuItem
                className="focus:bg-zinc-800 focus:text-white"
                onClick={() =>
                  updateShape(selectedShapeId, {
                    isLocked: !selectedShape?.isLocked,
                  })
                }
              >
                {selectedShape?.isLocked ? "Unlock Shape" : "Lock Shape"}
                <ContextMenuShortcut>⌘L</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator className="bg-zinc-800" />
            <ContextMenuGroup>
              <ContextMenuItem
                className="text-red-500 focus:bg-red-500/20 focus:text-red-500"
                onClick={() => removeShape(selectedShapeId)}
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