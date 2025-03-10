export interface ParamType {
  name: string;
  value?: string;
  type?: string;
  description?: string;
}

export interface RequestType {
  id: string;
  name: string;
  branchName: string;
  httpMethod: string;
  endpoint: string;
  description?: string;
  pathParams?: ParamType[];
  queryParams?: ParamType[];
  bodyParams?: ParamType[];
  headers?: ParamType[];
  response?: {
    statusCode: number;
    bodyParams?: ParamType[];
  }[];
}

export interface EnvType {
  access_token: string;
  refresh_token: string;
  user_id: string;
  display_name: string;
  personal_space_id: string;
  user_email: string;
  project_id: string;
  project_name: string;
  branch_id: string;
  branch_name: string;
  base_service_url: string;
  base_test_url: string;
}

export interface MessageRequestType {
  bodyParams?: Record<string, string>;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
}
export interface MessageType {
  command: string;
  endpoint: string;
  request: MessageRequestType;
}
