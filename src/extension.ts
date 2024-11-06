import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let actions: any[] = [];
let id: number = 0;
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('action.begin', () => {
            actions = [];
            vscode.window.showInformationMessage('Recording starts.')
        })
    );

    // 监听编辑器中的操作
    context.subscriptions.push(
        // 1 打开文本文件
        vscode.workspace.onDidOpenTextDocument(doc => {
            actions.push(doc)
            console.log(id++,'| 1-onDidOpenTextDocument')
            console.log(doc)
        }),
        // 2 关闭文本文件
        vscode.workspace.onDidCloseTextDocument(doc => {
            actions.push(doc)
            console.log(id++,'| 2-onDidCloseTextDocument')
            console.log(doc)
        }),
        // 3 切换编辑器
        vscode.window.onDidChangeActiveTextEditor(editor => {
            actions.push(editor)
            console.log(id++,'| 3-onDidChangeActiveTextEditor')
            console.log(editor)
        }),
        // 4 光标选择
        vscode.window.onDidChangeTextEditorSelection(event => {
            actions.push(event)
            console.log(id++,'| 4-onDidChangeTextEditorSelection')
            // console.log(event.textEditor.document.getText(event.selections[0]))
            console.log(event)
        }),
        // 5 文本内容变化
        vscode.workspace.onDidChangeTextDocument(event => {
            actions.push(event)
            console.log(id++,'| 5-onDidChangeTextDocument')
            console.log(event)
        }),
    );

    // 注册命令，保存动作数据
    context.subscriptions.push(
        vscode.commands.registerCommand('action.save', () => {
            saveActions();
        })
    );
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
