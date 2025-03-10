import * as vscode from "vscode";
import { RequestType } from "../types/types";

// globalState는 확장 프로그램 전역에서 사용 가능하고, VSCode가 자동으로 상태를 저장한다(확장 프로그램이 재시작되어도 값이 유지됨)
// workspaceState도 사용할 수 있지만, 워크스페이스(프로젝트) 단위로만 값이 저장됨.

// API 정보를 저장하는 키
export const KEY_API_LIST = "skyreve.apiList";

// API 목록을 저장하는 함수
export const saveRequestList = async (context: vscode.ExtensionContext, apiList: RequestType[]) => {
  // 비우고 새로 저장
  await context.globalState.update(KEY_API_LIST, []);
  await context.globalState.update(KEY_API_LIST, apiList);
};

// 저장된 API 목록을 불러오는 함수
export const loadRequestList = (context: vscode.ExtensionContext): RequestType[] => {
  return context.globalState.get<RequestType[]>(KEY_API_LIST, []);
};

// 프로젝트 환경 정보를 저장하는 함수
export const saveProjectEnv = async (
  context: vscode.ExtensionContext,
  baseUrl: string,
  branchName: string,
  accessToken: string
) => {
  await context.globalState.update("baseUrl", baseUrl);
  await context.globalState.update("branchName", branchName);
  await context.globalState.update("accessToken", accessToken);
};

export const getBaseUrl = (context: vscode.ExtensionContext): string => {
  return context.globalState.get("baseUrl", "");
};

export const getAccessToken = (context: vscode.ExtensionContext): string => {
  return context.globalState.get("accessToken", "");
};

export const getBranchName = (context: vscode.ExtensionContext): string => {
  return context.globalState.get("branchName", "");
};

export const saveResolvedEndpoint = async (
  context: vscode.ExtensionContext,
  resolvedEndpoint: string
) => {
  await context.globalState.update("resolvedEndpoint", resolvedEndpoint);
};

export const getResolvedEndpoint = (context: vscode.ExtensionContext): string => {
  return context.globalState.get("resolvedEndpoint", "");
};
