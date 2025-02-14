import "./preview.css";
import { FC, useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  error: string;
}

const html = `
    <html lang="en">
    <head>
      <title>Bundled Code</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (e) => {
            const root = document.getElementById("root");
            root.innerHTML = "<div style='color: red;'><h4>Runtime Error</h4>" + e + "</div>";
            console.error(e);
        }
        
        window.addEventListener("error", (e) => {
            e.preventDefault();
            handleError(e.error);
        })
        
        window.addEventListener("message", (e) => {
          try {
            eval(e.data)
          } catch (e) {
            handleError(e);
          }
        }, false);
      </script>
    </body>
    </html>
  `;

const Preview: FC<PreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (iframe?.contentWindow) {
      iframe.srcdoc = html;

      const onLoad = () => {
        // @ts-expect-error this is checked above
        iframe.contentWindow.postMessage(code, "*");
      };

      iframe.addEventListener("load", onLoad);

      return () => {
        iframe.removeEventListener("load", onLoad);
      };
    }
  }, [code]);

  return (
    <div className={"preview-wrapper"}>
      <iframe ref={iframeRef} sandbox={"allow-scripts"} />
      {error && <div className={"preview-error"}>{error}</div>}
    </div>
  );
};

export default Preview;
