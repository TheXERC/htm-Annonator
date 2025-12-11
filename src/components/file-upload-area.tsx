import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onChooseFile: () => void;
}

export function FileUploadArea({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onChooseFile,
}: FileUploadAreaProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card
        className={cn(
          "w-full max-w-md p-12 flex flex-col items-center text-center border-dashed border-2 shadow-none transition-colors",
          isDragging
            ? "bg-primary/5 border-primary"
            : "bg-transparent hover:bg-zinc-50/50"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="bg-primary/5 p-4 rounded-full mb-6">
          <Upload className="w-12 h-12 text-primary/50" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Upload an HTML file</h2>
        <p className="text-muted-foreground mb-8">
          Drag and drop a .htm or .html file here, or click to select.
        </p>
        <Button size="lg" onClick={onChooseFile}>
          Choose File
        </Button>
      </Card>
    </div>
  );
}
