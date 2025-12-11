import { Annotation } from "@/types";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Copy, Trash2 } from "lucide-react";

interface AnnotationListProps {
  annotations: Annotation[];
  onScrollTo: (id: string) => void;
  onUpdateComment: (id: string, comment: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onCopy: (text: string, e: React.MouseEvent) => void;
}

export function AnnotationList({
  annotations,
  onScrollTo,
  onUpdateComment,
  onDelete,
  onCopy,
}: AnnotationListProps) {
  if (annotations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 text-sm">
        No matching annotations found.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {annotations.map((ann) => (
        <div
          key={ann.id}
          onClick={() => onScrollTo(ann.id)}
          className="group flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50 relative"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0 border"
                style={{ backgroundColor: ann.color }}
              />
              <span className="text-xs text-muted-foreground font-mono">
                {new Date(ann.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mr-1 -mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-blue-500/10 hover:text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Comment</h4>
                    <p className="text-sm text-muted-foreground">
                      Add a note to this annotation.
                    </p>
                    <Textarea
                      defaultValue={ann.comment}
                      placeholder="Type your comment here..."
                      className="min-h-[100px]"
                      onBlur={(e) => onUpdateComment(ann.id, e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => onCopy(ann.text, e)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy text</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => onDelete(ann.id, e)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete annotation</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <p className="text-sm line-clamp-3 leading-relaxed" dir="auto">
            {ann.text}
          </p>
          {ann.comment && (
            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground bg-muted/30 -mx-3 -mb-3 p-3 rounded-b-lg">
              <div className="flex items-center gap-1 mb-1 text-primary/70">
                <MessageSquare className="w-3 h-3" />
                <span className="font-semibold">Comment</span>
              </div>
              <p dir="auto">{ann.comment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
