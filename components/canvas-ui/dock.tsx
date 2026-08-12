"use client";

import {
  HomeIcon,
  SettingsIcon,
  Trash2Icon,
  Sparkles,
  MonitorPlay,
  MessageSquare,
  Library,
  File,
} from "lucide-react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "motion/react";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppStore } from "../store/useAppStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DockProps = {
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

const DockItem = React.forwardRef<HTMLDivElement, DockItemProps>(
  (
    {
      id,
      children,
      className = "",
      onClick,
      mouseX,
      spring,
      distance,
      magnification,
      baseItemSize,
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);

    const setRefs = React.useCallback(
      (node: HTMLDivElement) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const mouseDistance = useTransform(mouseX, (val) => {
      const rect = internalRef.current?.getBoundingClientRect() ?? {
        x: 0,
        width: baseItemSize,
      };
      return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(
      mouseDistance,
      [-distance, 0, distance],
      [baseItemSize, magnification, baseItemSize],
    );
    const size = useSpring(targetSize, spring);

    return (
      <motion.div
        id={id}
        ref={setRefs}
        style={{
          width: size,
          height: size,
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center bg-input/30 rounded-lg border-neutral-700 border shadow-md ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
      >
        {Children.map(children, (child) =>
          React.isValidElement(child)
            ? cloneElement(
                child as React.ReactElement<{
                  isHovered?: MotionValue<number>;
                }>,
                { isHovered },
              )
            : child,
        )}
      </motion.div>
    );
  },
);
DockItem.displayName = "DockItem";

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#120F17] px-2 py-0.5 text-xs text-white z-50`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export default function Dock({
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const { selectedShapeId, removeShape, isHoveringTrash } = useAppStore();

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  const items = [
    {
      icon: <HomeIcon size={18} strokeWidth={1.25} />,
      label: "Home",
      onClick: () => alert("Home!"),
    },
    {
      icon: <File size={18} strokeWidth={1.25} />,
      label: "Open",
      dropdown: (
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      ),
    },
    {
      icon: <Library size={18} strokeWidth={1.25} />,
      label: "Templates",
      onClick: () => alert("Open Templates Panel"),
    },
    {
      icon: <MessageSquare size={18} strokeWidth={1.25} />,
      label: "Comments",
      onClick: () => alert("Toggle Comments Mode"),
    },
    {
      icon: <Sparkles size={18} strokeWidth={1.25} />,
      label: "AI Assistant",
      onClick: () => alert("Open AI Generator"),
    },
    {
      icon: <MonitorPlay size={18} strokeWidth={1.25} />,
      label: "Present",
      onClick: () => alert("Start Presentation Mode"),
    },
    {
      icon: <SettingsIcon size={18} strokeWidth={1.25} />,
      label: "Settings",
      onClick: () => alert("Settings!"),
    },
  ];

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} absolute bottom-2 bg-black left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border pb-2 px-4`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item) => {
          const dockItemNode = (
            <DockItem
              key={item.label}
              onClick={item.onClick}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          );

          if (item.dropdown) {
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  {dockItemNode}
                </DropdownMenuTrigger>
                {item.dropdown}
              </DropdownMenu>
            );
          }

          return dockItemNode;
        })}
        <DockItem
          id="trash-dock-item"
          key="trash"
          onClick={() => selectedShapeId && removeShape(selectedShapeId)}
          mouseX={mouseX}
          spring={spring}
          distance={distance}
          magnification={magnification}
          baseItemSize={baseItemSize}
          className={
            isHoveringTrash
              ? "bg-red-500/80 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              : ""
          }
        >
          <DockIcon
            className={isHoveringTrash ? "text-white animate-pulse" : ""}
          >
            <Trash2Icon size={18} strokeWidth={1.25} />
          </DockIcon>
          <DockLabel>Trash</DockLabel>
        </DockItem>
      </motion.div>
    </motion.div>
  );
}
