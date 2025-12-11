import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Menu,
  FileCode,
  Upload,
  FileUp,
  Download,
  PanelRightClose,
  PanelRightOpen,
  Contrast,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HIGHLIGHT_COLORS } from "@/lib/constants";
import { useTheme } from "next-themes";

interface ToolbarProps {
  src: string | null;
  fileName: string | null;
  autoHighlight: boolean;
  setAutoHighlight: (value: boolean) => void;
  highlightColor: string;
  setHighlightColor: (color: string) => void;
  onFileUpload: () => void;
  onImport: () => void;
  onSave: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  contentTheme: 'light' | 'dark';
  setContentTheme: (theme: 'light' | 'dark') => void;
  children?: React.ReactNode; // For mobile sidebar trigger
}

export function Toolbar({
  src,
  fileName,
  autoHighlight,
  setAutoHighlight,
  highlightColor,
  setHighlightColor,
  onFileUpload,
  onImport,
  onSave,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleSidebar,
  isSidebarOpen,
  contentTheme,
  setContentTheme,
  children
}: ToolbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background/80 backdrop-blur-md px-4 h-14 flex items-center justify-between shrink-0 z-20 gap-4">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden -ml-2">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Access tools and settings.</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-6">
              {/* Mobile Color Picker */}
              <div className="space-y-3">
                <Label>Highlight Color</Label>
                <div className="flex items-center gap-3">
                  {HIGHLIGHT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setHighlightColor(color.value)}
                      className={cn(
                        "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                        color.value === highlightColor
                          ? "ring-2 ring-offset-2 ring-zinc-900 scale-110"
                          : "",
                        color.border
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {color.value === highlightColor && (
                        <Check className="w-4 h-4 text-zinc-900/50" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Mobile Auto Highlight */}
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="mobile-auto-highlight"
                  className="flex items-center gap-2"
                >
                  <Zap
                    className={cn(
                      "w-4 h-4",
                      autoHighlight ? "text-yellow-500" : "text-muted-foreground"
                    )}
                  />
                  Auto Highlight
                </Label>
                <Switch
                  id="mobile-auto-highlight"
                  checked={autoHighlight}
                  onCheckedChange={setAutoHighlight}
                />
              </div>

              <Separator />

              {/* Mobile File Actions */}
              <div className="space-y-2">
                <Label>File Actions</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    onClick={onFileUpload}
                    className="justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onImport}
                    className="justify-start"
                  >
                    <FileUp className="w-4 h-4 mr-2" />
                    Import JSON
                  </Button>
                  <Button onClick={onSave} className="justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Save Annotations
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Mobile Theme */}
              <div className="flex items-center justify-between">
                <Label>App Theme</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <Label>Content Theme</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setContentTheme(contentTheme === "dark" ? "light" : "dark")
                  }
                >
                  <Contrast className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md hidden md:block">
            <FileCode className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight hidden md:block">
            HTM Annotator
          </h1>
        </div>

        {src && (
          <div className="hidden md:block">
            <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer font-normal text-sm h-8">
                  File
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={onFileUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Open File... <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={onImport}>
                    <FileUp className="w-4 h-4 mr-2" />
                    Import JSON... <MenubarShortcut>⌘I</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={onSave}>
                    <Download className="w-4 h-4 mr-2" />
                    Save Annotations <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer font-normal text-sm h-8">
                  View
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={onToggleSidebar}>
                    {isSidebarOpen ? (
                      <PanelRightClose className="w-4 h-4 mr-2" />
                    ) : (
                      <PanelRightOpen className="w-4 h-4 mr-2" />
                    )}
                    Toggle Sidebar
                  </MenubarItem>
                  <MenubarItem
                    onClick={() =>
                      setContentTheme(contentTheme === "dark" ? "light" : "dark")
                    }
                  >
                    <Contrast className="w-4 h-4 mr-2" />
                    Toggle Content Theme
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={onZoomIn}>
                    <ZoomIn className="w-4 h-4 mr-2" />
                    Zoom In
                  </MenubarItem>
                  <MenubarItem onClick={onZoomOut}>
                    <ZoomOut className="w-4 h-4 mr-2" />
                    Zoom Out
                  </MenubarItem>
                  <MenubarItem onClick={onZoomReset}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Zoom
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {src && (
          <>
            {/* Desktop Color Picker */}
            <div className="items-center gap-1 hidden md:flex bg-muted/50 p-1 rounded-full border">
              {HIGHLIGHT_COLORS.map((color) => (
                <Tooltip key={color.value}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setHighlightColor(color.value)}
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        color.value === highlightColor
                          ? "ring-2 ring-offset-1 ring-zinc-900 scale-110"
                          : "hover:scale-110",
                        color.border
                      )}
                      style={{ backgroundColor: color.value }}
                    >
                      {color.value === highlightColor && (
                        <Check className="w-2.5 h-2.5 text-zinc-900/50" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{color.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <div className="items-center gap-2 hidden md:flex px-2">
              <Switch
                id="auto-highlight"
                checked={autoHighlight}
                onCheckedChange={setAutoHighlight}
                className="scale-75"
              />
              <Label
                htmlFor="auto-highlight"
                className="flex items-center gap-1.5 cursor-pointer text-xs font-medium"
              >
                <Zap
                  className={cn(
                    "w-3.5 h-3.5 transition-colors",
                    autoHighlight ? "text-yellow-500" : "text-muted-foreground"
                  )}
                />
                Auto
              </Label>
            </div>

            <Separator orientation="vertical" className="h-6 hidden md:block" />
          </>
        )}
        {src && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden md:flex"
                onClick={() =>
                  setContentTheme(contentTheme === "dark" ? "light" : "dark")
                }
              >
                <Contrast className="h-4 w-4" />
                <span className="sr-only">Toggle content theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle content theme</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden md:flex"
              onClick={onToggleSidebar}
            >
              {isSidebarOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle sidebar</p>
          </TooltipContent>
        </Tooltip>

        {children}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hidden md:flex"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
