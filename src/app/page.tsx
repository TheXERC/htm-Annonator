"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HIGHLIGHT_COLORS } from "@/lib/constants";
import { Annotation } from "@/types";
import { Toolbar } from "@/components/toolbar";
import { AnnotationSidebar } from "@/components/annotation-sidebar";
import { StatusBar } from "@/components/status-bar";
import { FloatingToolbar } from "@/components/floating-toolbar";
import { ContextMenu } from "@/components/context-menu";
import { FileUploadArea } from "@/components/file-upload-area";
import { SidebarContent } from "@/components/sidebar-content";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [src, setSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [autoHighlight, setAutoHighlight] = useState(false);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].value);
  const [floatingAnchor, setFloatingAnchor] = useState<{ x: number; y: number } | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contentTheme, setContentTheme] = useState<'light' | 'dark'>('light');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetId?: string } | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const autoHighlightRef = useRef(autoHighlight);
  const highlightColorRef = useRef(highlightColor);

  useEffect(() => {
    autoHighlightRef.current = autoHighlight;
  }, [autoHighlight]);

  useEffect(() => {
      const closeMenu = () => setContextMenu(null);
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
  }, []);

  useEffect(() => {
    highlightColorRef.current = highlightColor;
  }, [highlightColor]);

  const applyContentTheme = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    let style = doc.getElementById("content-theme-style");
    
    if (!style) {
        style = doc.createElement("style");
        style.id = "content-theme-style";
        doc.head.appendChild(style);
    }

    if (contentTheme === "dark") {
        style.textContent = `
            body { background-color: #18181b !important; color: #e4e4e7 !important; }
            a { color: #60a5fa !important; }
            * { border-color: #3f3f46 !important; }
            span[style*="background-color"] { color: #000000 !important; }
        `;
    } else {
        style.textContent = "";
    }
  };

  useEffect(() => {
    applyContentTheme();
  }, [contentTheme]);

  // Helper to convert RGB to Hex
  const rgbToHex = (rgb: string) => {
    if (rgb.startsWith("#")) return rgb;
    const result = rgb.match(/\d+/g);
    if (!result) return rgb;
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const syncAnnotations = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;
    const newAnnotations: Annotation[] = [];
    const allElements = doc.getElementsByTagName("*");
    
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i] as HTMLElement;
      if (el.style.backgroundColor && el.style.backgroundColor !== "transparent") {
        let id = el.getAttribute("data-annotation-id");
        if (!id) {
            id = crypto.randomUUID();
            el.setAttribute("data-annotation-id", id);
        }
        
        if (!el.getAttribute("data-timestamp")) {
             el.setAttribute("data-timestamp", new Date().toISOString());
        }

        newAnnotations.push({
          id,
          text: el.innerText,
          color: rgbToHex(el.style.backgroundColor),
          timestamp: el.getAttribute("data-timestamp") || new Date().toISOString(),
          comment: el.getAttribute("data-comment") || undefined
        });
      }
    }
    setAnnotations(newAnnotations);
  };

  const updateAnnotationComment = (id: string, comment: string) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    const el = iframe.contentDocument.querySelector(`[data-annotation-id="${id}"]`);
    if (el) {
        if (comment) {
            el.setAttribute("data-comment", comment);
        } else {
            el.removeAttribute("data-comment");
        }
        syncAnnotations();
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => {
        const newZoom = Math.min(prev + 0.1, 2);
        if (iframeRef.current?.contentDocument?.body) {
            (iframeRef.current.contentDocument.body.style as any).zoom = newZoom;
        }
        return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
        const newZoom = Math.max(prev - 0.1, 0.5);
        if (iframeRef.current?.contentDocument?.body) {
            (iframeRef.current.contentDocument.body.style as any).zoom = newZoom;
        }
        return newZoom;
    });
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    if (iframeRef.current?.contentDocument?.body) {
        (iframeRef.current.contentDocument.body.style as any).zoom = 1;
    }
  };

  const scrollToAnnotation = (id: string) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    const el = iframe.contentDocument.querySelector(`[data-annotation-id="${id}"]`);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Flash effect
        const originalTransition = (el as HTMLElement).style.transition;
        const originalOutline = (el as HTMLElement).style.outline;
        
        (el as HTMLElement).style.transition = "outline 0.2s";
        (el as HTMLElement).style.outline = "4px solid red";
        
        setTimeout(() => {
            (el as HTMLElement).style.outline = originalOutline;
            setTimeout(() => {
                (el as HTMLElement).style.transition = originalTransition;
            }, 200);
        }, 1000);
    }
  };

  const deleteAnnotation = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    const el = iframe.contentDocument.querySelector(`[data-annotation-id="${id}"]`) as HTMLElement;
    if (el) {
        el.style.backgroundColor = "";
        el.removeAttribute("data-annotation-id");
        el.removeAttribute("data-timestamp");
        syncAnnotations();
        toast.success("Annotation deleted");
    }
  };

  const clearAllAnnotations = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    
    const doc = iframe.contentDocument;
    const highlightedElements = doc.querySelectorAll('[data-annotation-id]');
    
    highlightedElements.forEach(el => {
        (el as HTMLElement).style.backgroundColor = "";
        el.removeAttribute("data-annotation-id");
        el.removeAttribute("data-timestamp");
    });
    
    setAnnotations([]);
    toast.success("All annotations deleted");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  };

  const loadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    setFileName(file.name);
    setFloatingAnchor(null);
    setAnnotations([]);
    toast.success(`Loaded ${file.name}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".htm") || file.name.endsWith(".html"))) {
      loadFile(file);
    } else {
      toast.error("Please upload a valid .htm or .html file");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !iframeRef.current || !iframeRef.current.contentWindow) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.annotations && Array.isArray(data.annotations)) {
        const win = iframeRef.current.contentWindow as any;
        const doc = iframeRef.current.contentDocument;
        
        if (!doc || !win.find) {
            toast.error("Import not supported in this browser.");
            return;
        }

        const selection = win.getSelection();
        selection?.removeAllRanges();
        const range = doc.createRange();
        range.selectNodeContents(doc.body);
        range.collapse(true);
        selection?.addRange(range);

        let count = 0;
        for (const annotation of data.annotations) {
             let found = false;
             
             // Strategy 1: Exact match
             if (win.find(annotation.text, false, false, false, false, false, false)) {
                 found = true;
             } 
             // Strategy 2: Normalize whitespace (replace newlines/tabs with spaces, collapse multiple spaces)
             else {
                 const normalized = annotation.text.replace(/[\r\n\t]+/g, ' ').replace(/\s\s+/g, ' ').trim();
                 if (normalized !== annotation.text && win.find(normalized, false, false, false, false, false, false)) {
                     found = true;
                 }
                 // Strategy 3: Legacy truncated text (ends with "...")
                 else if (annotation.text.endsWith("...")) {
                     const prefix = annotation.text.substring(0, annotation.text.length - 3);
                     if (prefix.length > 15) {
                        if (win.find(prefix, false, false, false, false, false, false)) {
                            found = true;
                        }
                     }
                 }
             }

             if (found) {
                 // Use a unique temp color to prevent merging and identify the new spans
                 const tempColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                 doc.execCommand("backColor", false, tempColor);
                 
                 const selection = win.getSelection();
                 if (selection && selection.rangeCount > 0) {
                     const range = selection.getRangeAt(0);
                     const commonAncestor = range.commonAncestorContainer;
                     const container = commonAncestor.nodeType === 3 ? commonAncestor.parentElement : commonAncestor as HTMLElement;
                     
                     if (container) {
                         const processSpan = (span: HTMLElement) => {
                             if (rgbToHex(span.style.backgroundColor) === tempColor) {
                                 span.setAttribute("data-annotation-id", annotation.id);
                                 span.setAttribute("data-timestamp", annotation.timestamp);
                                 if (annotation.comment) {
                                     span.setAttribute("data-comment", annotation.comment);
                                 }
                                 span.style.backgroundColor = annotation.color;
                             }
                         };

                         const spans = container.getElementsByTagName("SPAN");
                         for (let i = 0; i < spans.length; i++) {
                             processSpan(spans[i] as HTMLElement);
                         }
                         
                         if (container.tagName === "SPAN") {
                             processSpan(container);
                         }
                     }
                 }

                 selection?.collapseToEnd();
                 count++;
             }
        }
        
        selection?.removeAllRanges();
        syncAnnotations();
        toast.success(`Imported ${count} of ${data.annotations.length} annotations`);
      }
    } catch (error) {
      console.error("Error importing annotations:", error);
      toast.error("Failed to import annotations. Invalid JSON file.");
    }
    
    event.target.value = "";
  };

  const handleHighlight = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    iframe.contentDocument.execCommand("backColor", false, highlightColorRef.current);
    
    const selection = iframe.contentDocument.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    setFloatingAnchor(null);
    syncAnnotations();
  };

  const handleRemoveHighlight = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;
    iframe.contentDocument.execCommand("backColor", false, "transparent");
    
    const selection = iframe.contentDocument.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    setFloatingAnchor(null);
    syncAnnotations();
  };

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument) {
      iframe.contentDocument.designMode = "on";
      applyContentTheme(); // Apply theme on load
      const doc = iframe.contentDocument;

      const handleContextMenu = (e: MouseEvent) => {
          e.preventDefault();
          const iframeRect = iframe.getBoundingClientRect();
          const target = e.target as HTMLElement;
          const annotationSpan = target.closest('[data-annotation-id]');
          const annotationId = annotationSpan?.getAttribute('data-annotation-id');

          setContextMenu({
              x: iframeRect.left + e.clientX,
              y: iframeRect.top + e.clientY,
              targetId: annotationId || undefined
          });
      };

      doc.addEventListener('contextmenu', handleContextMenu);
      doc.addEventListener('click', () => setContextMenu(null));

      const onMouseUp = () => {
          setTimeout(() => {
              const selection = doc.getSelection();
              if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
                  if (autoHighlightRef.current) {
                      doc.execCommand("backColor", false, highlightColorRef.current);
                      selection.removeAllRanges();
                      setFloatingAnchor(null);
                      syncAnnotations();
                  } else {
                      const range = selection.getRangeAt(0);
                      const rect = range.getBoundingClientRect();
                      const iframeRect = iframe.getBoundingClientRect();
                      setFloatingAnchor({
                          x: iframeRect.left + rect.left + (rect.width / 2),
                          y: iframeRect.top + rect.top
                      });
                  }
              } else {
                  setFloatingAnchor(null);
              }
          }, 10);
      };

      doc.addEventListener("mouseup", onMouseUp);
      doc.addEventListener("keyup", onMouseUp);
      doc.addEventListener("scroll", () => setFloatingAnchor(null));
    }
  };

  const handleSave = () => {
    let sortedAnnotations = [...annotations];
    const iframe = iframeRef.current;
    
    if (iframe && iframe.contentDocument) {
        const doc = iframe.contentDocument;
        sortedAnnotations.sort((a, b) => {
            const elA = doc.querySelector(`[data-annotation-id="${a.id}"]`);
            const elB = doc.querySelector(`[data-annotation-id="${b.id}"]`);
            if (elA && elB) {
                return (elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
            }
            return 0;
        });
    }

    const output = {
      sourceFile: fileName,
      exportedAt: new Date().toISOString(),
      annotations: sortedAnnotations
    };

    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ? `${fileName.replace(/\.[^/.]+$/, "")}-annotations.json` : "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Annotations saved successfully");
  };

  const handleCopyAnnotation = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <TooltipProvider>
      <div className="h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col overflow-hidden">
        <Toolbar
          src={src}
          fileName={fileName}
          autoHighlight={autoHighlight}
          setAutoHighlight={setAutoHighlight}
          highlightColor={highlightColor}
          setHighlightColor={setHighlightColor}
          onFileUpload={triggerFileInput}
          onImport={handleImportClick}
          onSave={handleSave}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          contentTheme={contentTheme}
          setContentTheme={setContentTheme}
        >
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                    <SidebarContent
                        annotations={annotations}
                        onScrollTo={scrollToAnnotation}
                        onUpdateComment={updateAnnotationComment}
                        onDelete={(id, e) => deleteAnnotation(id, e)}
                        onClearAll={clearAllAnnotations}
                        onCopy={handleCopyAnnotation}
                    />
                </SheetContent>
            </Sheet>
        </Toolbar>

        <main className="flex-1 flex overflow-hidden relative">
          <Input
            type="file"
            accept=".htm,.html"
            onChange={handleFileUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <Input
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
            ref={importInputRef}
          />

          {!src ? (
            <FileUploadArea
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onChooseFile={triggerFileInput}
            />
          ) : (
            <>
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 bg-zinc-100 dark:bg-zinc-950/50 p-4 sm:p-6 overflow-hidden relative">
                <div className="flex-1 flex flex-col h-full overflow-hidden rounded-xl border shadow-sm bg-white dark:bg-zinc-900 relative group">
                  <iframe
                    ref={iframeRef}
                    src={src}
                    onLoad={handleIframeLoad}
                    className="w-full flex-1 border-0 bg-white transition-all duration-200"
                    title="Content"
                  />
                </div>
              </div>

              {/* Sidebar */}
              <AnnotationSidebar
                isOpen={isSidebarOpen}
                annotations={annotations}
                onScrollTo={scrollToAnnotation}
                onUpdateComment={updateAnnotationComment}
                onDelete={(id, e) => deleteAnnotation(id, e)}
                onClearAll={clearAllAnnotations}
                onCopy={handleCopyAnnotation}
              />
            </>
          )}

          {/* Floating Highlight Button */}
          {floatingAnchor && !autoHighlight && (
            <FloatingToolbar
              anchor={floatingAnchor}
              onHighlight={handleHighlight}
              onCopy={() => {
                const selection = iframeRef.current?.contentDocument?.getSelection();
                if (selection) {
                  navigator.clipboard.writeText(selection.toString());
                  toast.success("Copied to clipboard");
                  setFloatingAnchor(null);
                  selection.removeAllRanges();
                }
              }}
              onRemoveHighlight={handleRemoveHighlight}
              highlightColor={highlightColor}
            />
          )}
        </main>

        {/* Status Bar */}
        {src && (
          <StatusBar
            fileName={fileName}
            autoHighlight={autoHighlight}
            zoomLevel={zoomLevel}
            setZoomLevel={(value) => {
                setZoomLevel(value);
                if (iframeRef.current?.contentDocument?.body) {
                    (iframeRef.current.contentDocument.body.style as any).zoom = value;
                }
            }}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
          />
        )}

        {/* Custom Context Menu */}
        {contextMenu && (
          <ContextMenu
            position={contextMenu}
            targetId={contextMenu.targetId}
            onHighlight={handleHighlight}
            onRemoveHighlight={handleRemoveHighlight}
            onCopy={() => {
              const selection = iframeRef.current?.contentDocument?.getSelection();
              if (selection) {
                navigator.clipboard.writeText(selection.toString());
                toast.success("Copied to clipboard");
              }
              setContextMenu(null);
            }}
            onDelete={(id) => deleteAnnotation(id)}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
