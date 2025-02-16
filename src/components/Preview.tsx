import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  error: string;
}

const html = `
    <html lang="en">
    <head>
      <title>Bundled Code</title>
      <style>
        body, html {
          height: 100%;
          margin: 0;
        }
        
        #root > * {
          height: 100vh;
          margin: 0;
        }
        
        .placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .placeholder h1 {
          font-size: 2.5rem;
          font-weight: 600;
          color: #f5f5f5;
          text-transform: capitalize;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
      </style>
    </head>
    <body>
      <div id="root">
        <div class="placeholder">
          <h1>TinkerJS</h1>
        </div>
      </div>
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

const Preview = ({ code, error }: PreviewProps) => {
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
