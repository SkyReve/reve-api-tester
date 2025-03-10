// extension.ts
import * as vscode from "vscode";

import { ApiTreeDataProvider } from "./apiTreeDataProvider";
import { RequestType } from "./types/types";
import { syncApisCommand } from "./commands/syncApisCommand";
import { showRequestDetailView } from "./commands/showRequestDetailView";

// 세션 낸에서 유지
let apiTreeProvider: ApiTreeDataProvider;
let logChannel: vscode.OutputChannel;
let extensionContext: vscode.ExtensionContext;
let currentPanel: vscode.WebviewPanel | undefined;

export const activate = async (context: vscode.ExtensionContext) => {
  // activate할 때 API 동기화 실행
  // TreeDataProvider 등록 및 subscriptions에 추가
  apiTreeProvider = new ApiTreeDataProvider(context);
  syncApisCommand(context, apiTreeProvider);

  // context 저장
  extensionContext = context;
  logChannel = vscode.window.createOutputChannel("API Tester Log");

  // Disposable 리소를 해제를 위해 subscriptions에 추가
  context.subscriptions.push(
    vscode.commands.registerCommand("skyreve-api-test.syncApis", async () => {
      syncApisCommand(context, apiTreeProvider);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("skyreve-api-test.openRequest", (api: RequestType) => {
      showRequestDetailView(context, api, logChannel);
    })
  );

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("requestTreeView", apiTreeProvider)
  );
};

// Provider 가져오는 함수 추가
export const getTreeProvider = () => {
  return apiTreeProvider;
};

export const setCurrentPanel = (panel: vscode.WebviewPanel | undefined) => {
  currentPanel = panel;
};
export const getCurrentPanel = () => {
  return currentPanel;
};
