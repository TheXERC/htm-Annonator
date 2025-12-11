import { useState } from "react";
import { Annotation } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AnnotationList } from "./annotation-list";

interface SidebarContentProps {
  annotations: Annotation[];
  onScrollTo: (id: string) => void;
  onUpdateComment: (id: string, comment: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onCopy: (text: string, e: React.MouseEvent) => void;
  title?: string;
}

export function SidebarContent({
  annotations,
  onScrollTo,
  onUpdateComment,
  onDelete,
  onClearAll,
  onCopy,
  title = "Annotations",
}: SidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAnnotations = annotations.filter((ann) =>
    ann.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{filteredAnnotations.length}</Badge>
            {annotations.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="inline-block">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear all annotations</TooltipContent>
                    </Tooltip>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all
                      your annotations from this file.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClearAll}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search annotations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
            dir="auto"
          />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {filteredAnnotations.length === 0 && annotations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 text-sm">
              No annotations yet.
              <br />
              Select text to highlight.
            </div>
          ) : (
            <AnnotationList
              annotations={filteredAnnotations}
              onScrollTo={onScrollTo}
              onUpdateComment={onUpdateComment}
              onDelete={onDelete}
              onCopy={onCopy}
            />
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
