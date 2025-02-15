import "./text-editor.css";
import { FC, useEffect, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Cell, updateCell } from "../state";
import { useAppDispatch } from "../hooks/useAppDispatch.ts";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: FC<TextEditorProps> = ({ cell }) => {
  const dispatch = useAppDispatch();
  const editorRef = useRef<HTMLDivElement | null>(null);
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
        <MDEditor
          value={cell.content}
          onChange={(value) =>
            dispatch(updateCell({ cellId: cell.id, content: value || "" }))
          }
        />
      </div>
    );
  }

  return (
    <div className={"text-editor card"} onClick={() => setEditing(true)}>
      <div className={"card-content"}>
        <MDEditor.Markdown source={cell.content || "Click to edit"} />
      </div>
    </div>
  );
};

export default TextEditor;
