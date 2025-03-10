import * as assert from "assert";

// 'vscode' 모듈의 모든 API를 가져와 사용할 수 있습니다
// 확장을 가져와 테스트할 수도 있습니다
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

suite("확장 테스트 스위트", () => {
  vscode.window.showInformationMessage("모든 테스트를 시작합니다.");

  test("샘플 테스트", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
