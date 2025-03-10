import axios from "axios";
import * as vscode from "vscode";
import { getBaseUrl, getAccessToken, saveResolvedEndpoint } from "./storage";
import { MessageRequestType } from "../types/types";
import { getResolvedApi } from "./getResolvedApi";

export const axiosRequest = async ({
  httpMethod,
  endpoint,
  request,
  context,
}: {
  httpMethod: string;
  endpoint: string;
  request: MessageRequestType;
  logChannel: vscode.OutputChannel;
  context: vscode.ExtensionContext;
}) => {
  const baseUrl = getBaseUrl(context);
  const accessToken = getAccessToken(context);

  // GET 요청일 경우 쿼리 파라미터 추가

  const resolvedEndpoint = getResolvedApi(baseUrl, endpoint, request);

  if (httpMethod === "GET" || httpMethod === "DELETE") {
    return axios.request({
      method: httpMethod,
      url: resolvedEndpoint,
      headers: {
        "Reve-Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });
  } else {
    return axios.request({
      method: httpMethod,
      url: resolvedEndpoint,
      headers: {
        "Reve-Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      data: request.bodyParams,
    });
  }
};
