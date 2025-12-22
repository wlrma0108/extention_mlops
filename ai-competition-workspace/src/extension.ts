import * as vscode from 'vscode';
import { CompetitionProvider } from './competitionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('AI Competition Workspace가 활성화되었습니다!');

    // TreeDataProvider 생성
    const competitionProvider = new CompetitionProvider();

    // TreeView 등록
    const treeView = vscode.window.createTreeView('competitionExplorer', {
        treeDataProvider: competitionProvider,
        showCollapseAll: true
    });

    // Hello World 커맨드
    const helloCmd = vscode.commands.registerCommand('aiWorkspace.helloWorld', () => {
        vscode.window.showInformationMessage('안녕하세요! AI Competition Workspace입니다.');
    });

    // Create Project 커맨드
    const createProjectCmd = vscode.commands.registerCommand('aiWorkspace.createProject', async () => {
        const projectName = await vscode.window.showInputBox({
            prompt: '프로젝트 이름을 입력하세요',
            placeHolder: 'my-kaggle-project',
            validateInput: (text) => {
                if (!text) {
                    return '이름을 입력해주세요';
                }
                if (text.includes(' ')) {
                    return '공백은 사용할 수 없습니다';
                }
                return null;
            }
        });

        if (!projectName) {
            return;
        }

        const framework = await vscode.window.showQuickPick(
            ['PyTorch', 'TensorFlow', 'scikit-learn', 'LightGBM'],
            { placeHolder: '사용할 프레임워크를 선택하세요' }
        );

        if (!framework) {
            return;
        }

        vscode.window.showInformationMessage(
            `프로젝트 '${projectName}'이 ${framework} 프레임워크로 생성됩니다!`
        );
    });

    // Refresh 커맨드
    const refreshCmd = vscode.commands.registerCommand('aiWorkspace.refreshExplorer', () => {
        competitionProvider.refresh();
        vscode.window.showInformationMessage('새로고침 완료!');
    });

    // 모두 subscriptions에 등록
    context.subscriptions.push(
        treeView,
        helloCmd,
        createProjectCmd,
        refreshCmd
    );
}

export function deactivate() {}