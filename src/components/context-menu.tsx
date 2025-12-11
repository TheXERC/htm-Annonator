import {
  Highlighter,
  Eraser,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface ContextMenuProps {
  position: { x: number; y: number };
  targetId?: string;
  onHighlight: () => void;
  onRemoveHighlight: () => void;
  onCopy: () => void;
  onDelete: (id: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onClose: () => void;
}

export function ContextMenu({
  position,
  targetId,
  onHighlight,
  onRemoveHighlight,
  onCopy,
  onDelete,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onClose,
}: ContextMenuProps) {
  return (
    <div
      className="fixed z-50 w-64 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95"
      style={{
        left: Math.min(position.x, window.innerWidth - 260),
        top: Math.min(position.y, window.innerHeight - 300),
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={() => {
          onHighlight();
          onClose();
        }}
      >
        <Highlighter className="w-4 h-4 mr-2" />
        Highlight Selection
      </div>
      <div
        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={() => {
          onRemoveHighlight();
          onClose();
        }}
      >
        <Eraser className="w-4 h-4 mr-2" />
        Clear Highlight
      </div>

      <div className="-mx-1 my-1 h-px bg-muted" />

      <div
        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={() => {
          onCopy();
          onClose();
        }}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy Text
      </div>

      {targetId && (
        <>
          <div className="-mx-1 my-1 h-px bg-muted" />
          <div
            className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer"
            onClick={() => {
              onDelete(targetId);
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Annotation
          </div>
        </>
      )}

      <div className="-mx-1 my-1 h-px bg-muted" />

      <div
        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={() => {
          onZoomIn();
          onClose();
        }}
      >
        <ZoomIn className="w-4 h-4 mr-2" />
        Zoom In
      </div>
      <div
        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={() => {
          onZoomOut();
          onClose();
        }}
      >
        <ZoomOut className="w-4 h-4 mr-2" />
        Zoom Out
      </div>
      <div
        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
        onClick={() => {
          onZoomReset();
          onClose();
        }}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Zoom
      </div>
    </div>
  );
}
