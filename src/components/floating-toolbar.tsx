import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Highlighter, Copy, X } from "lucide-react";

interface FloatingToolbarProps {
  anchor: { x: number; y: number };
  onHighlight: () => void;
  onCopy: () => void;
  onRemoveHighlight: () => void;
  highlightColor: string;
}

export function FloatingToolbar({
  anchor,
  onHighlight,
  onCopy,
  onRemoveHighlight,
  highlightColor,
}: FloatingToolbarProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: anchor.x,
        top: anchor.y - 10,
        transform: "translate(-50%, -100%)",
        zIndex: 50,
      }}
      className="animate-in fade-in zoom-in duration-200 flex items-center gap-1 bg-zinc-900 p-1 rounded-full shadow-xl"
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={onHighlight}
        onMouseDown={(e) => e.preventDefault()}
        className="text-white hover:bg-zinc-700 hover:text-white rounded-full px-3 h-8"
      >
        <Highlighter
          className="w-3 h-3 mr-2"
          style={{ color: highlightColor }}
        />
        Highlight
      </Button>
      <Separator orientation="vertical" className="h-4 bg-zinc-700" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={onCopy}
            onMouseDown={(e) => e.preventDefault()}
            className="text-white hover:bg-zinc-700 hover:text-white rounded-full h-8 w-8"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy text</TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="h-4 bg-zinc-700" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={onRemoveHighlight}
            onMouseDown={(e) => e.preventDefault()}
            className="text-white hover:bg-red-900/50 hover:text-red-200 rounded-full h-8 w-8"
          >
            <X className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear selection</TooltipContent>
      </Tooltip>
      {/* Arrow/Triangle */}
      <div className="w-3 h-3 bg-zinc-900 rotate-45 absolute left-1/2 -bottom-1.5 -translate-x-1/2 -z-10"></div>
    </div>
  );
}
