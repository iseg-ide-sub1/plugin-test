import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let actions: any[] = [];

export function activate(context: vscode.ExtensionContext) {
    // 监听编辑器中的操作
    context.subscriptions.push(
        // 修改文本文件事件
        vscode.workspace.onDidChangeTextDocument(event => {
            logAction('changeTextDocument', event);
            // logAction('changeTextDocument', event.document.uri.toString());
        }),
        // 保存文本文件事件
        vscode.workspace.onDidSaveTextDocument(event => {
            logAction('saveTextDocument', event);
            logAction('saveTextDocument', event.uri.toString());
        }),
        // 切换文本编辑器事件
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                logAction('changeActiveEditor', editor);
                // logAction('changeActiveEditor', editor.document.uri.toString());
            }
        })
    );

    // 注册命令，保存动作数据
    context.subscriptions.push(
        vscode.commands.registerCommand('action.save', () => {
            saveActions();
        })
    );
}

function logAction(action: string, event: any) {
    actions.push({ action, event, timestamp: new Date().toLocaleString('zh-CN')});
}

function saveActions() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }
    const filePath = path.join(workspaceFolders[0].uri.fsPath, 'actions.json');
    fs.writeFileSync(filePath, JSON.stringify(actions, null, 2));
    vscode.window.showInformationMessage(`Actions saved to ${filePath}`);
}

export function deactivate() {}
