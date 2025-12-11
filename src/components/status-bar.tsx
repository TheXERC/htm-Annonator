import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileCode, MousePointerClick, ZoomOut, ZoomIn, RotateCcw } from "lucide-react";

interface StatusBarProps {
  fileName: string | null;
  autoHighlight: boolean;
  zoomLevel: number;
  setZoomLevel: (value: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function StatusBar({
  fileName,
  autoHighlight,
  zoomLevel,
  setZoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: StatusBarProps) {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t px-4 py-1.5 flex items-center justify-between text-xs text-muted-foreground shrink-0 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5" />
          <span className="font-medium truncate max-w-[300px]">{fileName}</span>
        </div>
        <Separator orientation="vertical" className="h-3" />
        <div className="flex items-center gap-2">
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>
            {autoHighlight ? "Auto-highlight enabled" : "Select text to highlight"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onZoomOut}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
        <div className="w-24 px-2">
          <Slider
            value={[zoomLevel]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(value) => setZoomLevel(value[0])}
          />
        </div>
        <span className="font-mono w-10 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onZoomIn}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={onZoomReset}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Zoom</TooltipContent>
        </Tooltip>
      </div>
    </footer>
  );
}
