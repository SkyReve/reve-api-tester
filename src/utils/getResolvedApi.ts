import { MessageRequestType } from "../types/types";

/**
 * params를 적용하녀 생성된 호출 API를  반환하는 함수
 * @param baseUrl - 기본 URL
 * @param endpoint - 엔드포인트
 * @param request - 요청 파라미터
 * @returns 실제 호출되는 엔드포인트
 */
export const getResolvedApi = (baseUrl: string, endpoint: string, request: MessageRequestType) => {
  let finalEndpoint = `${baseUrl}${endpoint}`;
  if (request.pathParams && Object.keys(request.pathParams).length > 0) {
    finalEndpoint = finalEndpoint.replace(/\{.*?\}/g, (match) => {
      const key = match.slice(1, -1);
      return request.pathParams?.[key] || match;
    });
  }
  if (request.queryParams && Object.keys(request.queryParams).length > 0) {
    finalEndpoint += "?";
    Object.entries(request.queryParams).forEach(([key, value]) => {
      finalEndpoint += `${key}=${value}&`;
    });
  }
  return finalEndpoint;
};
