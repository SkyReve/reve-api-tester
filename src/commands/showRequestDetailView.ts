// extension.ts
import * as vscode from "vscode";
import { MessageType, RequestType } from "../types/types";
import { setCurrentPanel } from "../extension";
import { callRequestWithLogs } from "../utils/callRequestWithLogs";
import { webViewHtml } from "../webview/viewViewHtml";

export const showRequestDetailView = (
  context: vscode.ExtensionContext,
  api: RequestType,
  logChannel: vscode.OutputChannel
) => {
  const panel = vscode.window.createWebviewPanel(
    "apiDetail",
    `${api.name}`, // 'name' 대신 'endpoint' 사용
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  setCurrentPanel(panel);

  // Panel이 닫힐 때 처리
  panel.onDidDispose(() => {
    setCurrentPanel(undefined);
  });

  panel.webview.html = webViewHtml(api, panel.webview, context.extensionUri);

  //action 정의
  panel.webview.onDidReceiveMessage(
    async (message: MessageType) => {
      if (message.command === "callRequest") {
        await callRequestWithLogs(api, logChannel, context, message);
      }
    },
    undefined,
    context.subscriptions
  );
};
