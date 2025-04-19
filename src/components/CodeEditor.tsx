
import React, { useState } from "react";
import AceEditor from "react-ace";
// These imports are for type checking only, actual imports will happen at runtime
// import "ace-builds/src-noconflict/mode-php";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/mode-css";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/theme-monokai";
import { Button } from "@/components/ui/button";
import { Copy, Check, Play } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  onExecute?: () => void;
  darkMode?: boolean;
}

const CodeEditor = ({
  code,
  language,
  onChange,
  onExecute,
  darkMode = false,
}: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-md border shadow-sm">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-t-md">
        <div className="text-sm font-medium">
          {language.charAt(0).toUpperCase() + language.slice(1)} Editor
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          {onExecute && (
            <Button
              variant="default"
              size="sm"
              onClick={onExecute}
              className="h-8 gap-1"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
          )}
        </div>
      </div>
      <AceEditor
        mode={language}
        theme={darkMode ? "monokai" : "github"}
        onChange={onChange}
        value={code}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        width="100%"
        height="400px"
        showPrintMargin={false}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
