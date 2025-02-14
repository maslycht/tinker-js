import "./text-editor.css";
import { FC, useEffect, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const TextEditor: FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string>("# Hey, TinkerJS!");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setEditing(false);
      }
    };

    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className={"text-editor"} ref={editorRef}>
        <MDEditor value={value} onChange={(value) => setValue(value || "")} />
      </div>
    );
  }

  return (
    <div className={"text-editor card"} onClick={() => setEditing(true)}>
      <div className={"card-content"}>
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
