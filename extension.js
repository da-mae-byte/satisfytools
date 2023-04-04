const vscode = require('vscode');

const SEARCH_ENGINE = {
	Google:	"https://www.google.com/search?q=",
	Bing:	"https://www.bing.com/search?q=",
	Yahoo:	"https://search.yahoo.co.jp/search?p=",
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// numbering
	// 複数選択時に選択した順番に番号を振る
	context.subscriptions.push(
		vscode.commands.registerCommand('satisfytools.numbering', function () {
			// 設定を取得
			let conf = vscode.workspace.getConfiguration("satisfytools").get("numbering");
			let padding_char = conf["paddingCharcter"];
			if (padding_char == "空白" || padding_char == "blank") {
				padding_char = " ";
			}

			// アクティブなテキストエディタを取得
			let editor = vscode.window.activeTextEditor;

			let selections = editor.selections;  // 選択箇所を取得（複数）
			let maxnum = selections.length;      // 選択数を取得
			let digit = String(maxnum).length;   // 選択数から桁数を決定

			// 選択箇所に番号を挿入
			editor.edit(editBuilder => {
				if (conf["padding"]) {
					// パディングする
					selections.forEach((cursor, i) => {
						editBuilder.insert(cursor.active, String(i + 1).padStart(digit, padding_char));
						// let sel = new vscode.Selection(cursor.active - digit, cursor.active);
					});
				}
				else {
					// パディングしない
					selections.forEach((cursor, i) => {
						editBuilder.insert(cursor.active, String(i + 1));
						// let sel = new vscode.Selection(cursor.active - String(i + 1).length, cursor.active);
					});
				}
			});
		})
	);


	function selectionIncrease(n) {
		// アクティブなテキストエディタを取得
		let editor = vscode.window.activeTextEditor;

		// 選択箇所を取得（複数）
		let selections = editor.selections;

		// 選択箇所の数値を加算
		editor.edit(editBuilder => {
			selections.forEach((cursor, i) => {
				// 選択中の文字列を取得
				let selrange = new vscode.Range(cursor.start, cursor.end);
				let text = editor.document.getText(selrange);
				editBuilder.replace(selrange, String(Number(text) + n));
			});
		});
	}


	// increase
	// 選択している数値またはカーソルがある位置にある数値を+1する
	context.subscriptions.push(
		vscode.commands.registerCommand('satisfytools.increase', function () {
			selectionIncrease(1);
		})
	);


	// decrease
	// 選択している数値またはカーソルがある位置にある数値を-1する
	context.subscriptions.push(
		vscode.commands.registerCommand('satisfytools.decrease', function () {
			selectionIncrease(-1);
		})
	);


	// search
	// 選択した文字列をGoogleで検索する
	context.subscriptions.push(
		vscode.commands.registerCommand('satisfytools.search', function () {
			// 設定を取得
			let conf = vscode.workspace.getConfiguration("satisfytools").get("search");

			// アクティブなテキストエディタを取得
			let editor = vscode.window.activeTextEditor;

			// 選択中の文字列を取得
			let selrange = new vscode.Range(editor.selection.start, editor.selection.end);
			let text = editor.document.getText(selrange);

			// URLを開く
			if (text != "") {
				let url = SEARCH_ENGINE[conf["searchEngine"]] + String(text);
				vscode.env.openExternal(vscode.Uri.parse(url));
			}
		})
	);

}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
