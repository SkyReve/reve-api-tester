import * as vscode from "vscode";
import { scanApiFiles } from "../utils/scanApiFiles";
import { RequestType } from "../types/types";
import { ApiTreeDataProvider } from "../apiTreeDataProvider";
import { webViewHtml } from "../webview/viewViewHtml";
import { getCurrentPanel } from "../extension";
import { saveRequestList } from "../utils/storage";
// 전역 변수에 webview panel 추가
let currentPanel: vscode.WebviewPanel | undefined;

export let requestList: RequestType[] = []; // Global API list

export const syncApisCommand = async (
  context: vscode.ExtensionContext,
  treeDataProvider: ApiTreeDataProvider
) => {
  // 로컬 파일 시스템에서 API 파일 스캔
  const scannedRequests = await scanApiFiles(context);

  // TODO: globalState에 저장된 목록 불러오와서 유저가 입력한 Values 복구
  // requestList = loadRequestList(context);
  // await saveRequestList(context, requestList);
  await saveRequestList(context, scannedRequests);

  // 패널이 켜져있으면 새로고침
  const panel = getCurrentPanel();
  if (panel) {
    // 현재 표시 중인 API의 새로운 데이터로 webview 업데이트
    const currentEndpoint = panel.title.replace("상세 정보", "").trim().split(" ")[1];
    const currentApi = scannedRequests.find((req) => {
      return req.endpoint === currentEndpoint;
    });

    if (currentApi) {
      panel.webview.html = webViewHtml(currentApi, panel.webview, context.extensionUri);
    }
  }

  // Refresh treeview using the global instance
  treeDataProvider.refresh();

  vscode.window.showInformationMessage("API synchronization completed");
};
