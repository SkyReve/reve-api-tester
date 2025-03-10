import * as vscode from "vscode";
import { RequestType, MessageType } from "../types/types";
import { axiosRequest } from "./axiosRequest";
import { getBaseUrl } from "./storage";
import { getResolvedApi } from "./getResolvedApi";

export const callRequestWithLogs = async (
  api: RequestType,
  logChannel: vscode.OutputChannel,
  context: vscode.ExtensionContext,
  message: MessageType
) => {
  logChannel.appendLine(`✅ Start Test`);
  logChannel.appendLine(api.endpoint);
  try {
    const baseUrl = getBaseUrl(context);
    const resolvedEndpoint = getResolvedApi(baseUrl, api.endpoint, message.request);

    logChannel.appendLine("-------------------------------------------------");
    logChannel.appendLine(`🚀 Request: ${api.httpMethod} ${resolvedEndpoint}`);

    const response = await axiosRequest({
      logChannel,
      context,
      httpMethod: api.httpMethod,
      endpoint: message.endpoint,
      request: message.request,
    });

    // 성공 메시지 표시
    const status = response.data.api_response.status_code;
    let statusMessage = status;

    switch (status) {
      case 200:
        statusMessage = "200 OK";
        vscode.window.showInformationMessage(`200 OK`);
        break;
      case 201:
        statusMessage = "201 Created";
        vscode.window.showInformationMessage(`201 Created`);
        break;
      case 204:
        statusMessage = "204 No Content";
        vscode.window.showInformationMessage(`204 No Content`);
        break;
      case 400:
        statusMessage = "400 Bad Request";
        vscode.window.showErrorMessage(`400 Bad Request`);
        break;
      case 401:
        statusMessage = "401 Unauthorized";
        vscode.window.showErrorMessage(`401 Unauthorized1`);
        break;
      case 403:
        statusMessage = "403 Forbidden";
        vscode.window.showErrorMessage(`403 Forbidden`);
        break;
      case 404:
        statusMessage = "404 Not Found";
        vscode.window.showErrorMessage(`404 Not Found`);
        break;
      case 503:
        statusMessage = "503 Service Unavailable";
        vscode.window.showErrorMessage(`503 Service Unavailable`);
        break;
      default:
        vscode.window.showErrorMessage(`API Test Error: ${status}`);
        break;
    }

    logChannel.appendLine(`🔔 Response Status: ${statusMessage}`);
    logChannel.appendLine(`📦 Response Data`);
    logChannel.appendLine(JSON.stringify(response.data.api_response.data, null, 2));
    logChannel.appendLine("-------------------------------------------------");
    logChannel.appendLine(`📝 Log`);
    logChannel.appendLine(response.data.api_log);
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    switch (error.response?.status) {
      case 400:
        vscode.window.showErrorMessage(`400 Bad Request `);
        break;
      case 401:
        vscode.window.showErrorMessage(`401 Unauthorized2`);
        break;
      case 403:
        vscode.window.showErrorMessage(`403 Forbidden`);
        break;
      case 404:
        vscode.window.showErrorMessage(`404 Not Found`);
        break;
      case 500:
        vscode.window.showErrorMessage(`500 Internal Server Error`);
        break;
      default:
        vscode.window.showErrorMessage(`API Test Error: ${errorMessage}`);
        break;
    }
    logChannel.appendLine("-------------------------------------------------");
    logChannel.appendLine(`❌ API Test Error`);
    logChannel.appendLine(`📝 Error Message`);
    logChannel.appendLine(JSON.stringify(errorMessage, null, 2));
  } finally {
    logChannel.appendLine("-------------------------------------------------");
    logChannel.show(true);
  }
};
