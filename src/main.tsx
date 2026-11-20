import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 字体表先用 media="print" 拿，不挡首屏；连不上 Google Fonts 时就一直用系统字体
const fontSheet = document.getElementById("google-fonts") as HTMLLinkElement | null;
if (fontSheet) {
  if (fontSheet.sheet) fontSheet.media = "all";
  else fontSheet.addEventListener("load", () => { fontSheet.media = "all"; }, { once: true });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
