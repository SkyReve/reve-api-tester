import * as React from "react";
import { RequestType } from "../types/types";
import { SectionTitle } from "./components/SectionTitle";
import { TableHeader } from "./components/TableHeader";

declare function acquireVsCodeApi(): any;

interface ApiDetailProps {
  api: RequestType;
}
const vscode = acquireVsCodeApi(); // Webview 상태 관리용
type TabType = "Params" | "Headers" | "Body";

export const ApiDetail: React.FC<ApiDetailProps> = ({ api }) => {
  const savedState = vscode.getState() || { activeTab: "Params" };
  const [activeTab, setActiveTab] = React.useState<TabType>(savedState.activeTab);

  /** api에 필요한 params 기준으로 탭 목록 생성하기 */
  const getTabs = () => {
    const currentTabs: TabType[] = [];

    if ((api.pathParams?.length ?? 0) > 0 || (api.queryParams?.length ?? 0) > 0) {
      currentTabs.push("Params");
    }

    if ((api.headers?.length ?? 0) > 0) {
      currentTabs.push("Headers");
    }

    if ((api.bodyParams?.length ?? 0) > 0) {
      currentTabs.push("Body");
    }
    return currentTabs;
  };
  /** 탭 변경 이벤트 */
  const handleTabChange = (newTab: TabType) => {
    try {
      setActiveTab(newTab);
      vscode.setState({ activeTab: newTab });
    } catch (error) {
      console.error("Error setting tab:", error);
    }
  };

  /** 요청 보내기 버튼 클릭 시 */
  const onClickSendRequestButton = () => {
    const pathValues = Array.from(
      document.querySelectorAll("[data-params='path']")
    ) as HTMLInputElement[];
    const queryValues = Array.from(
      document.querySelectorAll("[data-params='query']")
    ) as HTMLInputElement[];
    const bodyValues = Array.from(
      document.querySelectorAll("[data-params='body']")
    ) as HTMLInputElement[];

    const pathValuesObj: Record<string, string> = {};
    const queryValuesObj: Record<string, string> = {};
    const bodyValuesObj: Record<string, string> = {};

    pathValues.forEach((input) => {
      if (input.value) {
        pathValuesObj[input.name] = input.value;
      }
    });

    queryValues.forEach((input) => {
      if (input.value) {
        queryValuesObj[input.name] = input.value;
      }
    });

    bodyValues.forEach((input) => {
      if (input.value) {
        bodyValuesObj[input.name] = input.value;
      }
    });

    vscode.postMessage({
      command: "callRequest",
      endpoint: api.endpoint,
      request: {
        pathParams: pathValuesObj,
        queryParams: queryValuesObj,
        bodyParams: bodyValuesObj,
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{api.name} 상세 정보</h1>
      <div className="flex items-center gap-2 mb-4">
        <div className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-300">
          {api.httpMethod}
        </div>
        <p className="font-semibold ">{api.endpoint}</p>
      </div>

      {/* Tab 버튼 */}
      <div className="flex items-center mb-4 bg-gray-800 rounded-md  border-b-2 border-gray-700">
        {getTabs()?.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 ${
              activeTab === tab ? "text-white border-b-2 border-blue-500" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <main>
        {activeTab === "Params" && (
          <div className="mb-4">
            {api.pathParams && api.pathParams.length > 0 && (
              <section className="p-4 border border-gray-800 rounded-md mb-10">
                <SectionTitle>Path Parameters</SectionTitle>
                <table className="w-full border-collapse">
                  <TableHeader headers={["Name", "Value", "Type"]} />

                  {api.pathParams?.map((param, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-2 text-sm text-gray-300">{param.name}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder={`Enter ${param.type}`}
                          data-params="path"
                          name={param.name}
                          className="w-full p-1 text-sm bg-gray-800 border border-gray-700 rounded 
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                          placeholder-gray-500 text-gray-300"
                        />
                      </td>
                      <td className="p-2 text-sm text-gray-400">{param.type}</td>
                    </tr>
                  ))}
                </table>
              </section>
            )}

            {api.queryParams && api.queryParams.length > 0 && (
              <section className="p-4 border border-gray-800 rounded-md mb-10">
                <SectionTitle>Query Params</SectionTitle>
                <table className="w-full border-collapse">
                  <TableHeader headers={["Name", "Value", "Type"]} />
                  {api.queryParams?.map((param, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-2 text-sm text-gray-300">{param.name}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          placeholder={`Enter ${param.type}`}
                          data-params="query"
                          name={param.name}
                          className="w-full p-1 text-sm bg-gray-800 border border-gray-700 rounded 
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                          placeholder-gray-500 text-gray-300"
                        />
                      </td>
                      <td className="p-2 text-sm text-gray-400">{param.type}</td>
                    </tr>
                  ))}
                </table>
              </section>
            )}
          </div>
        )}

        {activeTab === "Body" && api.bodyParams && api.bodyParams.length > 0 && (
          <section>
            <SectionTitle>Body Parameters</SectionTitle>
            <table className="w-full border-collapse">
              <TableHeader headers={["Name", "Value", "Type"]} />

              {api.bodyParams?.map((param, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-2 text-sm text-gray-300">{param.name}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder={`Enter ${param.type}`}
                      data-params="body"
                      name={param.name}
                      className="w-full p-1 text-sm bg-gray-800 border border-gray-700 rounded 
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                          placeholder-gray-500 text-gray-300"
                    />
                  </td>
                  <td className="p-2 text-sm text-gray-400">{param.type}</td>
                </tr>
              ))}
            </table>
          </section>
        )}

        {activeTab === "Headers" && (
          <section>
            <h6 className="text-sm font-medium text-gray-300 mb-2">Headers</h6>

            <table className="w-full border-collapse">
              <TableHeader headers={["Name", "Value", "Type"]} />
              {api.headers?.map((param, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-2 text-sm text-gray-300">{param.name}</td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder={`Enter ${param.type}`}
                      data-params="path"
                      name={param.name}
                      className="w-full p-1 text-sm bg-gray-800 border border-gray-700 rounded 
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                          placeholder-gray-500 text-gray-300"
                    />
                  </td>
                  <td className="p-2 text-sm text-gray-400">{param.type}</td>
                </tr>
              ))}
            </table>
          </section>
        )}
      </main>
      <div className="flex">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={onClickSendRequestButton}
        >
          Send
        </button>
      </div>
    </div>
  );
};
