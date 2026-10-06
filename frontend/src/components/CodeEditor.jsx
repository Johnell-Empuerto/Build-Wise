import { loader, Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/editor/editor.worker?worker";
import tsWorker from "monaco-editor/language/typescript/ts.worker?worker";

// Monaco is bundled locally so the editor works without a CDN connection.
self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === "javascript" || label === "typescript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });

export default function CodeEditor({ value, onChange, height = "420px" }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#1e1e1e]">
      <Editor
        height={height}
        language="javascript"
        value={value}
        theme="vs-dark"
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={{
          fontSize: 14,
          tabSize: 2,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "line",
          wordWrap: "on",
        }}
      />
    </div>
  );
}
