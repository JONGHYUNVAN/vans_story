export interface GameMeta {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  hexColor: string;
  controlInfo: string;
}

export const GAMES: GameMeta[] = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: '클래식 뱀 게임. 먹이를 먹고 점점 길어지는 뱀을 조종하세요.',
    icon: '🐍',
    color: 'bg-emerald-500',
    hexColor: '#10b981',
    controlInfo: '방향키 / 스와이프',
  },
  {
    id: '2048',
    title: '2048',
    description: '숫자 타일을 밀어 합치세요. 2048을 만들 수 있나요?',
    icon: '🔢',
    color: 'bg-amber-500',
    hexColor: '#f59e0b',
    controlInfo: '방향키 / 스와이프',
  },
  {
    id: 'typing',
    title: 'Typing Speed Test',
    description: '개발자를 위한 코드 타이핑 속도 측정. 얼마나 빠르게 칠 수 있나요?',
    icon: '⌨️',
    color: 'bg-indigo-500',
    hexColor: '#6366f1',
    controlInfo: '키보드 타이핑',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: '지뢰를 피해 모든 칸을 열어보세요. 클래식 지뢰찾기 게임.',
    icon: '💣',
    color: 'bg-red-500',
    hexColor: '#ef4444',
    controlInfo: '좌클릭: 열기 / 우클릭: 깃발',
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: '블록을 쌓고 줄을 완성하세요. 클래식 테트리스.',
    icon: '🟦',
    color: 'bg-cyan-500',
    hexColor: '#06b6d4',
    controlInfo: '방향키: 이동 / 위: 회전 / Space: 드롭 / C: 홀드',
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: '중력을 거슬러 파이프 사이를 통과하세요.',
    icon: '🐦',
    color: 'bg-yellow-500',
    hexColor: '#eab308',
    controlInfo: 'Space / 탭: 날기',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: '공으로 모든 벽돌을 부수세요. 클래식 아케이드.',
    icon: '🧱',
    color: 'bg-orange-500',
    hexColor: '#f97316',
    controlInfo: '마우스 / 방향키: 패들 이동',
  },
  {
    id: 'memory',
    title: 'Memory Card',
    description: '카드를 뒤집어 같은 쌍을 찾아보세요. 기억력 게임.',
    icon: '🃏',
    color: 'bg-purple-500',
    hexColor: '#a855f7',
    controlInfo: '카드 클릭',
  },
  {
    id: 'whackamole',
    title: 'Whack-a-Mole',
    description: '두더지가 나타나면 빠르게 클릭하세요!',
    icon: '🔨',
    color: 'bg-amber-700',
    hexColor: '#b45309',
    controlInfo: '두더지 클릭',
  },
  {
    id: 'wordle',
    title: 'Code Wordle',
    description: '개발자 용어로 플레이하는 워들. 5글자 단어를 6번 안에 맞추세요.',
    icon: '📝',
    color: 'bg-green-500',
    hexColor: '#22c55e',
    controlInfo: '키보드 입력 / Enter: 제출',
  },
  {
    id: 'slidingpuzzle',
    title: 'Sliding Puzzle',
    description: '숫자 타일을 밀어 1~15 순서대로 맞추세요.',
    icon: '🔢',
    color: 'bg-blue-500',
    hexColor: '#3b82f6',
    controlInfo: '타일 클릭 또는 방향키',
  },
  {
    id: 'rps',
    title: 'Rock Paper Scissors',
    description: 'CPU와 가위바위보 대결. 5라운드 중 더 많이 이기면 승리.',
    icon: '✊',
    color: 'bg-pink-500',
    hexColor: '#ec4899',
    controlInfo: '가위/바위/보 버튼 클릭',
  },
  {
    id: 'reaction',
    title: 'Reaction Time',
    description: '화면이 바뀌면 최대한 빠르게 클릭하세요. 반응속도 테스트.',
    icon: '⚡',
    color: 'bg-yellow-400',
    hexColor: '#facc15',
    controlInfo: '화면 클릭',
  },
];

export function getGameById(id: string): GameMeta | undefined {
  return GAMES.find(g => g.id === id);
}
