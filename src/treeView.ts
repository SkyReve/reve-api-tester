import * as vscode from "vscode";

// 1. Tree Item 클래스 정의
class SampleTreeItem extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
    this.tooltip = `Tooltip for ${label}`;
    this.description = "Sample description";
  }
}

// 2. TreeDataProvider 구현
export class SampleTreeDataProvider implements vscode.TreeDataProvider<SampleTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<SampleTreeItem | undefined | void> =
    new vscode.EventEmitter<SampleTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<SampleTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  getTreeItem(element: SampleTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SampleTreeItem): Thenable<SampleTreeItem[]> {
    if (!element) {
      // 루트 레벨 아이템들 제공
      return Promise.resolve([new SampleTreeItem("Item 1"), new SampleTreeItem("Item 2")]);
    }
    // 자식 아이템이 필요하면 여기서 처리 (예제에서는 빈 배열 반환)
    return Promise.resolve([]);
  }
}
