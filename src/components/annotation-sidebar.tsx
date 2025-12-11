import { Annotation } from "@/types";
import { SidebarContent } from "./sidebar-content";
import { cn } from "@/lib/utils";

interface AnnotationSidebarProps {
  isOpen: boolean;
  annotations: Annotation[];
  onScrollTo: (id: string) => void;
  onUpdateComment: (id: string, comment: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onCopy: (text: string, e: React.MouseEvent) => void;
}

export function AnnotationSidebar({
  isOpen,
  annotations,
  onScrollTo,
  onUpdateComment,
  onDelete,
  onClearAll,
  onCopy,
}: AnnotationSidebarProps) {
  return (
    <div
      className={cn(
        "border-l bg-white dark:bg-zinc-900 flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden hidden md:flex",
        isOpen ? "w-80" : "w-0 border-l-0"
      )}
    >
      <SidebarContent
        annotations={annotations}
        onScrollTo={onScrollTo}
        onUpdateComment={onUpdateComment}
        onDelete={onDelete}
        onClearAll={onClearAll}
        onCopy={onCopy}
      />
    </div>
  );
}

