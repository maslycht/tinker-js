import { FC, useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
}

const html = `
    <html lang="en">
    <head>
      <title>Executed Code</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener("message", (e) => {
          try {
            eval(e.data)
          } catch (e) {
            const root = document.getElementById("root");
            root.innerHTML = "<div style='color: red;'><h4>Runtime Error</h4>" + e + "</div>";
            console.error(e);
          }
        }, false);
      </script>
    </body>
    </html>
  `;

const Preview: FC<PreviewProps> = ({ code }) => {
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

  return <iframe ref={iframeRef} sandbox={"allow-scripts"} />;
};

export default Preview;
