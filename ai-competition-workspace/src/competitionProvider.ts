import * as vscode from 'vscode';

// 트리에 표시될 아이템
export class CompetitionItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly itemType: 'competition' | 'experiment',
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly score?: number
    ) {
        super(label, collapsibleState);

        // 아이템 타입에 따라 아이콘 설정
        if (itemType === 'competition') {
            this.iconPath = new vscode.ThemeIcon('folder');
            this.contextValue = 'competition';
        } else {
            this.iconPath = new vscode.ThemeIcon('symbol-method');
            this.contextValue = 'experiment';
            
            // 점수가 있으면 description에 표시
            if (score !== undefined) {
                this.description = `Score: ${score.toFixed(4)}`;
            }
        }

        this.tooltip = `${this.label}`;
    }
}

// 데이터 제공자
export class CompetitionProvider implements vscode.TreeDataProvider<CompetitionItem> {
    // 데이터 변경 이벤트
    private _onDidChangeTreeData = new vscode.EventEmitter<CompetitionItem | undefined | null>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    // 샘플 데이터
    private data = {
        'Titanic': [
            { name: 'exp-001-baseline', score: 0.7655 },
            { name: 'exp-002-feature-eng', score: 0.7842 },
            { name: 'exp-003-xgboost', score: 0.8012 }
        ],
        'House Prices': [
            { name: 'exp-001-linear', score: 0.1234 },
            { name: 'exp-002-random-forest', score: 0.1156 }
        ],
        'Digit Recognizer': [
            { name: 'exp-001-cnn', score: 0.9912 }
        ]
    };

    // 새로고침
    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    // 트리 아이템 반환
    getTreeItem(element: CompetitionItem): vscode.TreeItem {
        return element;
    }

    // 자식 요소 반환
    getChildren(element?: CompetitionItem): Thenable<CompetitionItem[]> {
        if (!element) {
            // 루트: 대회 목록
            const competitions = Object.keys(this.data).map(name => 
                new CompetitionItem(
                    name,
                    'competition',
                    vscode.TreeItemCollapsibleState.Collapsed
                )
            );
            return Promise.resolve(competitions);
        } else if (element.itemType === 'competition') {
            // 대회 아래: 실험 목록
            const experiments = this.data[element.label as keyof typeof this.data] || [];
            const items = experiments.map(exp =>
                new CompetitionItem(
                    exp.name,
                    'experiment',
                    vscode.TreeItemCollapsibleState.None,
                    exp.score
                )
            );
            return Promise.resolve(items);
        }

        return Promise.resolve([]);
    }
}