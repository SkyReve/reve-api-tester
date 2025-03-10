// scanApiFiles.ts
import * as vscode from "vscode";
import * as path from "path";
import * as yaml from "js-yaml";
import * as fs from "fs";
import { RequestType, ParamType, EnvType } from "../types/types";
import { saveProjectEnv } from "./storage";

export const scanApiFiles = async (context: vscode.ExtensionContext): Promise<RequestType[]> => {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("워크스페이스 폴더가 없습니다.");
    return [];
  }

  // server/src/apis 이하의 모든 YAML 파일 검색
  const pattern = "**/server/src/apis/**/*.yaml";
  const files = await vscode.workspace.findFiles(pattern);

  let requests: RequestType[] = [];

  for (const file of files) {
    // 파일의 상대 경로 예: server/src/apis/events/{event_id}/schedules/{schedule_id}/tickets/get.yaml
    const relativePath = path.relative(workspaceFolder.uri.fsPath, file.fsPath);
    const prefix = path.join("server", "src", "apis");

    let apiPath = relativePath.startsWith(prefix)
      ? relativePath.slice(prefix.length)
      : relativePath;

    if (apiPath.startsWith(path.sep)) {
      apiPath = apiPath.slice(1);
    }

    // 경로 분할: ["events", "{event_id}", "schedules", "{schedule_id}", "tickets", "get.yaml"]
    const segments = apiPath.split(path.sep);
    if (segments.length < 2) {
      continue;
    } // 최소 경로 구조 확인

    // 마지막 요소가 파일명 (예: "get.yaml")
    const fileName = segments.pop()!;
    const httpMethod = fileName.split(".")[0].toUpperCase(); // "get" → "GET"

    // 남은 경로로 API 엔드포인트 구성: "/events/{event_id}/schedules/{schedule_id}/tickets/"
    const endpoint = "/" + segments.join("/") + "/";

    // baseUrl을 .reve/env.json에서 추출하기
    const envFilePath = path.join(workspaceFolder.uri.fsPath, ".reve", "env.json");
    const envFileContents = fs.readFileSync(envFilePath, "utf8");
    const envJson: EnvType = JSON.parse(envFileContents);

    const baseUrl = envJson.base_test_url.replace(/\/$/, "");
    const branchName = envJson.branch_name;
    const accessToken = envJson.access_token;

    // 전역 상태 업데이트
    saveProjectEnv(context, baseUrl, branchName, accessToken);

    //  YAML 파일에서 파라미터 추출
    let bodyParams: ParamType[] = [];
    let queryParams: ParamType[] = [];
    let pathParams: ParamType[] = [];
    let responseParams: { statusCode: number; bodyParams: ParamType[] }[] = [];
    try {
      const fileContents = fs.readFileSync(file.fsPath, "utf8");
      const yamlData = yaml.load(fileContents) as any;
      const requestQueryParams = yamlData?.request?.query_params;
      const requestPathParams = yamlData?.request?.path_params;
      const requestBodyParams = yamlData?.request?.body_params;
      const responseBodyParams = yamlData?.response?.body_params;

      if (requestPathParams) {
        pathParams = requestPathParams.map((param: ParamType) => ({
          name: param.name,
          type: param.type,
        }));
      }
      if (requestQueryParams) {
        queryParams = requestQueryParams.map((param: ParamType) => ({
          name: param.name,

          type: param.type,
        }));
      }
      if (requestBodyParams) {
        requestBodyParams.forEach((resp: any) => {
          bodyParams = resp.params.map((param: ParamType) => ({
            name: param.name,
            type: param.type,
          }));
        });
      }

      // Response Body Params
      if (responseBodyParams) {
        responseBodyParams.forEach((status: any) => {
          responseParams.push({
            statusCode: status.status.code,
            bodyParams: status.params.map((param: ParamType) => ({
              name: param.name,
              type: param.type,
            })),
          });
        });
      }
    } catch (error) {
      console.error(`Error parsing YAML file ${file.fsPath}:`, error);
    }

    // --- 요청 객체 생성
    const request: RequestType = {
      id: relativePath,
      name: `${httpMethod} ${endpoint}`,
      branchName: branchName,
      httpMethod: httpMethod,
      endpoint: endpoint,
      pathParams: pathParams,
      bodyParams: bodyParams,
      queryParams: queryParams,
      response: responseParams,
    };

    requests.push(request);
  }

  return requests;
};
