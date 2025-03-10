import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApiDetail } from "./ApiDetail";

// window에 선언된 apiData를 사용
declare global {
  interface Window {
    apiData: any;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<ApiDetail api={window.apiData} />);
