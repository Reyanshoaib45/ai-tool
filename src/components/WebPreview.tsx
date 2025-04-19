
import React, { useRef, useEffect, useState } from "react";
import { RefreshCw, Maximize, Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebPreviewProps {
  html: string;
  css?: string;
  js?: string;
  isLoading?: boolean;
}

const WebPreview = ({ html, css = "", js = "", isLoading = false }: WebPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewportSize, setViewportSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const refreshPreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${css}</style>
            </head>
            <body>
              ${html}
              <script>${js}</script>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  };

  useEffect(() => {
    refreshPreview();
  }, [html, css, js]);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen().catch(console.error);
    } else {
      const previewContainer = iframeRef.current?.parentElement;
      if (previewContainer) {
        previewContainer.requestFullscreen().catch(console.error);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const getViewportClass = () => {
    switch (viewportSize) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
      default:
        return "w-full h-full";
    }
  };

  return (
    <div className="rounded-md border shadow-sm flex flex-col h-full">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-t-md flex justify-between items-center">
        <div className="text-sm font-medium">Preview</div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md overflow-hidden">
            <Button
              variant={viewportSize === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewportSize("mobile")}
              className="rounded-r-none h-8 w-8 p-0"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={viewportSize === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewportSize("tablet")}
              className="rounded-none h-8 w-8 p-0"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={viewportSize === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewportSize("desktop")}
              className="rounded-l-none h-8 w-8 p-0"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={refreshPreview} className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-white p-4 overflow-auto flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className={`${getViewportClass()} border mx-auto overflow-auto`}>
            <iframe
              ref={iframeRef}
              title="Web Preview"
              className="w-full h-full"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebPreview;
