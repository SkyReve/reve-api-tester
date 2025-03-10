// apiTreeDataProvider.ts
import * as vscode from "vscode";
import { getBranchName, loadRequestList } from "./utils/storage";
import { RequestType } from "./types/types";

// TreeView : VSCode 트리 뷰에서 각 항목을 나타내는 기본 클래스.
export class ApiItem extends vscode.TreeItem {
  constructor(public readonly api: RequestType) {
    super(api.name, vscode.TreeItemCollapsibleState.None);
    // this.tooltip = `Endpoint: ${api.endpoint}`;
    // this.description = api.endpoint;
    // 클릭 시, API 상세 정보를 보여주는 명령을 실행하도록 설정
    this.command = {
      command: "skyreve-api-test.openRequest",
      title: "Open API",
      arguments: [api],
    };
  }
}

// 도메인 그룹을 나타내는 TreeItem (예: "events", "users")
export class DomainItem extends vscode.TreeItem {
  public readonly domain: string;
  public readonly children: RequestType[];
  constructor(domain: string, children: RequestType[]) {
    super(domain, vscode.TreeItemCollapsibleState.Collapsed);
    this.domain = domain;
    this.children = children;
  }
}

// ParentGroup 클래스 추가
export class ParentGroup extends vscode.TreeItem {
  constructor(public readonly name: string, public readonly children: DomainItem[]) {
    super(name, vscode.TreeItemCollapsibleState.Expanded);
    this.iconPath = new vscode.ThemeIcon("git-branch");
    this.contextValue = "parentGroup";
  }
}

export class ApiTreeDataProvider
  implements vscode.TreeDataProvider<ApiItem | DomainItem | ParentGroup>
{
  private _onDidChangeTreeData: vscode.EventEmitter<ApiItem | undefined | void> =
    new vscode.EventEmitter<ApiItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<ApiItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  // 트리 항목 렌더링
  getTreeItem(element: ApiItem | DomainItem | ParentGroup): vscode.TreeItem {
    return element;
  }

  //- 트리에서 자식 항목을 반환
  getChildren(
    element?: ApiItem | DomainItem | ParentGroup
  ): Thenable<(ApiItem | DomainItem | ParentGroup)[]> {
    if (!element) {
      // 최상위 레벨: branch 이름
      // .reve/env.json 내 branch_named
      const branchName = getBranchName(this.context);
      return Promise.resolve([new ParentGroup(branchName, [])]);
    }

    // 부모 그룹의 자식 항목 반환
    if (element instanceof ParentGroup) {
      // dev 그룹의 자식으로 도메인 그룹들 반환
      const groups: Map<string, RequestType[]> = new Map();
      const requestList = loadRequestList(this.context);

      requestList.forEach((request) => {
        const parts = request.endpoint.split("/").filter((part) => part);
        const domain = parts[0] || "unknown";
        if (!groups.has(domain)) {
          groups.set(domain, []);
        }
        groups.get(domain)!.push(request);
      });

      const domainItems: DomainItem[] = [];
      groups.forEach((requests, domain) => {
        domainItems.push(new DomainItem(domain, requests));
      });
      return Promise.resolve(domainItems);
    }

    // 도메인 그룹의 자식으로 API 항목들 반환
    if (element instanceof DomainItem) {
      const items = element.children.map((request) => new ApiItem(request));
      return Promise.resolve(items);
    }

    return Promise.resolve([]);
  }

  // TreeView 갱신 메서드: undefined를 전달해 전체 트리를 새로고침
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
