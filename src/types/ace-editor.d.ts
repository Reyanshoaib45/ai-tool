
declare module "react-ace" {
  import * as React from "react";
  
  export interface IAceEditorProps {
    mode?: string;
    theme?: string;
    name?: string;
    className?: string;
    height?: string;
    width?: string;
    fontSize?: number | string;
    showGutter?: boolean;
    showPrintMargin?: boolean;
    highlightActiveLine?: boolean;
    focus?: boolean;
    readOnly?: boolean;
    cursorStart?: number;
    wrapEnabled?: boolean;
    enableBasicAutocompletion?: boolean;
    enableLiveAutocompletion?: boolean;
    tabSize?: number;
    debounceChangePeriod?: number;
    editorProps?: object;
    setOptions?: object;
    style?: object;
    scrollMargin?: number[];
    annotations?: object[];
    markers?: object[];
    keyboardHandler?: string;
    value?: string;
    defaultValue?: string;
    onSelectionChange?: (value: any, event?: any) => void;
    onCursorChange?: (value: any, event?: any) => void;
    onInput?: (event?: any) => void;
    onLoad?: (editor: any) => void;
    onValidate?: (annotations: any[]) => void;
    onChange?: (value: string, event?: any) => void;
    onFocus?: (event: any) => void;
    onBlur?: (event: any) => void;
    onCopy?: (value: string) => void;
    onPaste?: (value: string) => void;
    commands?: any[];
  }

  declare const AceEditor: React.ComponentClass<IAceEditorProps>;
  export default AceEditor;
}

declare module "ace-builds/src-noconflict/mode-html" {}
declare module "ace-builds/src-noconflict/mode-css" {}
declare module "ace-builds/src-noconflict/mode-javascript" {}
declare module "ace-builds/src-noconflict/mode-php" {}
declare module "ace-builds/src-noconflict/theme-github" {}
declare module "ace-builds/src-noconflict/theme-monokai" {}
