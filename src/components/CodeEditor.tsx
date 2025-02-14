import "./code-editor.css";
import Editor, { OnChange } from "@monaco-editor/react";
import { FC, useState } from "react";
import prettier from "prettier";
import estree from "prettier/plugins/estree";
import typescript from "prettier/plugins/typescript";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const [editorValue, setEditorValue] = useState<string | undefined>(
    initialValue,
  );

  const onEditorUpdate: OnChange = (value) => {
    setEditorValue(value);
    if (value) {
      onChange(value);
    }
  };

  const onFormatClick = async () => {
    if (editorValue) {
      const formattedValue = (
        await prettier.format(editorValue, {
          parser: "typescript",
          plugins: [typescript, estree],
          useTabs: false,
          semi: true,
          singleQuote: false,
        })
      ).replace(/\n$/, "");
      setEditorValue(formattedValue);
    }
  };

  return (
    <div className={"editor-wrapper"}>
      <button
        className={"button button-format is-primary is-small"}
        onClick={onFormatClick}
      >
        Format
      </button>
      <Editor
        value={editorValue}
        onChange={onEditorUpdate}
        language={"javascript"}
        theme={"vs-dark"}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderWhitespace: "all",
        }}
        height={"300px"}
      />
    </div>
  );
};

export default CodeEditor;
