import * as vscode from "vscode";
import { RequestType } from "../types/types";

export const webViewHtml = (
  api: RequestType,
  webview: vscode.Webview,
  extensionUri: vscode.Uri
) => {
  const getWebviewUri = (filename: string) => {
    return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "dist", filename));
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Detail</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.apiData = ${JSON.stringify(api)};
      </script>
      <script src="${getWebviewUri("webview.js")}"></script>
    </body>
    </html>
  `;
};
