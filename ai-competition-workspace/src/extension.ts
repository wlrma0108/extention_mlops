import * as vscode from 'vscode';
import { CompetitionProvider, CompetitionItem } from './competitionProvider';

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

    // Run Experiment 커맨드
    const runExperimentCmd = vscode.commands.registerCommand(
        'aiWorkspace.runExperiment',
        async (item?: CompetitionItem) => {
            // 트리에서 클릭했으면 item이 넘어옴
            const experimentName = item?.label || 'Unknown Experiment';

            // 진행 상황 표시와 함께 실행
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `실험 '${experimentName}' 실행 중...`,
                cancellable: true
            }, async (progress, token) => {
                // 취소 감지
                token.onCancellationRequested(() => {
                    vscode.window.showWarningMessage('실험이 취소되었습니다.');
                });

                // 진행 상황 시뮬레이션
                for (let i = 0; i <= 100; i += 20) {
                    if (token.isCancellationRequested) {
                        return;
                    }

                    progress.report({ 
                        increment: 20, 
                        message: `${i}% 완료` 
                    });

                    // 1초 대기 (실제로는 학습 로직)
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                vscode.window.showInformationMessage(
                    `실험 '${experimentName}' 완료! 🎉`
                );
            });
        }
    );

    // View Details 커맨드
    const viewDetailsCmd = vscode.commands.registerCommand(
        'aiWorkspace.viewDetails',
        (item?: CompetitionItem) => {
            if (!item) {
                vscode.window.showErrorMessage('실험을 선택해주세요.');
                return;
            }

            // 상세 정보를 QuickPick으로 표시
            const details = [
                `📊 실험명: ${item.label}`,
                `📈 점수: ${item.score?.toFixed(4) || 'N/A'}`,
                `📅 생성일: ${new Date().toLocaleDateString()}`,
                `⚙️ 상태: 완료`
            ];

            vscode.window.showQuickPick(details, {
                placeHolder: `${item.label} 상세 정보`,
                canPickMany: false
            });
        }
    );

    // 모두 subscriptions에 등록
    context.subscriptions.push(
        treeView,
        helloCmd,
        createProjectCmd,
        refreshCmd,
        runExperimentCmd,
        viewDetailsCmd
    );
}

export function deactivate() {}