'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createLowlight } from 'lowlight';
import pythonLang from 'highlight.js/lib/languages/python';
import { GameComponentProps } from '@/app/games/[gameId]/_components/GamePageClient';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import { useGameTimer } from '@/hooks/useGameTimer';
import ConfettiEffect from '@/components/features/games/effects/ConfettiEffect';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';
import GameOverlayController from '@/components/features/games/GameOverlayController';

// ── Python 신택스 하이라이터 ─────────────────────────────────
const _lowlight = createLowlight();
_lowlight.register('python', pythonLang);

const HLJS_COLORS: Record<string, string> = {
  'hljs-keyword':    '#c678dd',
  'hljs-built_in':   '#56b6c2',
  'hljs-string':     '#98c379',
  'hljs-number':     '#d19a66',
  'hljs-comment':    '#5c6370',
  'hljs-title':      '#61afef',
  'hljs-params':     '#abb2bf',
  'hljs-punctuation':'#6b7280',
  'hljs-operator':   '#56b6c2',
  'hljs-literal':    '#d19a66',
  'hljs-attr':       '#e06c75',
  'hljs-type':       '#e5c07b',
  'hljs-meta':       '#abb2bf',
  'hljs-decorator':  '#e06c75',
  'hljs-self':       '#e06c75',
};

function renderHastNodes(nodes: unknown[]): React.ReactNode {
  return (nodes as Array<Record<string, unknown>>).map((node, i) => {
    if (node.type === 'text') return <span key={i}>{String(node.value ?? '')}</span>;
    if (node.type === 'element') {
      const classes = (node.properties as Record<string, string[]>)?.className ?? [];
      const color   = classes.map((c: string) => HLJS_COLORS[c]).find(Boolean);
      const isComment = classes.includes('hljs-comment');
      return (
        <span
          key={i}
          style={color ? { color, fontStyle: isComment ? 'italic' : undefined } : undefined}
        >
          {renderHastNodes((node.children as unknown[]) ?? [])}
        </span>
      );
    }
    return null;
  });
}

function PythonLine({ code, dim }: { code: string; dim?: boolean }) {
  try {
    const result = _lowlight.highlight('python', code);
    return (
      <span style={{ ...(dim ? { opacity: 0.6 } : {}), whiteSpace: 'pre' }}>
        {renderHastNodes((result as unknown as { children: unknown[] }).children)}
      </span>
    );
  } catch {
    return <span style={{ ...(dim ? { opacity: 0.6 } : {}), whiteSpace: 'pre' }}>{code}</span>;
  }
}

// ── 언어 타입 & 설정 ─────────────────────────────────────
type LangId = 'typescript' | 'python' | 'rust' | 'go' | 'sql' | 'bash' | 'css' | 'java';

interface LangConfig {
  id: LangId;
  label: string;
  badge: string;
  textCls: string;
  borderCls: string;
  bgCls: string;
}

const LANGS: LangConfig[] = [
  { id: 'typescript', label: 'TypeScript', badge: 'TS', textCls: 'text-blue-400',    borderCls: 'border-blue-500',    bgCls: 'bg-blue-600'    },
  { id: 'python',     label: 'Python',     badge: 'PY', textCls: 'text-yellow-400',  borderCls: 'border-yellow-500',  bgCls: 'bg-yellow-600'  },
  { id: 'rust',       label: 'Rust',       badge: 'RS', textCls: 'text-orange-400',  borderCls: 'border-orange-500',  bgCls: 'bg-orange-600'  },
  { id: 'go',         label: 'Go',         badge: 'GO', textCls: 'text-cyan-400',    borderCls: 'border-cyan-500',    bgCls: 'bg-cyan-600'    },
  { id: 'sql',        label: 'SQL',        badge: 'SQ', textCls: 'text-emerald-400', borderCls: 'border-emerald-500', bgCls: 'bg-emerald-600' },
  { id: 'bash',       label: 'Bash',       badge: 'SH', textCls: 'text-violet-400',  borderCls: 'border-violet-500',  bgCls: 'bg-violet-600'  },
  { id: 'css',        label: 'CSS/TW',     badge: 'CW', textCls: 'text-pink-400',    borderCls: 'border-pink-500',    bgCls: 'bg-pink-600'    },
  { id: 'java',       label: 'Java',       badge: 'JV', textCls: 'text-red-400',     borderCls: 'border-red-500',     bgCls: 'bg-red-600'     },
];

// ── 카테고리 & 레벨 타입 ──────────────────────────────────
type CategoryId = 'all' | 'algorithm' | 'server' | 'data' | 'frontend' | 'devops';
type LevelId = 1 | 2 | 3 | 4 | 5;

interface CategoryConfig {
  id: CategoryId;
  label: string;
  icon: string;
  desc: string;
}

interface LevelConfig {
  id: LevelId;
  label: string;
  desc: string;
  bonusTime: number;
  perfectBonus: number;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'all',       label: '전체',       icon: '🌐', desc: '모든 스니펫' },
  { id: 'algorithm', label: '알고리즘',   icon: '🔢', desc: '자료구조 & 알고리즘' },
  { id: 'server',    label: '서버/API',   icon: '🖥', desc: 'HTTP, DB, 서버 로직' },
  { id: 'data',      label: '데이터분석', icon: '📊', desc: 'pandas, ML, SQL 분석' },
  { id: 'frontend',  label: '프론트',     icon: '🎨', desc: 'React, CSS, UI 패턴' },
  { id: 'devops',    label: 'DevOps',     icon: '⚙', desc: 'Git, Docker, Bash' },
];

// bonusTime = 기본 보너스 (오타 1회 이상)
// perfectBonus = 무오타 시 추가
// 추가로 perfectStreak에 따라 배율 적용 (handleKey 내부)
const LEVELS: LevelConfig[] = [
  { id: 1, label: 'Lv 1', desc: '기초 문법',   bonusTime: 1, perfectBonus: 2 },
  { id: 2, label: 'Lv 2', desc: '빈출 패턴',   bonusTime: 2, perfectBonus: 4 },
  { id: 3, label: 'Lv 3', desc: '함수/클래스', bonusTime: 3, perfectBonus: 6 },
  { id: 4, label: 'Lv 4', desc: '복합 패턴',   bonusTime: 4, perfectBonus: 9 },
  { id: 5, label: 'Lv 5', desc: '고급 로직',   bonusTime: 5, perfectBonus: 12 },
];

// ── 스니펫 타입 & 언어별 데이터 ──────────────────────────
interface Snippet {
  text: string;
  level: LevelId;
  category: Exclude<CategoryId, 'all'>;
  desc?: string;
}

const SNIPPETS: Record<LangId, Snippet[]> = {

  // ─────────────────────────────────────────────────────
  typescript: [
    // ── algorithm ──────────────────────────────────────
    { text: 'const n = arr.length;',                                            level: 1, category: 'algorithm' },
    { text: 'let left = 0, right = n - 1;',                                     level: 1, category: 'algorithm' },
    { text: 'nums.sort((a, b) => a - b);',                                      level: 1, category: 'algorithm' },
    { text: 'const sum = arr.reduce((a, b) => a + b, 0);',                      level: 2, category: 'algorithm' },
    { text: 'arr.filter(x => x > 0).map(x => x * 2)',                           level: 2, category: 'algorithm' },
    { text: 'const set = new Set(arr); const unique = [...set];',               level: 2, category: 'algorithm' },
    { text: 'function binarySearch(arr: number[], target: number): number {',    level: 3, category: 'algorithm' },
    { text: 'const map = new Map<string, number[]>();',                          level: 3, category: 'algorithm' },
    { text: 'Object.entries(obj).forEach(([k, v]) => { result[k] = v; });',     level: 3, category: 'algorithm' },
    { text: 'type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]>; };',  level: 4, category: 'algorithm' },
    { text: 'const dp = Array.from({ length: n+1 }, () => new Array(m+1).fill(0));', level: 4, category: 'algorithm' },
    { text: 'const memo = new Map<string, number>(); function solve(i: number): number {', level: 4, category: 'algorithm' },
    { text: 'function mergeSort<T>(arr: T[], cmp: (a:T,b:T) => number): T[] {', level: 5, category: 'algorithm' },
    { text: 'const graph = new Map<number,number[]>(); const visited = new Set<number>();', level: 5, category: 'algorithm' },

    // ── server ─────────────────────────────────────────
    { text: "throw new Error('Unauthorized');",                                  level: 1, category: 'server' },
    { text: 'const id = params.id;',                                             level: 1, category: 'server' },
    { text: 'return null;',                                                       level: 1, category: 'server' },
    { text: "const res = await fetch('/api/data');",                             level: 2, category: 'server' },
    { text: 'return NextResponse.json({ ok: true });',                           level: 2, category: 'server' },
    { text: 'export async function GET(req: Request) {',                         level: 2, category: 'server' },
    { text: 'interface User { id: number; name: string; email: string; }',       level: 3, category: 'server' },
    { text: "const db = drizzle(postgres(env.DATABASE_URL));",                   level: 3, category: 'server' },
    { text: 'const schema = z.object({ name: z.string(), age: z.number() });',  level: 3, category: 'server' },
    { text: "const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);", level: 4, category: 'server' },
    { text: 'const session = await getServerSession(authOptions);',              level: 4, category: 'server' },
    { text: "const handler = nc<NextApiRequest, NextApiResponse>().use(cors()).get(getUser);", level: 5, category: 'server' },
    { text: 'export async function POST(req: Request): Promise<NextResponse> { const body = await req.json();', level: 5, category: 'server' },

    // ── frontend ────────────────────────────────────────
    { text: 'const router = useRouter();',                                        level: 1, category: 'frontend' },
    { text: 'const ref = useRef<HTMLDivElement>(null);',                         level: 1, category: 'frontend' },
    { text: 'const [open, setOpen] = useState(false);',                          level: 1, category: 'frontend' },
    { text: "const [state, setState] = useState<string>('');",                   level: 2, category: 'frontend' },
    { text: "import { useState, useEffect } from 'react';",                      level: 2, category: 'frontend' },
    { text: 'useEffect(() => { fetchData(); }, []);',                            level: 2, category: 'frontend' },
    { text: "export const metadata: Metadata = { title: 'Home' };",             level: 3, category: 'frontend' },
    { text: "const { data, error, isLoading } = useSWR('/api/user', fetcher);", level: 3, category: 'frontend' },
    { text: "<Link href='/about' className='text-indigo-400 hover:underline'>",  level: 3, category: 'frontend' },
    { text: 'const { register, handleSubmit, formState: { errors } } = useForm<FormData>();', level: 4, category: 'frontend' },
    { text: 'useEffect(() => { const id = setTimeout(() => setShow(true), 300); return () => clearTimeout(id); }, []);', level: 4, category: 'frontend' },
    { text: "return <div className='flex flex-col items-center justify-between min-h-screen bg-[#08080b]'>", level: 5, category: 'frontend' },
    { text: "export default function Page({ params }: { params: { id: string } }) {", level: 5, category: 'frontend' },
  ],

  // ─────────────────────────────────────────────────────
  python: [
    // ── algorithm Lv1 — 기초 문법 / 단순 반복 ─────────────
    { text: 'for i in range(n):',                   desc: '0부터 n-1까지 정수를 순회하는 기본 반복문',                          level: 1, category: 'algorithm' },
    { text: 'n = len(arr)',                          desc: '배열의 길이를 변수 n에 저장',                                       level: 1, category: 'algorithm' },
    { text: 'left, right = 0, len(arr) - 1',        desc: '투 포인터 초기화: 배열 양 끝 인덱스',                              level: 1, category: 'algorithm' },
    { text: 'total = sum(nums)',                     desc: '리스트 전체 합계를 내장 함수로 계산',                              level: 1, category: 'algorithm' },
    { text: 'mx = max(arr)',                         desc: '리스트에서 최댓값 추출',                                           level: 1, category: 'algorithm' },
    { text: 'arr.append(x)',                         desc: '리스트 끝에 원소 x를 추가',                                       level: 1, category: 'algorithm' },
    { text: 'count = 0',                             desc: '카운터 변수 초기화',                                               level: 1, category: 'algorithm' },
    { text: 'a, b = b, a',                           desc: '임시 변수 없이 두 변수 값을 교환 (swap)',                          level: 1, category: 'algorithm' },
    { text: 'if x in seen:',                         desc: '집합/딕셔너리에 원소 존재 여부를 O(1)로 확인',                    level: 1, category: 'algorithm' },

    // ── algorithm Lv2 — 자료구조 / 컴프리헨션 ────────────
    { text: 'return [x for x in data if x > 0]',            desc: '조건을 만족하는 원소만 골라 새 리스트 생성 (필터 컴프리헨션)', level: 2, category: 'algorithm' },
    { text: 'result = list(map(lambda x: x * 2, items))',    desc: '모든 원소에 함수를 적용해 변환 (map)',                        level: 2, category: 'algorithm' },
    { text: 'sorted(items, key=lambda x: x.name)',           desc: '객체의 특정 속성을 기준으로 정렬',                            level: 2, category: 'algorithm' },
    { text: 'freq = {x: nums.count(x) for x in set(nums)}', desc: '각 원소의 등장 빈도를 딕셔너리로 집계',                       level: 2, category: 'algorithm' },
    { text: 'pairs = list(zip(keys, values))',               desc: '두 리스트를 같은 인덱스끼리 묶어 튜플 쌍으로 변환',           level: 2, category: 'algorithm' },
    { text: 'reversed_arr = arr[::-1]',                      desc: '슬라이싱으로 리스트 역순 복사',                              level: 2, category: 'algorithm' },
    { text: 'first, *rest = arr',                            desc: '첫 원소와 나머지를 언패킹으로 분리',                          level: 2, category: 'algorithm' },
    { text: 'matrix = [[0] * cols for _ in range(rows)]',   desc: '2차원 배열(행렬) 0으로 초기화',                              level: 2, category: 'algorithm' },

    // ── algorithm Lv3 — 함수 정의 / 표준 라이브러리 ───────
    { text: 'def binary_search(arr: list, target: int) -> int:',         desc: '이진 탐색 함수 선언 — 정렬 배열에서 O(log n) 탐색',  level: 3, category: 'algorithm' },
    { text: 'from heapq import heappush, heappop',                       desc: '우선순위 큐(최소 힙) 연산 임포트',                   level: 3, category: 'algorithm' },
    { text: 'from collections import defaultdict, deque',                desc: 'BFS용 deque, 그래프용 defaultdict 임포트',            level: 3, category: 'algorithm' },
    { text: 'q = deque(); q.append((start, 0))',                         desc: 'BFS 큐 초기화 — 시작 노드와 거리 0 삽입',             level: 3, category: 'algorithm' },
    { text: 'graph = defaultdict(list)',                                  desc: '인접 리스트 그래프 초기화 (없는 키도 자동으로 빈 리스트)', level: 3, category: 'algorithm' },
    { text: 'cnt = Counter(words).most_common(3)',                       desc: '단어 빈도 집계 후 상위 3개 추출',                    level: 3, category: 'algorithm' },
    { text: 'def two_sum(nums: list[int], target: int) -> list[int]:',   desc: 'Two Sum 함수 선언 — 합이 target인 두 인덱스 반환',    level: 3, category: 'algorithm' },
    { text: 'mid = (left + right) // 2',                                 desc: '이진 탐색 중앙 인덱스 계산 (정수 나눗셈으로 오버플로 방지)', level: 3, category: 'algorithm' },

    // ── algorithm Lv4 — DP / BFS / DFS / 그리디 ──────────
    { text: 'def dfs(node: int, visited: set, graph: dict) -> None:',              desc: '재귀 DFS 함수 선언 — 방문 집합으로 중복 방문 방지',            level: 4, category: 'algorithm' },
    { text: 'dp = [[0] * (m + 1) for _ in range(n + 1)]',                         desc: '2D DP 테이블 초기화 — (n+1) x (m+1) 크기의 0 행렬',           level: 4, category: 'algorithm' },
    { text: '@functools.lru_cache(maxsize=None)',                                   desc: '재귀 함수 결과를 캐싱해 중복 계산 제거 (메모이제이션)',          level: 4, category: 'algorithm' },
    { text: 'dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + grid[i][j]',               desc: 'Grid DP 점화식 — 위·왼쪽 경로 중 최댓값 + 현재 칸',            level: 4, category: 'algorithm' },
    { text: 'parent = [i for i in range(n)]',                                      desc: 'Union-Find 초기화 — 각 노드가 자기 자신을 부모로 지정',         level: 4, category: 'algorithm' },
    { text: 'def find(x: int) -> int: return x if parent[x] == x else find(parent[x])', desc: 'Union-Find find 연산 — 경로 압축(path compression)',     level: 4, category: 'algorithm' },
    { text: 'heapq.heapify(arr); smallest = heapq.heappop(arr)',                   desc: '리스트를 최소 힙으로 변환 후 최솟값 추출',                     level: 4, category: 'algorithm' },
    { text: 'def coin_change(coins: list[int], amount: int) -> int:',              desc: '동전 교환 문제 함수 선언 — 최소 동전 개수 반환',               level: 4, category: 'algorithm' },
    { text: 'left, right = 0, n - 1; while left < right:',                         desc: '투 포인터 루프 시작 — 양 끝에서 좁혀가며 조건 탐색',           level: 4, category: 'algorithm' },

    // ── algorithm Lv5 — 고급 알고리즘 / LeetCode HARD ────
    { text: 'def merge_sort(arr: list[int]) -> list[int]: if len(arr) <= 1: return arr', desc: '병합 정렬 — 기저 조건: 크기 1 이하면 그대로 반환',              level: 5, category: 'algorithm' },
    { text: 'class Solution: def twoSum(self, nums: list[int], target: int) -> list[int]:', desc: 'LeetCode 스타일 Solution 클래스와 twoSum 메서드 선언',  level: 5, category: 'algorithm' },
    { text: 'class TrieNode: def __init__(self): self.children = {}; self.is_end = False', desc: 'Trie 노드 클래스 — 자식 노드 딕셔너리 + 단어 끝 표시',     level: 5, category: 'algorithm' },
    { text: 'def dijkstra(graph: dict, start: int) -> dict: dist = {n: float("inf") for n in graph}', desc: 'Dijkstra — 모든 노드 거리를 무한대로 초기화', level: 5, category: 'algorithm' },
    { text: 'def topological_sort(graph: dict[int, list[int]]) -> list[int]:',     desc: '위상 정렬 함수 선언 — DAG에서 선행 관계를 만족하는 순서 반환',  level: 5, category: 'algorithm' },
    { text: 'def kmp_search(text: str, pattern: str) -> list[int]:',               desc: 'KMP 문자열 탐색 함수 — 실패 함수로 O(n+m) 복잡도',             level: 5, category: 'algorithm' },
    { text: 'def longest_increasing_subsequence(nums: list[int]) -> int: tails = []', desc: 'LIS — tails 배열에 이진 탐색으로 O(n log n) 구현',           level: 5, category: 'algorithm' },
    { text: 'def n_queens(n: int) -> list[list[str]]: cols, diag1, diag2 = set(), set(), set()', desc: 'N-Queens 백트래킹 — 열·대각선 충돌 집합으로 가지치기', level: 5, category: 'algorithm' },

    // ── data ───────────────────────────────────────────
    { text: 'import numpy as np',                                               level: 1, category: 'data' },
    { text: 'import pandas as pd',                                              level: 1, category: 'data' },
    { text: 'df.head()',                                                         level: 1, category: 'data' },
    { text: "df = pd.read_csv('data.csv')",                                     level: 2, category: 'data' },
    { text: "df.groupby('category').mean()",                                    level: 2, category: 'data' },
    { text: 'X_scaled = StandardScaler().fit_transform(X)',                     level: 2, category: 'data' },
    { text: 'model.fit(X_train, y_train, epochs=10, batch_size=32)',            level: 3, category: 'data' },
    { text: "df.pivot_table(values='sales', index='region', columns='month')", level: 3, category: 'data' },
    { text: 'X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)', level: 3, category: 'data' },
    { text: "from sklearn.pipeline import Pipeline; pipe = Pipeline([('scaler', StandardScaler()), ('clf', SVC())])", level: 4, category: 'data' },
    { text: "df.groupby('user_id').agg({'amount': 'sum', 'orders': 'count'}).reset_index()", level: 4, category: 'data' },
    { text: 'from transformers import AutoTokenizer, AutoModelForSequenceClassification', level: 5, category: 'data' },
    { text: "plt.figure(figsize=(10, 6)); sns.heatmap(df.corr(), annot=True, cmap='coolwarm')", level: 5, category: 'data' },

    // ── server ─────────────────────────────────────────
    { text: "return jsonify({'ok': True})",                                      level: 1, category: 'server' },
    { text: 'try:',                                                              level: 1, category: 'server' },
    { text: "if __name__ == '__main__':",                                        level: 1, category: 'server' },
    { text: "async def fetch(url: str) -> dict:",                               level: 2, category: 'server' },
    { text: 'session.query(User).filter_by(id=1).first()',                      level: 2, category: 'server' },
    { text: 'logging.basicConfig(level=logging.INFO)',                          level: 2, category: 'server' },
    { text: "@router.get('/users/{user_id}', response_model=UserSchema)",       level: 3, category: 'server' },
    { text: 'async with aiohttp.ClientSession() as session:',                   level: 3, category: 'server' },
    { text: 'class UserSerializer(serializers.ModelSerializer):',               level: 3, category: 'server' },
    { text: "@app.middleware('http') async def add_cors(request: Request, call_next):", level: 4, category: 'server' },
    { text: "celery_app = Celery('tasks', broker=os.getenv('REDIS_URL'))",      level: 4, category: 'server' },
    { text: "@router.post('/users', response_model=UserResponse, status_code=201) async def create_user(body: UserCreate, db: AsyncSession = Depends(get_db)):", level: 5, category: 'server' },
  ],

  // ─────────────────────────────────────────────────────
  rust: [
    // ── algorithm ──────────────────────────────────────
    { text: 'fn main() {',                                                       level: 1, category: 'algorithm' },
    { text: 'let mut vec: Vec<i32> = Vec::new();',                              level: 1, category: 'algorithm' },
    { text: 'let n = arr.len();',                                               level: 1, category: 'algorithm' },
    { text: 'vec.iter().filter(|&&x| x > 0).collect::<Vec<_>>()',              level: 2, category: 'algorithm' },
    { text: 'let mut left = 0; let mut right = arr.len() - 1;',                level: 2, category: 'algorithm' },
    { text: 'use std::collections::{HashMap, HashSet};',                        level: 2, category: 'algorithm' },
    { text: 'fn binary_search(arr: &[i32], target: i32) -> Option<usize> {',   level: 3, category: 'algorithm' },
    { text: '#[derive(Debug, Clone, PartialEq, Eq, Hash)]',                    level: 3, category: 'algorithm' },
    { text: 'impl<T: Clone> Stack<T> { pub fn push(&mut self, val: T) {',      level: 3, category: 'algorithm' },
    { text: 'type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;', level: 4, category: 'algorithm' },
    { text: 'Arc::new(Mutex::new(HashMap::new()))',                             level: 4, category: 'algorithm' },
    { text: 'impl<T: Clone + Send + Sync> Repository<T> {',                    level: 4, category: 'algorithm' },
    { text: 'fn merge_sort<T: Ord + Clone>(arr: &[T]) -> Vec<T> { if arr.len() <= 1 { return arr.to_vec(); }', level: 5, category: 'algorithm' },

    // ── server ─────────────────────────────────────────
    { text: 'use axum::Router;',                                                level: 1, category: 'server' },
    { text: '#[derive(Debug, Serialize, Deserialize)]',                         level: 1, category: 'server' },
    { text: "let config = Config::new();",                                      level: 1, category: 'server' },
    { text: 'let config = serde_json::from_str(&raw)?;',                       level: 2, category: 'server' },
    { text: 'pub async fn handler(State(db): State<Db>) {',                    level: 2, category: 'server' },
    { text: "Router::new().route('/users', get(list).post(create))",            level: 2, category: 'server' },
    { text: 'impl Display for AppError { fn fmt(&self, f: &mut Formatter) -> fmt::Result {', level: 3, category: 'server' },
    { text: "tokio::spawn(async move { task().await.expect('task failed'); });", level: 3, category: 'server' },
    { text: '#[tokio::main] async fn main() -> Result<(), Box<dyn std::error::Error>> {', level: 4, category: 'server' },
    { text: 'impl From<sqlx::Error> for AppError { fn from(e: sqlx::Error) -> Self {', level: 4, category: 'server' },
    { text: 'pub async fn create_user(State(pool): State<PgPool>, Json(body): Json<CreateUserDto>) -> Result<Json<User>, AppError> {', level: 5, category: 'server' },
  ],

  // ─────────────────────────────────────────────────────
  go: [
    // ── algorithm ──────────────────────────────────────
    { text: 'func main() {',                                                     level: 1, category: 'algorithm' },
    { text: 'n := len(arr)',                                                      level: 1, category: 'algorithm' },
    { text: 'left, right := 0, len(arr)-1',                                      level: 1, category: 'algorithm' },
    { text: 'if err != nil { return err }',                                       level: 2, category: 'algorithm' },
    { text: 'for i, v := range arr {',                                            level: 2, category: 'algorithm' },
    { text: 'make(map[string]int)',                                               level: 2, category: 'algorithm' },
    { text: 'func binarySearch(arr []int, target int) int {',                     level: 3, category: 'algorithm' },
    { text: 'type Stack[T any] struct { items []T }',                             level: 3, category: 'algorithm' },
    { text: 'var wg sync.WaitGroup',                                              level: 3, category: 'algorithm' },
    { text: 'go func() { defer wg.Done(); result <- compute(data) }()',          level: 4, category: 'algorithm' },
    { text: 'atomic.AddInt64(&counter, 1)',                                        level: 4, category: 'algorithm' },
    { text: 'ctx, cancel := context.WithTimeout(ctx, 5*time.Second)',             level: 4, category: 'algorithm' },
    { text: 'func mergeSort(arr []int) []int { n := len(arr); if n <= 1 { return arr }', level: 5, category: 'algorithm' },

    // ── server ─────────────────────────────────────────
    { text: "http.HandleFunc('/', handler)",                                      level: 1, category: 'server' },
    { text: 'defer rows.Close()',                                                  level: 1, category: 'server' },
    { text: "fmt.Println('Server started on :8080')",                             level: 1, category: 'server' },
    { text: "rows, err := db.Query('SELECT * FROM users')",                       level: 2, category: 'server' },
    { text: 'json.NewEncoder(w).Encode(response)',                                level: 2, category: 'server' },
    { text: "log.Fatal(http.ListenAndServe(':8080', nil))",                       level: 2, category: 'server' },
    { text: "http.HandleFunc('/api/users', func(w http.ResponseWriter, r *http.Request) {", level: 3, category: 'server' },
    { text: 'type User struct { ID int `json:"id"`; Name string `json:"name"` }', level: 3, category: 'server' },
    { text: "db, err := sql.Open('postgres', os.Getenv('DATABASE_URL'))",         level: 3, category: 'server' },
    { text: 'r := chi.NewRouter(); r.Use(middleware.Logger, middleware.Recoverer)', level: 4, category: 'server' },
    { text: 'ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second); defer cancel()', level: 4, category: 'server' },
    { text: 'func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) { var body CreateUserRequest; json.NewDecoder(r.Body).Decode(&body)', level: 5, category: 'server' },
  ],

  // ─────────────────────────────────────────────────────
  sql: [
    // ── data ───────────────────────────────────────────
    { text: 'COUNT(*)',                                                           level: 1, category: 'data' },
    { text: 'GROUP BY category',                                                  level: 1, category: 'data' },
    { text: 'ORDER BY created_at DESC',                                           level: 1, category: 'data' },
    { text: 'SELECT id, name FROM users ORDER BY name ASC;',                      level: 2, category: 'data' },
    { text: "SELECT COUNT(*) FROM orders WHERE status = 'pending';",              level: 2, category: 'data' },
    { text: 'SELECT DISTINCT category FROM products ORDER BY 1;',                 level: 2, category: 'data' },
    { text: 'SELECT user_id, SUM(amount) FROM payments GROUP BY user_id;',        level: 3, category: 'data' },
    { text: "SELECT * FROM logs WHERE created_at > NOW() - INTERVAL '7 days';",   level: 3, category: 'data' },
    { text: 'WITH cte AS (SELECT * FROM orders WHERE total > 100)',               level: 3, category: 'data' },
    { text: 'SELECT u.*, SUM(o.total) FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id;', level: 4, category: 'data' },
    { text: "SELECT user_id, AVG(amount) OVER (PARTITION BY category ORDER BY created_at) FROM sales;", level: 4, category: 'data' },
    { text: "WITH monthly AS (SELECT DATE_TRUNC('month', created_at) AS m, SUM(amount) AS total FROM orders GROUP BY 1) SELECT *, total - LAG(total) OVER (ORDER BY m) AS diff FROM monthly;", level: 5, category: 'data' },

    // ── server ─────────────────────────────────────────
    { text: 'SELECT * FROM users WHERE active = true;',                           level: 1, category: 'server' },
    { text: 'BEGIN;',                                                              level: 1, category: 'server' },
    { text: 'COMMIT;',                                                             level: 1, category: 'server' },
    { text: 'INSERT INTO users (name, email) VALUES (?, ?);',                     level: 2, category: 'server' },
    { text: 'UPDATE users SET name = ? WHERE id = ?;',                            level: 2, category: 'server' },
    { text: 'DELETE FROM sessions WHERE expires_at < NOW();',                      level: 2, category: 'server' },
    { text: 'CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE);', level: 3, category: 'server' },
    { text: 'ALTER TABLE users ADD COLUMN avatar_url TEXT;',                       level: 3, category: 'server' },
    { text: 'CREATE INDEX idx_users_email ON users(email);',                       level: 3, category: 'server' },
    { text: 'EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;',            level: 4, category: 'server' },
    { text: 'GRANT SELECT ON ALL TABLES IN SCHEMA public TO reader;',              level: 4, category: 'server' },
    { text: 'CREATE MATERIALIZED VIEW user_stats AS SELECT u.id, COUNT(o.id) as orders, SUM(o.total) as spent FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id;', level: 5, category: 'server' },
  ],

  // ─────────────────────────────────────────────────────
  bash: [
    // ── devops ─────────────────────────────────────────
    { text: 'git status',                                                         level: 1, category: 'devops' },
    { text: 'docker ps',                                                           level: 1, category: 'devops' },
    { text: 'ls -la',                                                              level: 1, category: 'devops' },
    { text: "git commit -m 'feat: add user auth'",                                level: 2, category: 'devops' },
    { text: 'docker compose up -d --build',                                        level: 2, category: 'devops' },
    { text: 'npm install && npm run build',                                        level: 2, category: 'devops' },
    { text: 'git rebase -i HEAD~3',                                                level: 3, category: 'devops' },
    { text: 'kubectl get pods -n production --watch',                              level: 3, category: 'devops' },
    { text: 'rsync -avz --delete src/ user@host:~/dest/',                         level: 3, category: 'devops' },
    { text: 'for f in *.json; do echo "$f:"; jq . "$f"; done',                   level: 4, category: 'devops' },
    { text: "find . -name '*.log' -mtime +7 -delete",                             level: 4, category: 'devops' },
    { text: "kubectl rollout history deployment/app -n production && kubectl rollout undo deployment/app", level: 5, category: 'devops' },
    { text: "while IFS= read -r line; do echo \"Processing: $line\"; done < input.txt", level: 5, category: 'devops' },

    // ── server ─────────────────────────────────────────
    { text: 'ssh user@server.com',                                                level: 1, category: 'server' },
    { text: 'curl https://api.example.com',                                        level: 1, category: 'server' },
    { text: 'export PORT=3000',                                                    level: 1, category: 'server' },
    { text: 'ssh -i ~/.ssh/id_rsa user@server.com',                               level: 2, category: 'server' },
    { text: 'curl -s https://api.example.com/health | jq .',                      level: 2, category: 'server' },
    { text: "export DATABASE_URL='postgres://localhost/db'",                       level: 2, category: 'server' },
    { text: "grep -r 'TODO' src/ --include='*.ts'",                               level: 3, category: 'server' },
    { text: 'tar -czf backup.tar.gz /var/www/html',                               level: 3, category: 'server' },
    { text: 'chmod +x ./deploy.sh && ./deploy.sh',                                level: 3, category: 'server' },
    { text: 'openssl genrsa -out key.pem 4096',                                   level: 4, category: 'server' },
    { text: 'ps aux | sort -rk 3 | head -10',                                     level: 4, category: 'server' },
    { text: "if [ \"$ENV\" = 'production' ]; then kubectl apply -f k8s/ && kubectl rollout status deployment/app; fi", level: 5, category: 'server' },
  ],

  // ─────────────────────────────────────────────────────
  css: [
    // ── frontend ────────────────────────────────────────
    { text: 'display: flex;',                                                     level: 1, category: 'frontend' },
    { text: '.container {',                                                        level: 1, category: 'frontend' },
    { text: 'color: #fff;',                                                        level: 1, category: 'frontend' },
    { text: "className='flex items-center gap-4'",                                level: 2, category: 'frontend' },
    { text: "className='rounded-xl border border-zinc-700'",                      level: 2, category: 'frontend' },
    { text: "className='text-sm font-medium text-zinc-400'",                      level: 2, category: 'frontend' },
    { text: "className='flex items-center justify-between px-4 py-2'",           level: 3, category: 'frontend' },
    { text: '@apply flex items-center gap-2 rounded-lg;',                         level: 3, category: 'frontend' },
    { text: 'grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));',      level: 3, category: 'frontend' },
    { text: "className='absolute inset-0 flex items-center justify-center bg-black/50'", level: 4, category: 'frontend' },
    { text: 'animation: fadeIn 0.3s ease forwards; transform: translateY(-4px);', level: 4, category: 'frontend' },
    { text: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',    level: 4, category: 'frontend' },
    { text: "@container (min-width: 400px) { .card { display: grid; grid-template-columns: 1fr 2fr; } }", level: 5, category: 'frontend' },
    { text: "className='group relative overflow-hidden rounded-2xl border border-white/8 bg-[#0f0f12] p-6'", level: 5, category: 'frontend' },
  ],

  // ─────────────────────────────────────────────────────
  java: [
    // ── algorithm ──────────────────────────────────────
    { text: 'int n = arr.length;',                                               level: 1, category: 'algorithm' },
    { text: 'for (int i = 0; i < n; i++) {',                                    level: 1, category: 'algorithm' },
    { text: 'Arrays.sort(arr);',                                                 level: 1, category: 'algorithm' },
    { text: 'List<String> list = new ArrayList<>();',                             level: 2, category: 'algorithm' },
    { text: 'Map<String, Integer> map = new HashMap<>();',                        level: 2, category: 'algorithm' },
    { text: 'int left = 0, right = arr.length - 1;',                             level: 2, category: 'algorithm' },
    { text: 'public int binarySearch(int[] arr, int target) {',                  level: 3, category: 'algorithm' },
    { text: 'public interface Repository<T, ID> { Optional<T> findById(ID id); }', level: 3, category: 'algorithm' },
    { text: 'record Point(int x, int y) {}',                                     level: 3, category: 'algorithm' },
    { text: "String result = items.stream().filter(s -> s.length() > 3).collect(Collectors.joining(', '));", level: 4, category: 'algorithm' },
    { text: 'CompletableFuture.supplyAsync(() -> compute()).thenApply(result -> transform(result));', level: 4, category: 'algorithm' },
    { text: 'sealed interface Shape permits Circle, Rectangle, Triangle { double area(); }', level: 5, category: 'algorithm' },
    { text: 'public <T extends Comparable<T>> T findMax(List<T> list) { return list.stream().max(Comparator.naturalOrder()).orElseThrow(); }', level: 5, category: 'algorithm' },

    // ── server ─────────────────────────────────────────
    { text: 'return ResponseEntity.ok().build();',                               level: 1, category: 'server' },
    { text: '@Component',                                                         level: 1, category: 'server' },
    { text: '@Autowired',                                                         level: 1, category: 'server' },
    { text: 'Optional<User> user = userRepo.findById(id);',                      level: 2, category: 'server' },
    { text: 'private final UserRepository userRepo;',                             level: 2, category: 'server' },
    { text: '@Override public String toString() {',                               level: 2, category: 'server' },
    { text: '@GetMapping("/api/users") public List<User> getAll() {',            level: 3, category: 'server' },
    { text: '@SpringBootApplication public class App {',                          level: 3, category: 'server' },
    { text: 'EntityManager em = emf.createEntityManager();',                      level: 3, category: 'server' },
    { text: '@PostMapping("/users") public ResponseEntity<User> create(@RequestBody @Valid CreateUserDto dto) {', level: 4, category: 'server' },
    { text: 'ExecutorService pool = Executors.newFixedThreadPool(4);',            level: 4, category: 'server' },
    { text: '@ControllerAdvice public class GlobalExceptionHandler { @ExceptionHandler(UserNotFoundException.class) public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {', level: 5, category: 'server' },
  ],
};

// ── 유틸 ─────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── 긴 글 연습 모드 알고리즘 데이터 ──────────────────────
interface AlgoLine { text: string; desc: string; }
interface LongAlgorithm { id: string; title: string; overview: string; lines: AlgoLine[]; }

const LONG_ALGORITHMS: LongAlgorithm[] = [
  {
    id: 'binary_search',
    title: '이진 탐색 (Binary Search)',
    overview: '정렬된 배열에서 목표값을 O(log n)에 찾는 분할 정복 탐색',
    lines: [
      { text: 'def binary_search(arr: list[int], target: int) -> int:', desc: '정렬된 배열과 목표값을 인자로 받는 함수 선언' },
      { text: '    left, right = 0, len(arr) - 1',                      desc: '탐색 범위 초기화 — 배열 처음 인덱스와 끝 인덱스' },
      { text: '    while left <= right:',                               desc: '탐색 범위가 유효한(교차 전) 동안 반복' },
      { text: '        mid = (left + right) // 2',                     desc: '중앙 인덱스 계산 (정수 나눗셈으로 오버플로우 방지)' },
      { text: '        if arr[mid] == target:',                         desc: '중앙값이 목표값과 일치하면 탐색 성공' },
      { text: '            return mid',                                  desc: '해당 인덱스를 바로 반환' },
      { text: '        elif arr[mid] < target:',                        desc: '중앙값이 목표보다 작으면 오른쪽 절반 탐색' },
      { text: '            left = mid + 1',                             desc: '왼쪽 포인터를 중앙 오른쪽으로 이동' },
      { text: '        else:',                                           desc: '중앙값이 목표보다 크면 왼쪽 절반 탐색' },
      { text: '            right = mid - 1',                            desc: '오른쪽 포인터를 중앙 왼쪽으로 이동' },
      { text: '    return -1',                                           desc: '탐색 실패 — 값이 배열에 없음' },
    ],
  },
  {
    id: 'two_sum',
    title: 'Two Sum (해시맵)',
    overview: '합이 target인 두 인덱스를 해시맵으로 O(n)에 탐색',
    lines: [
      { text: 'def two_sum(nums: list[int], target: int) -> list[int]:',  desc: '배열과 목표합을 받아 두 인덱스 리스트 반환' },
      { text: '    seen: dict[int, int] = {}',                            desc: '값 → 인덱스 해시맵 초기화' },
      { text: '    for i, num in enumerate(nums):',                       desc: '인덱스와 값을 동시에 순회' },
      { text: '        complement = target - num',                        desc: '현재 값과 짝이 되는 보수 계산' },
      { text: '        if complement in seen:',                           desc: '보수가 이미 지나간 값에 있으면 정답 발견' },
      { text: '            return [seen[complement], i]',                 desc: '보수의 인덱스와 현재 인덱스 반환' },
      { text: '        seen[num] = i',                                    desc: '현재 값을 해시맵에 기록 (다음 탐색 대비)' },
      { text: '    return []',                                             desc: '해가 없을 경우 빈 리스트 반환' },
    ],
  },
  {
    id: 'bfs',
    title: 'BFS (너비 우선 탐색)',
    overview: '큐를 이용해 그래프를 레벨 단위로 탐색 — 최단 거리 문제에 활용',
    lines: [
      { text: 'from collections import deque',                              desc: 'O(1) popleft를 위해 deque 임포트' },
      { text: 'def bfs(graph: dict, start: int) -> list[int]:',             desc: '인접 리스트 그래프와 시작 노드를 인자로 받음' },
      { text: '    visited: set[int] = {start}',                            desc: '방문 집합 초기화 — 시작 노드 포함' },
      { text: '    queue: deque[int] = deque([start])',                     desc: 'BFS 큐에 시작 노드 삽입' },
      { text: '    result: list[int] = []',                                  desc: '탐색 순서를 기록할 결과 리스트' },
      { text: '    while queue:',                                            desc: '큐가 빌 때까지 반복' },
      { text: '        node = queue.popleft()',                             desc: '큐 앞에서 노드를 꺼냄 (FIFO)' },
      { text: '        result.append(node)',                                 desc: '현재 노드를 방문 결과에 추가' },
      { text: '        for neighbor in graph[node]:',                       desc: '현재 노드의 모든 인접 노드 순회' },
      { text: '            if neighbor not in visited:',                    desc: '아직 방문하지 않은 노드만 처리' },
      { text: '                visited.add(neighbor)',                      desc: '방문 집합에 추가해 중복 방문 방지' },
      { text: '                queue.append(neighbor)',                     desc: '큐에 삽입해 나중에 탐색' },
      { text: '    return result',                                           desc: 'BFS 탐색 순서 반환' },
    ],
  },
  {
    id: 'dfs',
    title: 'DFS (깊이 우선 탐색)',
    overview: '재귀로 그래프를 한 방향으로 끝까지 파고드는 탐색',
    lines: [
      { text: 'def dfs(graph: dict, node: int, visited: set) -> list[int]:', desc: '그래프, 현재 노드, 방문 집합을 인자로 받음' },
      { text: '    visited.add(node)',                                        desc: '현재 노드를 방문 처리' },
      { text: '    result = [node]',                                          desc: '현재 노드를 결과에 추가' },
      { text: '    for neighbor in graph[node]:',                            desc: '인접 노드 순회' },
      { text: '        if neighbor not in visited:',                         desc: '미방문 노드만 재귀 탐색' },
      { text: '            result += dfs(graph, neighbor, visited)',         desc: '재귀 호출로 깊이 우선 탐색 계속' },
      { text: '    return result',                                            desc: '현재 노드부터의 DFS 결과 반환' },
    ],
  },
  {
    id: 'merge_sort',
    title: '병합 정렬 (Merge Sort)',
    overview: '분할 정복으로 O(n log n) 안정 정렬 구현',
    lines: [
      { text: 'def merge_sort(arr: list[int]) -> list[int]:',          desc: '병합 정렬 메인 함수 — 정렬된 배열 반환' },
      { text: '    if len(arr) <= 1:',                                   desc: '기저 조건 — 원소가 1개 이하면 이미 정렬됨' },
      { text: '        return arr',                                       desc: '그대로 반환 (재귀 종료)' },
      { text: '    mid = len(arr) // 2',                                 desc: '배열을 절반으로 나누는 중앙 인덱스' },
      { text: '    left = merge_sort(arr[:mid])',                        desc: '왼쪽 절반을 재귀적으로 정렬' },
      { text: '    right = merge_sort(arr[mid:])',                       desc: '오른쪽 절반을 재귀적으로 정렬' },
      { text: '    return _merge(left, right)',                          desc: '정렬된 두 배열을 합쳐서 반환' },
      { text: 'def _merge(left: list[int], right: list[int]) -> list[int]:', desc: '정렬된 두 리스트를 합치는 보조 함수' },
      { text: '    result, i, j = [], 0, 0',                            desc: '결과 리스트와 두 포인터 초기화' },
      { text: '    while i < len(left) and j < len(right):',            desc: '두 배열 모두 남은 원소가 있는 동안 비교' },
      { text: '        if left[i] <= right[j]:',                        desc: '왼쪽 원소가 작거나 같으면 먼저 추가 (안정 정렬)' },
      { text: '            result.append(left[i]); i += 1',             desc: '왼쪽 원소 추가 후 포인터 이동' },
      { text: '        else:',                                           desc: '오른쪽 원소가 더 작으면' },
      { text: '            result.append(right[j]); j += 1',            desc: '오른쪽 원소 추가 후 포인터 이동' },
      { text: '    return result + left[i:] + right[j:]',               desc: '남은 원소를 그대로 이어붙여 반환' },
    ],
  },
  {
    id: 'dijkstra',
    title: 'Dijkstra 최단 경로',
    overview: '우선순위 큐(최소 힙)로 단일 출발 최단 거리를 O((V+E) log V)에 계산',
    lines: [
      { text: 'import heapq',                                                       desc: '최소 힙 우선순위 큐 모듈 임포트' },
      { text: 'def dijkstra(graph: dict, start: int) -> dict:',                    desc: '인접 리스트 그래프와 시작 노드 인자로 받음' },
      { text: '    dist = {node: float("inf") for node in graph}',                 desc: '모든 노드 거리를 무한대로 초기화' },
      { text: '    dist[start] = 0',                                                desc: '출발 노드 거리는 0' },
      { text: '    heap = [(0, start)]',                                            desc: '(거리, 노드) 튜플로 힙 초기화' },
      { text: '    while heap:',                                                    desc: '처리할 노드가 남아 있는 동안 반복' },
      { text: '        cost, node = heapq.heappop(heap)',                          desc: '현재 가장 가까운 노드를 힙에서 추출' },
      { text: '        if cost > dist[node]:',                                     desc: '이미 더 짧은 경로로 처리된 노드면 스킵' },
      { text: '            continue',                                               desc: '중복 처리 방지 — 불필요한 탐색 제거' },
      { text: '        for neighbor, weight in graph[node]:',                      desc: '현재 노드의 모든 이웃과 간선 가중치 순회' },
      { text: '            new_cost = dist[node] + weight',                        desc: '현재 노드를 경유한 이웃까지의 새 거리' },
      { text: '            if new_cost < dist[neighbor]:',                         desc: '더 짧은 경로를 발견했을 때만 갱신' },
      { text: '                dist[neighbor] = new_cost',                         desc: '최단 거리 테이블 갱신' },
      { text: '                heapq.heappush(heap, (new_cost, neighbor))',        desc: '갱신된 노드를 힙에 삽입해 재탐색' },
      { text: '    return dist',                                                    desc: '모든 노드까지의 최단 거리 딕셔너리 반환' },
    ],
  },
  {
    id: 'union_find',
    title: 'Union-Find (서로소 집합)',
    overview: '경로 압축 + 랭크 합집합으로 O(α(n)) 연결성 판별',
    lines: [
      { text: 'class UnionFind:',                                              desc: 'Union-Find 자료구조 클래스 선언' },
      { text: '    def __init__(self, n: int):',                              desc: 'n개의 노드로 초기화' },
      { text: '        self.parent = list(range(n))',                         desc: '각 노드의 부모를 자기 자신으로 초기화' },
      { text: '        self.rank = [0] * n',                                  desc: '랭크(트리 높이 근사치) 배열 초기화' },
      { text: '    def find(self, x: int) -> int:',                           desc: 'x의 루트 노드를 찾는 함수' },
      { text: '        if self.parent[x] != x:',                             desc: '루트가 아니면 (부모가 자기 자신이 아니면)' },
      { text: '            self.parent[x] = self.find(self.parent[x])',       desc: '경로 압축: 루트를 바로 부모로 연결' },
      { text: '        return self.parent[x]',                                desc: '루트 노드 반환' },
      { text: '    def union(self, x: int, y: int) -> bool:',                 desc: 'x, y가 속한 집합을 합치는 함수' },
      { text: '        px, py = self.find(x), self.find(y)',                  desc: '각각의 루트 노드 확인' },
      { text: '        if px == py: return False',                            desc: '이미 같은 집합이면 합치지 않음' },
      { text: '        if self.rank[px] < self.rank[py]: px, py = py, px',   desc: '랭크가 높은 쪽이 루트가 되도록 교환' },
      { text: '        self.parent[py] = px',                                 desc: '랭크가 낮은 트리를 높은 트리 아래로 합침' },
      { text: '        if self.rank[px] == self.rank[py]: self.rank[px] += 1', desc: '랭크가 같을 때만 루트 랭크 증가' },
      { text: '        return True',                                           desc: '집합 합치기 성공 반환' },
    ],
  },
  {
    id: 'coin_change',
    title: '동전 교환 DP (Coin Change)',
    overview: '1D DP 점화식으로 최소 동전 개수를 O(amount × |coins|)에 계산',
    lines: [
      { text: 'def coin_change(coins: list[int], amount: int) -> int:',  desc: '동전 종류 리스트와 목표 금액 인자로 받음' },
      { text: '    dp = [float("inf")] * (amount + 1)',                   desc: 'DP 테이블 — 인덱스 i = 금액 i를 만드는 최소 동전 수, 무한대로 초기화' },
      { text: '    dp[0] = 0',                                            desc: '금액 0은 동전 0개로 만들 수 있음 (기저 조건)' },
      { text: '    for i in range(1, amount + 1):',                      desc: '금액 1부터 amount까지 모든 경우 계산' },
      { text: '        for coin in coins:',                               desc: '각 동전 단위를 사용해보며 갱신' },
      { text: '            if coin <= i:',                                desc: '해당 동전이 현재 금액보다 크지 않을 때만 사용 가능' },
      { text: '                dp[i] = min(dp[i], dp[i - coin] + 1)',    desc: '점화식: 동전 한 개 더 써서 만드는 경우와 비교해 최솟값 갱신' },
      { text: '    return dp[amount] if dp[amount] != float("inf") else -1', desc: 'amount를 만들 수 없으면 -1, 가능하면 최솟값 반환' },
    ],
  },
  {
    id: 'lcs',
    title: 'LCS (최장 공통 부분수열)',
    overview: '2D DP로 두 문자열의 가장 긴 공통 부분수열 길이를 O(mn)에 계산',
    lines: [
      { text: 'def lcs(a: str, b: str) -> int:',                        desc: '두 문자열을 받아 LCS 길이를 반환하는 함수' },
      { text: '    m, n = len(a), len(b)',                               desc: '두 문자열 길이 저장' },
      { text: '    dp = [[0] * (n + 1) for _ in range(m + 1)]',         desc: '2D DP 테이블 초기화 — 빈 문자열 경계 포함' },
      { text: '    for i in range(1, m + 1):',                          desc: '문자열 a의 각 문자 순회' },
      { text: '        for j in range(1, n + 1):',                      desc: '문자열 b의 각 문자 순회' },
      { text: '            if a[i - 1] == b[j - 1]:',                   desc: '두 문자가 같으면 공통 부분수열 연장' },
      { text: '                dp[i][j] = dp[i - 1][j - 1] + 1',       desc: '점화식: 대각선(이전 두 문자까지의 LCS) + 1' },
      { text: '            else:',                                       desc: '두 문자가 다르면 이전 최댓값 상속' },
      { text: '                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])', desc: '점화식: 한 문자씩 뺀 두 경우 중 최댓값' },
      { text: '    return dp[m][n]',                                     desc: '전체 두 문자열의 LCS 길이 반환' },
    ],
  },
];

function buildLongPool(algoId: string): { texts: string[]; descs: string[] } {
  const algo = LONG_ALGORITHMS.find(a => a.id === algoId);
  if (!algo) return { texts: [], descs: [] };
  return {
    texts: algo.lines.map(l => l.text),
    descs: algo.lines.map(l => l.desc),
  };
}

function buildPool(langId: LangId, category: CategoryId, level: LevelId): { texts: string[]; descs: string[] } {
  let snippets = SNIPPETS[langId];
  if (category !== 'all') snippets = snippets.filter(s => s.category === category);
  snippets = snippets.filter(s => s.level === level);
  if (snippets.length === 0) return { texts: [], descs: [] };
  const shuffled = shuffleArray(snippets);
  const pool: typeof snippets = [];
  while (pool.length < 30) pool.push(...shuffleArray(shuffled));
  const sliced = pool.slice(0, 30);
  return { texts: sliced.map(s => s.text), descs: sliced.map(s => s.desc ?? '') };
}

// ── 타입 ─────────────────────────────────────────────────
type CharStatus = 'correct' | 'incorrect' | 'pending';
type GameStatus = 'idle' | 'playing' | 'finished';

interface TypingState {
  gameStatus: GameStatus;
  timeLimit: 30 | 60;
  timeLeft: number;
  snippets: string[];
  descs: string[];          // 스니펫별 설명 (parallel array)
  currentSnippetIndex: number;
  currentCharIndex: number;
  typedChars: CharStatus[];
  typedValues: string[];
  totalCorrect: number;
  totalIncorrect: number;
  totalTyped: number;
  wpm: number;
  currentSnippetErrors: number;
  snippetDone: boolean;
  perfectCount: number;
  perfectStreak: number;
  timeBonus: number;
}

// ── 키보드 가이드 ─────────────────────────────────────────────────────────
type FingerId = 'lp' | 'lr' | 'lm' | 'li' | 'th' | 'ri' | 'rm' | 'rr' | 'rp';

const KEY_FINGER: Record<string, FingerId> = {
  '`':'lp','1':'lp','2':'lr','3':'lm','4':'li','5':'li',
  '6':'ri','7':'ri','8':'rm','9':'rr','0':'rp','-':'rp','=':'rp',
  'q':'lp','w':'lr','e':'lm','r':'li','t':'li',
  'y':'ri','u':'ri','i':'rm','o':'rr','p':'rp','[':'rp',']':'rp','\\':'rp',
  'a':'lp','s':'lr','d':'lm','f':'li','g':'li',
  'h':'ri','j':'ri','k':'rm','l':'rr',';':'rp',"'":'rp',
  'z':'lp','x':'lr','c':'lm','v':'li','b':'li',
  'n':'ri','m':'ri',',':'rm','.':'rr','/':'rp',
  ' ':'th',
};

const FINGER_STYLE: Record<FingerId, { dim: string; active: string; hex: string; label: string }> = {
  lp: { dim:'bg-red-950/50 border-red-900/60',       active:'bg-red-500/80 border-red-400',       hex:'#ef4444', label:'왼새끼' },
  lr: { dim:'bg-orange-950/50 border-orange-900/60', active:'bg-orange-500/80 border-orange-400', hex:'#f97316', label:'왼약지' },
  lm: { dim:'bg-yellow-950/50 border-yellow-900/60', active:'bg-yellow-400/80 border-yellow-300', hex:'#eab308', label:'왼중지' },
  li: { dim:'bg-green-950/50 border-green-900/60',   active:'bg-green-500/80 border-green-400',   hex:'#22c55e', label:'왼검지' },
  th: { dim:'bg-zinc-800/50 border-zinc-700/60',     active:'bg-zinc-400/80 border-zinc-300',     hex:'#a1a1aa', label:'엄지'   },
  ri: { dim:'bg-teal-950/50 border-teal-900/60',     active:'bg-teal-500/80 border-teal-400',     hex:'#14b8a6', label:'오검지' },
  rm: { dim:'bg-blue-950/50 border-blue-900/60',     active:'bg-blue-500/80 border-blue-400',     hex:'#3b82f6', label:'오중지' },
  rr: { dim:'bg-indigo-950/50 border-indigo-900/60', active:'bg-indigo-500/80 border-indigo-400', hex:'#6366f1', label:'오약지' },
  rp: { dim:'bg-purple-950/50 border-purple-900/60', active:'bg-purple-500/80 border-purple-400', hex:'#a855f7', label:'오새끼' },
};

const KB_ROWS: string[][] = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
];

// 대문자/특수기호 → 기본 키 변환
const TO_BASE: Record<string, string> = {
  'A':'a','B':'b','C':'c','D':'d','E':'e','F':'f','G':'g','H':'h','I':'i','J':'j',
  'K':'k','L':'l','M':'m','N':'n','O':'o','P':'p','Q':'q','R':'r','S':'s','T':'t',
  'U':'u','V':'v','W':'w','X':'x','Y':'y','Z':'z',
  '!':'1','@':'2','#':'3','$':'4','%':'5','^':'6','&':'7','*':'8','(':'9',')':'0',
  '_':'-','+':'=','{':'[','}':']','|':'\\',':':';','"':"'",'<':',','>':'.','?':'/','~':'`',
};

// 투명 손가락 SVG (손가락 끝이 아래를 향해 키 쪽으로 내려옴)
function FingerSVG({ color, animated }: { color: string; animated: boolean }) {
  return (
    <svg
      width="20" height="34" viewBox="0 0 20 34"
      className={animated ? 'animate-bounce' : ''}
      style={{ filter: `drop-shadow(0 4px 10px ${color}cc)` }}
    >
      {/* 손가락 몸체: 위가 평평한 관절부, 아래가 둥근 지문부 */}
      <path
        d="M2 4 Q2 0 10 0 Q18 0 18 4 L18 22 Q18 34 10 34 Q2 34 2 22 Z"
        fill={color} fillOpacity="0.62"
      />
      {/* 손톱 (위쪽) */}
      <ellipse cx="10" cy="5" rx="5.5" ry="4" fill="white" fillOpacity="0.22" />
      {/* 관절 주름선 */}
      <path d="M4 14 Q10 16 16 14" stroke="white" strokeWidth="1" strokeOpacity="0.2" fill="none" />
    </svg>
  );
}

// 개별 키 캡
function KeyCap({
  label, finger, isActive, wide, showFinger,
}: {
  label: string;
  finger: FingerId;
  isActive: boolean;
  wide?: string;
  showFinger?: boolean;
}) {
  const st = FINGER_STYLE[finger];
  return (
    <div
      className={[
        'relative flex items-center justify-center rounded-sm border font-mono font-bold',
        'h-7 transition-all duration-75 overflow-visible select-none',
        wide ?? 'w-7',
        'text-[9px]',
        isActive
          ? `${st.active} text-white scale-[1.15] shadow-lg z-10`
          : `${st.dim} text-zinc-500`,
      ].join(' ')}
    >
      {label}
      {(isActive && showFinger !== false) && (
        <div className="absolute top-[-38px] left-1/2 -translate-x-1/2 pointer-events-none z-30">
          <FingerSVG color={st.hex} animated={false} />
        </div>
      )}
    </div>
  );
}

// 키보드 가이드 전체
function KeyboardGuide({ activeChar }: { activeChar: string }) {
  const isSpace    = activeChar === ' ';
  const isEnter    = activeChar === 'enter';
  const bk         = isSpace ? ' ' : (TO_BASE[activeChar] ?? activeChar.toLowerCase());
  const shiftNeeded = activeChar in TO_BASE;

  // 활성 손가락 정보 (안내 레이블용)
  const activeFinger = isSpace ? 'th' : isEnter ? 'rp' : (KEY_FINGER[bk] ?? null);
  const fingerLabel  = activeFinger ? FINGER_STYLE[activeFinger].label : '';

  const ROW_OFFSET = [0, 14, 22, 4]; // 각 행의 왼쪽 오프셋(px)

  return (
    <div className="w-full flex flex-col items-center gap-0.5 pt-2 pb-3 px-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80 select-none overflow-visible">
      {/* 손가락 안내 레이블 */}
      {activeFinger && (
        <div
          className="text-[11px] font-bold mb-1 tracking-wide"
          style={{ color: FINGER_STYLE[activeFinger].hex }}
        >
          {fingerLabel}
        </div>
      )}

      {/* 자판 행 */}
      <div className="flex flex-col gap-[3px] overflow-visible">
        {KB_ROWS.map((row, ri) => (
          <div
            key={ri}
            className="flex gap-[3px] overflow-visible"
            style={{ paddingLeft: `${ROW_OFFSET[ri]}px` }}
          >
            {ri === 3 && (
              <KeyCap label="⇧" finger="lp" isActive={shiftNeeded} wide="w-10" showFinger={false} />
            )}
            {row.map(k => (
              <KeyCap
                key={k}
                label={k === '\\' ? '\\' : k === "'" ? "'" : k.toUpperCase()}
                finger={KEY_FINGER[k] ?? 'lp'}
                isActive={bk === k && !isSpace && !isEnter}
              />
            ))}
            {ri === 3 && (
              <KeyCap label="⇧" finger="rp" isActive={shiftNeeded} wide="w-10" showFinger={false} />
            )}
          </div>
        ))}

        {/* 스페이스바 + Enter */}
        <div className="flex gap-[3px] mt-0.5 overflow-visible" style={{ paddingLeft: `${ROW_OFFSET[3]}px` }}>
          <KeyCap label="" finger="th" isActive={isSpace} wide="w-52" />
          <KeyCap label="↵" finger="rp" isActive={isEnter} wide="w-12" />
        </div>
      </div>
    </div>
  );
}

const IGNORED_KEYS = new Set([
  'Shift', 'Control', 'Alt', 'Meta', 'Escape', 'CapsLock',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
]);

function makeInitialState(
  timeLimit: 30 | 60,
  pool: { texts: string[]; descs: string[] },
): TypingState {
  const { texts: snippets, descs } = pool;
  return {
    gameStatus: 'idle', timeLimit, timeLeft: timeLimit, snippets, descs,
    currentSnippetIndex: 0, currentCharIndex: 0,
    typedChars: Array(snippets[0]?.length ?? 0).fill('pending'),
    typedValues: [],
    totalCorrect: 0, totalIncorrect: 0, totalTyped: 0, wpm: 0,
    currentSnippetErrors: 0,
    snippetDone: false,
    perfectCount: 0,
    perfectStreak: 0,
    timeBonus: 0,
  };
}

// ══ 컴포넌트 ═════════════════════════════════════════════

export default function TypingGame({ onGameEnd, onScoreChange, onKeyClick, onCombo, onLongMode }: GameComponentProps) {
  const [langId, setLangId]       = useState<LangId>('typescript');
  const [timeLimit, setTimeLimit] = useState<30 | 60>(60);
  const [category, setCategory]   = useState<CategoryId>('all');
  const [level, setLevel]         = useState<LevelId>(2);
  const [longMode, setLongMode]   = useState(false);
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>(LONG_ALGORITHMS[0].id);
  const [state, setState] = useState<TypingState>(() =>
    makeInitialState(60, buildPool('typescript', 'all', 2))
  );

  // longMode 변경 시 부모(GamePageClient)에 알려 fullWidth 토글
  useEffect(() => { onLongMode?.(longMode); }, [longMode, onLongMode]);

  const bonusFlashDataRef = useRef<{ seconds: number; perfect: boolean; streak: number; mult: number } | null>(null);
  const gameStartTimeRef  = useRef<number | null>(null);
  const pendingGameEndRef = useRef<{ score: number; detail: string } | null>(null);
  const [bonusFlash, setBonusFlash] = useState<{ seconds: number; perfect: boolean; streak: number; mult: number } | null>(null);

  const gameAreaRef     = useRef<HTMLDivElement>(null);
  const hiddenInputRef  = useRef<HTMLInputElement>(null);
  const [flashActive,   setFlashActive]   = useState(false);
  const [flashColor,    setFlashColor]    = useState('rgba(239,68,68,0.25)');
  const [confettiActive, setConfettiActive] = useState(false);
  const prevSnippetIdxRef  = useRef(0);
  const prevIncorrectRef   = useRef(0);
  const correctComboRef    = useRef(0);
  const keydownHandledRef  = useRef(false);
  const { playKeyClick, playCombo } = useSound();
  const combo = useCombo();

  // ── 게임 종료 처리 ──────────────────────────────────────
  useGameTimer(() => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      // longMode는 시간 차감 없음
      if (longMode) return prev;
      const newTimeLeft = prev.timeLeft - 1;
      if (newTimeLeft <= 0) return { ...prev, timeLeft: 0, gameStatus: 'finished' };
      const elapsed = (prev.timeLimit - newTimeLeft) / 60;
      const wpm = elapsed > 0 ? Math.round(prev.totalCorrect / 5 / elapsed) : 0;
      onScoreChange(wpm);
      return { ...prev, timeLeft: newTimeLeft, wpm };
    });
  }, state.gameStatus === 'playing' ? 1000 : null);

  useEffect(() => {
    if (state.gameStatus === 'finished' && state.timeLeft === 0 && !longMode) {
      const wpm = Math.round(state.totalCorrect / 5 / (state.timeLimit / 60));
      const acc = state.totalTyped > 0
        ? Math.round((state.totalCorrect / state.totalTyped) * 100) : 100;
      onGameEnd(wpm, `WPM: ${wpm}, 정확도: ${acc}%`);
      setState(s => ({ ...s, wpm }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus, state.timeLeft]);

  // longMode 완료 — setState 밖에서 onGameEnd 호출 (렌더 중 setState 금지)
  useEffect(() => {
    if (pendingGameEndRef.current) {
      const { score, detail } = pendingGameEndRef.current;
      pendingGameEndRef.current = null;
      onGameEnd(score, detail);
    }
  }, [state.gameStatus, onGameEnd]);

  // ── 키 입력 처리 ────────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent | React.KeyboardEvent) => {
      const key = (e as React.KeyboardEvent).key;
      if (IGNORED_KEYS.has(key)) return;

      // ── Enter 처리 ──────────────────────────────────────
      if (key === 'Enter') {
        setState(prev => {
          // finished → 전체 재시작
          if (prev.gameStatus === 'finished') {
            correctComboRef.current = 0;
            combo.reset();
            const pool = longMode
              ? buildLongPool(selectedAlgoId)
              : buildPool(langId, category, level);
            return makeInitialState(prev.timeLimit, pool);
          }

          // snippetDone 상태 → 제출 + 다음 문제
          if (prev.snippetDone) {
            const currentSnippet = prev.snippets[prev.currentSnippetIndex] ?? '';
            const levelCfg = LEVELS.find(l => l.id === level)!;
            const isPerfect = prev.currentSnippetErrors === 0;

            const acc = prev.totalTyped > 0 ? prev.totalCorrect / prev.totalTyped : 1;
            const accMult = acc >= 1 ? 1.0 : acc >= 0.95 ? 0.7 : acc >= 0.90 ? 0.4 : 0.2;
            const nextStreak = isPerfect ? (prev.perfectStreak ?? 0) + 1 : 0;
            const streakMult = nextStreak >= 8 ? 3.0 : nextStreak >= 5 ? 2.0 : nextStreak >= 3 ? 1.5 : 1.0;
            const baseBonus  = isPerfect
              ? levelCfg.bonusTime + levelCfg.perfectBonus
              : Math.round(levelCfg.bonusTime * accMult);
            const bonus = isPerfect ? Math.round(baseBonus * streakMult) : baseBonus;

            bonusFlashDataRef.current = { seconds: bonus, perfect: isPerfect, streak: nextStreak, mult: streakMult };

            const nextIdx     = prev.currentSnippetIndex + 1;
            const isLastLine  = nextIdx >= prev.snippets.length;

            // longMode: 마지막 줄 완료 → 통계 화면
            if (longMode && isLastLine) {
              const totalLines = prev.snippets.length;
              const acc2 = prev.totalTyped > 0 ? Math.round((prev.totalCorrect / prev.totalTyped) * 100) : 100;
              const elapsed = (Date.now() - (gameStartTimeRef.current ?? Date.now())) / 1000;
              const wpm2 = elapsed > 0 ? Math.round(prev.totalCorrect / 5 / (elapsed / 60)) : 0;
              // setState 내부에서 부모 setState 호출 금지 → ref에 저장 후 useEffect에서 처리
              pendingGameEndRef.current = { score: wpm2, detail: `WPM: ${wpm2}, 정확도: ${acc2}%, ${totalLines}줄 완성` };
              return {
                ...prev,
                currentSnippetIndex: nextIdx,
                gameStatus: 'finished',
                snippetDone: false,
                wpm: wpm2,
              };
            }

            const nextSnippet = prev.snippets[nextIdx] ?? '';
            return {
              ...prev,
              currentSnippetIndex: nextIdx,
              currentCharIndex: 0,
              typedChars: Array(nextSnippet.length).fill('pending'),
              typedValues: [],
              snippetDone: false,
              currentSnippetErrors: 0,
              perfectCount:  isPerfect ? prev.perfectCount + 1 : prev.perfectCount,
              perfectStreak: nextStreak,
              // longMode는 시간 보너스 없음
              timeLeft:  longMode ? prev.timeLeft : Math.min(prev.timeLeft + bonus, prev.timeLimit + 30),
              timeBonus: longMode ? prev.timeBonus : prev.timeBonus + bonus,
            };
          }

          // 아직 입력 중 + Enter → 스킵 (streak 끊김)
          if (prev.gameStatus === 'idle' || prev.gameStatus === 'playing') {
            correctComboRef.current = 0;
            combo.reset();
            const nextIdx     = prev.currentSnippetIndex + 1;
            const nextSnippet = prev.snippets[nextIdx] ?? '';
            return {
              ...prev,
              currentSnippetIndex: nextIdx,
              currentCharIndex: 0,
              typedChars: Array(nextSnippet.length).fill('pending'),
              typedValues: [],
              snippetDone: false,
              currentSnippetErrors: 0,
              perfectStreak: 0,
            };
          }

          return prev;
        });
        return;
      }

      // ── 일반 키 처리 ────────────────────────────────────
      setState(prev => {
        if (prev.gameStatus === 'finished') return prev;
        // snippetDone이면 Enter 외 입력 무시
        if (prev.snippetDone) return prev;

        const currentSnippet = prev.snippets[prev.currentSnippetIndex] ?? '';
        let ns = { ...prev };

        if (prev.gameStatus === 'idle') {
          ns = { ...ns, gameStatus: 'playing' };
          gameStartTimeRef.current = Date.now();
        }

        if (key === 'Backspace') {
          if (ns.currentCharIndex > 0) {
            const t = [...ns.typedChars];
            t[ns.currentCharIndex - 1] = 'pending';
            const v = ns.typedValues.slice(0, -1);
            return { ...ns, currentCharIndex: ns.currentCharIndex - 1, typedChars: t, typedValues: v };
          }
          return ns;
        }

        // Tab → 현재 커서 위치부터 연속된 공백을 한 번에 채움 (들여쓰기 지원)
        if (key === 'Tab') {
          let cur = ns;
          let filled = 0;
          while (
            filled < 8 &&
            cur.currentCharIndex < currentSnippet.length &&
            currentSnippet[cur.currentCharIndex] === ' '
          ) {
            playKeyClick();
            correctComboRef.current += 1;
            const t = [...cur.typedChars];
            t[cur.currentCharIndex] = 'correct';
            cur = {
              ...cur,
              currentCharIndex: cur.currentCharIndex + 1,
              typedChars: t,
              typedValues: [...cur.typedValues, ' '],
              totalCorrect: cur.totalCorrect + 1,
              totalTyped: cur.totalTyped + 1,
            };
            filled++;
          }
          if (filled === 0) return ns;
          if (cur.currentCharIndex >= currentSnippet.length) return { ...cur, snippetDone: true };
          return cur;
        }

        if (key.length !== 1) return ns;
        onKeyClick?.();

        const expected = currentSnippet[ns.currentCharIndex];
        if (expected === undefined) return ns;

        const ok = key === expected;
        if (ok) {
          playKeyClick();
          correctComboRef.current += 1;
          const raw = correctComboRef.current;
          if (raw > 0 && raw % 5 === 0) onCombo?.(Math.min(Math.floor(raw / 5), 5));
          const prev2 = combo.comboLevel;
          const next  = combo.increment();
          if (next > 0 && next > prev2) playCombo(next);
        } else {
          correctComboRef.current = 0;
          combo.reset();
          ns.currentSnippetErrors = (ns.currentSnippetErrors ?? 0) + 1;
        }

        const newTyped  = [...ns.typedChars];
        newTyped[ns.currentCharIndex] = ok ? 'correct' : 'incorrect';
        const newValues = [...ns.typedValues, key];
        const newIdx        = ns.currentCharIndex + 1;
        const newCorrect    = ok ? ns.totalCorrect    + 1 : ns.totalCorrect;
        const newIncorrect  = ok ? ns.totalIncorrect      : ns.totalIncorrect + 1;
        const newTypedTotal = ns.totalTyped + 1;

        // 마지막 글자 입력 완료 → snippetDone = true, Enter 대기
        if (newIdx >= currentSnippet.length) {
          return {
            ...ns, currentCharIndex: newIdx, typedChars: newTyped, typedValues: newValues,
            totalCorrect: newCorrect, totalIncorrect: newIncorrect, totalTyped: newTypedTotal,
            snippetDone: true,
          };
        }

        return {
          ...ns, currentCharIndex: newIdx, typedChars: newTyped, typedValues: newValues,
          totalCorrect: newCorrect, totalIncorrect: newIncorrect, totalTyped: newTypedTotal,
        };
      });
    },
    [onKeyClick, onCombo, playKeyClick, playCombo, combo, level, langId, category, longMode, selectedAlgoId]
  );

  // ── 이펙트 감지 ─────────────────────────────────────────
  useEffect(() => {
    if (state.totalIncorrect > prevIncorrectRef.current) {
      setFlashColor('rgba(239,68,68,0.25)'); // red
      setFlashActive(true);
    }
    prevIncorrectRef.current = state.totalIncorrect;
  }, [state.totalIncorrect]);

  useEffect(() => {
    if (state.gameStatus === 'finished' && state.wpm >= 40) setConfettiActive(true);
  }, [state.gameStatus, state.wpm]);

  // snippetDone → 입력 완료 플래시 (Enter 대기 중)
  useEffect(() => {
    if (state.snippetDone) {
      const isPerfect = state.currentSnippetErrors === 0;
      setFlashColor(isPerfect
        ? 'rgba(250,204,21,0.22)'   // 노랑 (퍼펙트)
        : 'rgba(34,197,94,0.20)');  // 초록 (완료)
      setFlashActive(true);
    }
  }, [state.snippetDone, state.currentSnippetErrors]);

  // 다음 문제로 넘어갈 때 보너스 플래시 표시
  useEffect(() => {
    if (state.currentSnippetIndex > prevSnippetIdxRef.current && state.gameStatus === 'playing') {
      const data = bonusFlashDataRef.current;
      if (data) {
        setBonusFlash(data);
        bonusFlashDataRef.current = null;
      } else {
        // 스킵 → 회색 플래시
        setFlashColor('rgba(161,161,170,0.18)');
        setFlashActive(true);
      }
    }
    prevSnippetIdxRef.current = state.currentSnippetIndex;
  }, [state.currentSnippetIndex, state.gameStatus]);

  useEffect(() => {
    if (!bonusFlash) return;
    const id = setTimeout(() => setBonusFlash(null), 1500);
    return () => clearTimeout(id);
  }, [bonusFlash]);

  // ── 리셋 / 설정 변경 ────────────────────────────────────
  const getPool = useCallback(() =>
    longMode ? buildLongPool(selectedAlgoId) : buildPool(langId, category, level),
    [longMode, selectedAlgoId, langId, category, level]
  );

  const resetGame = useCallback(() => {
    correctComboRef.current = 0;
    combo.reset();
    setState(makeInitialState(timeLimit, getPool()));
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [timeLimit, getPool, combo]);

  const handleLangChange = useCallback((id: LangId) => {
    setLangId(id);
    setLongMode(false);
    const pool = buildPool(id, category, level);
    correctComboRef.current = 0;
    combo.reset();
    setState(makeInitialState(timeLimit, pool));
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [category, level, timeLimit, combo]);

  const handleTimeLimitChange = useCallback((limit: 30 | 60) => {
    setTimeLimit(limit);
    setState(makeInitialState(limit, getPool()));
  }, [getPool]);

  const handleCategoryChange = useCallback((cat: CategoryId) => {
    setCategory(cat);
    setLongMode(false);
    const pool = buildPool(langId, cat, level);
    correctComboRef.current = 0;
    combo.reset();
    setState(makeInitialState(timeLimit, pool));
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [langId, level, timeLimit, combo]);

  const handleLevelChange = useCallback((lv: LevelId) => {
    setLevel(lv);
    setLongMode(false);
    const pool = buildPool(langId, category, lv);
    correctComboRef.current = 0;
    combo.reset();
    setState(makeInitialState(timeLimit, pool));
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [langId, category, timeLimit, combo]);

  const handleAlgoSelect = useCallback((id: string) => {
    setSelectedAlgoId(id);
    setLongMode(true);
    correctComboRef.current = 0;
    combo.reset();
    setState(makeInitialState(timeLimit, buildLongPool(id)));
    setTimeout(() => hiddenInputRef.current?.focus(), 50);
  }, [timeLimit, combo]);

  // ── 파생 값 ─────────────────────────────────────────────
  const currentSnippet = state.snippets[state.currentSnippetIndex] ?? '';
  const currentDesc    = state.descs[state.currentSnippetIndex] ?? '';
  const accuracy = state.totalTyped > 0
    ? Math.round((state.totalCorrect / state.totalTyped) * 100) : 100;
  const activeLang = LANGS.find(l => l.id === langId)!;
  const isEmptyPool = state.snippets[0] === undefined;

  // ── 렌더 ────────────────────────────────────────────────

  const codePanel = longMode ? (() => {
    const algo = LONG_ALGORITHMS.find(a => a.id === selectedAlgoId)!;
    return (
      <div
        className="flex flex-col rounded-2xl border border-zinc-700/60 bg-zinc-950/95 backdrop-blur-xs shadow-2xl overflow-hidden"
        style={{ width: '50%', minWidth: 0, height: 'calc(100vh - 120px)', position: 'sticky', top: '80px', alignSelf: 'flex-start' }}
      >
        {/* 헤더 */}
        <div className="px-4 py-3 border-b border-zinc-700/60 bg-zinc-900/80 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-yellow-500/20 text-yellow-400 font-mono">PY</span>
            <p className="text-xs font-bold text-yellow-300">{algo.title}</p>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">{algo.overview}</p>
        </div>

        {/* 코드 블록 — 신택스 하이라이팅 */}
        <div className="flex-1 overflow-y-auto bg-[#1a1b26] scrollbar-thin scrollbar-thumb-zinc-700">
          {/* 코드 헤더 바 (VS Code 스타일) */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800/60 border-b border-zinc-700/40 text-[10px] text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-red-500/70" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
            <span className="w-2 h-2 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono">{algo.id}.py</span>
          </div>
          {/* 라인들 */}
          <div className="py-2 font-mono" style={{ fontSize: '18px', lineHeight: '2.4rem', color: '#ffffff', whiteSpace: 'pre' }}>
            {algo.lines.map((line, i) => {
              const done    = i < state.currentSnippetIndex;
              const current = i === state.currentSnippetIndex;
              return (
                <div
                  key={i}
                  className="transition-colors"
                  style={current ? { background: 'rgba(250,204,21,0.07)' } : undefined}
                >
                  {/* 코드 줄 */}
                  <div className="flex items-center px-0">
                    {/* 라인 번호 */}
                    <span
                      className="select-none text-right tabular-nums px-3 shrink-0"
                      style={{ width: '3.2rem', fontSize: '15px', lineHeight: '2.4rem', color: current ? '#fbbf24' : '#3f3f46' }}
                    >
                      {i + 1}
                    </span>
                    {/* 현재 줄 강조 막대 */}
                    <span
                      className="shrink-0 w-[3px] self-stretch mr-1"
                      style={{ background: current ? '#fbbf24' : 'transparent' }}
                    />
                    {/* 코드 텍스트 */}
                    <span className="flex-1 pr-3 break-all">
                      {done ? (
                        <span style={{ opacity: 0.45, textDecoration: 'line-through', textDecorationColor: '#4b5563' }}>
                          <PythonLine code={line.text} />
                        </span>
                      ) : current ? (
                        <PythonLine code={line.text} />
                      ) : (
                        <PythonLine code={line.text} dim />
                      )}
                    </span>
                    {/* 완료 체크 */}
                    {done && (
                      <span className="shrink-0 pr-2 text-emerald-600 text-[10px] leading-6">✓</span>
                    )}
                  </div>
                  {/* 현재 줄 설명 — 코드 바로 아래 */}
                  {current && line.desc && (
                    <div
                      className="flex items-start gap-2 px-3 pb-2"
                      style={{ whiteSpace: 'normal', fontSize: '13px', lineHeight: '1.5', marginLeft: '3.6rem' }}
                    >
                      <span style={{ color: '#f59e0b', marginTop: '1px', flexShrink: 0 }}>📌</span>
                      <span style={{ color: '#a1a1aa' }}>{line.desc}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 진행률 */}
        <div className="px-4 py-2 border-t border-zinc-700/40 bg-zinc-900/80 shrink-0">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1.5">
            <span className="font-mono">진행</span>
            <span className="font-mono tabular-nums">{state.currentSnippetIndex} / {algo.lines.length}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1">
            <div
              className="h-1 rounded-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${(state.currentSnippetIndex / algo.lines.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  })() : null;

  return (
    <div
      ref={gameAreaRef}
      tabIndex={0}
      className={[
        'outline-hidden relative w-full min-h-[calc(100vh-180px)]',
        longMode ? 'flex flex-row gap-4 items-start' : 'flex flex-col gap-5',
      ].join(' ')}
      onClick={() => hiddenInputRef.current?.focus()}
    >
      <ConfettiEffect active={confettiActive} duration={3000} />
      <FlashOverlay
        active={flashActive}
        color={flashColor}
        duration={250}
        onDone={() => setFlashActive(false)}
      />

      {/* ── 코드 패널 (긴 글 모드 전용 — 왼쪽 50%) ── */}
      {codePanel}

      {/* ── 게임 전체 UI ───────────────────── */}
      <div className={['flex flex-col gap-5', longMode ? 'flex-1 min-w-0' : 'w-full'].join(' ')}>

      {/* 숨겨진 모바일 input */}
      <input
        ref={hiddenInputRef}
        className="sr-only"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        inputMode="text"
        aria-label="타이핑 입력"
        onKeyDown={(e) => {
          keydownHandledRef.current = false;
          const key = e.key;
          if (IGNORED_KEYS.has(key)) return;
          if (key !== 'Unidentified' && (key.length === 1 || key === 'Backspace' || key === 'Enter' || key === 'Tab')) {
            e.preventDefault();
            keydownHandledRef.current = true;
            handleKey(e as unknown as KeyboardEvent);
          }
        }}
        onInput={(e) => {
          const input = e.currentTarget;
          if (keydownHandledRef.current) {
            keydownHandledRef.current = false;
            input.value = '';
            return;
          }
          const value = input.value;
          if (!value) return;
          for (const char of value) handleKey({ key: char } as unknown as KeyboardEvent);
          input.value = '';
        }}
        onBlur={() => {
          setTimeout(() => hiddenInputRef.current?.focus(), 0);
        }}
      />

      {/* ── 언어 선택 탭 ───────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {LANGS.map(lang => {
            const isActive = lang.id === langId;
            return (
              <button
                key={lang.id}
                onClick={() => handleLangChange(lang.id)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap',
                  'border transition-all duration-150 cursor-pointer',
                  isActive
                    ? `${lang.bgCls} ${lang.borderCls} text-white`
                    : `bg-zinc-800/60 border-zinc-700 ${lang.textCls} hover:border-zinc-500`,
                ].join(' ')}
              >
                <span className={[
                  'inline-flex items-center justify-center w-5 h-5 rounded-sm text-[10px] font-black',
                  isActive ? 'bg-white/20' : 'bg-zinc-700',
                ].join(' ')}>
                  {lang.badge}
                </span>
                {lang.label}
              </button>
            );
          })}
        </div>

        {/* 카테고리 선택 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-zinc-500 shrink-0">카테고리:</span>
          {CATEGORIES.map(cat => {
            const isActive = cat.id === category;
            const hasSnippets = cat.id === 'all' || SNIPPETS[langId].some(s => s.category === cat.id && s.level === level);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                title={cat.desc}
                className={[
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 whitespace-nowrap',
                  isActive
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : hasSnippets
                      ? 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-default',
                ].join(' ')}
              >
                <span>{cat.icon}</span>
                {cat.label}
                {!hasSnippets && <span className="text-zinc-700 ml-0.5">✕</span>}
              </button>
            );
          })}
        </div>

        {/* 레벨 선택 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-zinc-500 shrink-0">레벨:</span>
          {LEVELS.map(lv => {
            const isActive = lv.id === level;
            const hasSnippets = SNIPPETS[langId].some(
              s => s.level === lv.id && (category === 'all' || s.category === category)
            );
            return (
              <button
                key={lv.id}
                onClick={() => handleLevelChange(lv.id)}
                title={`${lv.desc} · 완료 보너스 +${lv.bonusTime}s`}
                className={[
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150',
                  isActive
                    ? 'bg-emerald-700 border-emerald-500 text-white'
                    : hasSnippets
                      ? 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-default',
                ].join(' ')}
              >
                {lv.label}
                <span className={`text-[10px] ${isActive ? 'text-emerald-300' : 'text-zinc-600'}`}>{lv.desc}</span>
              </button>
            );
          })}
        </div>

        {/* 시간 선택 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">시간:</span>
          {([30, 60] as const).map(t => (
            <button
              key={t}
              onClick={() => handleTimeLimitChange(t)}
              className={[
                'px-3 py-1 rounded-lg text-xs font-semibold border transition-colors',
                timeLimit === t
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500',
              ].join(' ')}
            >
              {t}초
            </button>
          ))}
        </div>
      </div>

      {/* ── 긴 글 연습 패널 (Python × Algorithm) ──────────── */}
      {langId === 'python' && (category === 'algorithm' || category === 'all') && (
        <div className="rounded-xl border border-yellow-600/30 bg-yellow-950/20 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-yellow-400 tracking-wide">
              📜 긴 글 연습 — 정석 알고리즘 전체 코드
            </span>
            {longMode && (
              <button
                onClick={() => { setLongMode(false); setState(makeInitialState(timeLimit, buildPool(langId, category, level))); }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 border border-zinc-700 rounded-sm px-2 py-0.5"
              >
                단문 모드로 돌아가기
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {LONG_ALGORITHMS.map(algo => {
              const isActive = longMode && selectedAlgoId === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => handleAlgoSelect(algo.id)}
                  title={algo.overview}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 text-left',
                    isActive
                      ? 'bg-yellow-600/80 border-yellow-400 text-white'
                      : 'bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:border-yellow-600/60 hover:text-yellow-300',
                  ].join(' ')}
                >
                  {algo.title}
                  <span className="block text-[9px] mt-0.5 opacity-60">{algo.lines.length}줄</span>
                </button>
              );
            })}
          </div>
          {longMode && (
            <p className="text-[11px] text-yellow-600/80 italic">{LONG_ALGORITHMS.find(a => a.id === selectedAlgoId)?.overview}</p>
          )}
        </div>
      )}

      {/* ── 스탯 바 ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-2 py-3 rounded-xl bg-gray-900/40 border border-zinc-800">
        <div className="text-center flex-1">
          {longMode ? (
            <>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">Lines</p>
              <p className="text-3xl md:text-4xl font-mono font-black tabular-nums text-white">
                {state.currentSnippetIndex}
                <span className="text-base font-normal text-zinc-500 ml-0.5">/ {state.snippets.length}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">Time</p>
              <p className={`text-3xl md:text-4xl font-mono font-black tabular-nums ${
                state.timeLeft <= 10 && state.gameStatus === 'playing'
                  ? 'text-red-400 animate-pulse' : 'text-white'
              }`}>
                {state.timeLeft}
                <span className="text-base font-normal text-zinc-500 ml-0.5">s</span>
              </p>
            </>
          )}
        </div>

        {/* 현재 언어 배지 + 진행/스트릭 */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <span className={[
            'px-3 py-1 rounded-full text-xs font-black tracking-widest',
            'border-2',
            activeLang.borderCls,
            activeLang.textCls,
            'bg-zinc-900',
          ].join(' ')}>
            {activeLang.badge}
          </span>
          {state.gameStatus === 'playing' && state.currentSnippetIndex > 0 && (
            <div className="flex gap-0.5">
              {Array.from({ length: Math.min(state.currentSnippetIndex, 12) }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${activeLang.bgCls}`} />
              ))}
            </div>
          )}
          {state.perfectStreak >= 2 && state.gameStatus === 'playing' && (
            <span className="text-xs font-black text-yellow-400 animate-pulse whitespace-nowrap">
              🔥 {state.perfectStreak}연속 퍼펙트
            </span>
          )}
        </div>

        <div className="text-center flex-1">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">WPM</p>
          <p className="text-3xl md:text-4xl font-mono font-black text-indigo-400 tabular-nums">{state.wpm}</p>
        </div>

        <div className="text-center flex-1">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-0.5">Acc</p>
          <p className={`text-2xl md:text-3xl font-bold tabular-nums ${
            accuracy >= 95 ? 'text-emerald-400' : accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'
          }`}>{accuracy}%</p>
        </div>
      </div>

      {/* ── 타이핑 영역 ────────────────────────────────── */}
      {state.gameStatus !== 'finished' && (
        isEmptyPool ? (
          <div className="rounded-xl p-6 border border-zinc-700 bg-gray-900/80 text-center space-y-2">
            <p className="text-zinc-400 text-sm">이 조합에 스니펫이 없습니다</p>
            <p className="text-zinc-600 text-xs">다른 카테고리 또는 레벨을 선택해 보세요</p>
            <button onClick={() => handleCategoryChange('all')} className="mt-2 px-4 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg text-xs hover:border-zinc-500">
              전체 보기
            </button>
          </div>
        ) : (
          <div className={[
            'rounded-2xl p-6 md:p-8 min-h-[280px] md:min-h-[340px] border-2 bg-gray-900/80 relative flex flex-col',
            'border-zinc-700 transition-colors',
            state.gameStatus === 'playing' ? activeLang.borderCls : '',
          ].join(' ')}>
            {/* 보너스 플래시 */}
            {bonusFlash && (
              <div className="pointer-events-none absolute top-3 right-4 flex flex-col items-end z-10">
                <span className={`text-3xl md:text-4xl font-black ${
                  bonusFlash.perfect ? 'text-yellow-400' : 'text-emerald-400'
                } animate-bounce drop-shadow-[0_0_12px_currentColor]`}>
                  +{bonusFlash.seconds}s
                </span>
                {bonusFlash.perfect && (
                  <span className="text-sm font-black text-yellow-300 mt-0.5">PERFECT! 🎯</span>
                )}
                {bonusFlash.mult > 1 && (
                  <span className="text-xs font-bold text-orange-400">×{bonusFlash.mult.toFixed(1)} STREAK</span>
                )}
              </div>
            )}

            {state.gameStatus === 'idle' && (
              <p className="text-zinc-600 text-sm mb-4 text-center tracking-wide">
                타이핑을 시작하면 자동으로 게임이 시작됩니다
              </p>
            )}

            {/* 스니펫 설명 — longMode는 왼쪽 패널에 표시하므로 숨김 */}
            {currentDesc && !longMode && (
              <div className="mb-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                <span className="text-yellow-500 text-xs mt-0.5 shrink-0">📌</span>
                <p className="text-xs text-zinc-400 leading-relaxed">{currentDesc}</p>
              </div>
            )}

            {/* 긴 글 모드: 진행 라인 표시 (모바일 전용, 데스크탑은 왼쪽 패널 사용) */}
            {longMode && state.gameStatus !== 'idle' && (
              <div className="lg:hidden mb-2 flex items-center gap-2">
                <div className="flex gap-0.5 flex-wrap">
                  {state.snippets.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-3 rounded-full transition-all ${
                        i < state.currentSnippetIndex ? activeLang.bgCls :
                        i === state.currentSnippetIndex ? 'bg-yellow-400 animate-pulse' :
                        'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500">
                  {state.currentSnippetIndex + 1} / {state.snippets.length}줄
                </span>
              </div>
            )}

            {/* 진행률 바 */}
            {state.gameStatus === 'playing' && (
              <div className="w-full bg-zinc-800 rounded-full h-1 mb-5 overflow-hidden">
                <div
                  className={`h-1 rounded-full transition-all duration-150 ${activeLang.bgCls}`}
                  style={{ width: state.snippetDone ? '100%' : `${Math.min(100, (state.currentCharIndex / (currentSnippet.length || 1)) * 100)}%` }}
                />
              </div>
            )}

            {/* 목표 텍스트 — 교정부호 포함 */}
            <div className="font-mono text-xl md:text-2xl leading-relaxed select-none mb-4 tracking-wide" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {currentSnippet.split('').map((ch, i) => {
                const status   = state.typedChars[i] ?? 'pending';
                const isCursor = i === state.currentCharIndex && (state.gameStatus === 'playing' || state.gameStatus === 'idle');
                const typed    = state.typedValues[i];

                if (status === 'incorrect' && typed !== undefined) {
                  // 교정부호: 오타 위치에 [입력한글자→정답] 표시
                  const displayTyped  = typed  === ' ' ? '␣' : typed;
                  const displayTarget = ch === ' ' ? '␣' : ch;
                  return (
                    <span key={i} className="relative inline-block">
                      {/* 입력한 글자 — 취소선 */}
                      <span className="text-red-400 line-through decoration-red-500">{displayTyped}</span>
                      {/* 교정 화살표 + 정답 */}
                      <span className="text-[10px] md:text-xs text-red-300 font-bold align-super leading-none">
                        →{displayTarget}
                      </span>
                    </span>
                  );
                }

                let cls = 'text-zinc-600';
                if (status === 'correct') cls = `${activeLang.textCls} opacity-80`;
                if (isCursor)            cls  = 'bg-indigo-500/30 rounded-xs text-zinc-200';
                return (
                  <span key={i} className={cls}>
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                );
              })}
            </div>

            {/* 구분선 */}
            <div className="border-t-2 border-dashed border-zinc-700/60 mb-4" />

            {/* 내가 입력한 텍스트 — 흰색 단색 */}
            <div className="font-mono text-2xl md:text-3xl leading-relaxed select-none min-h-10 flex-1 text-white" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {state.typedValues.map((ch, index) => (
                <span key={index}>
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
              {/* 커서 또는 Enter 대기 힌트 */}
              {state.snippetDone ? (
                <span className="ml-2 animate-pulse font-semibold text-base text-yellow-400">
                  ↵ Enter
                </span>
              ) : state.gameStatus === 'playing' && (
                <span className="animate-pulse text-indigo-400 font-thin">|</span>
              )}
              {/* idle 상태 플레이스홀더 */}
              {state.gameStatus === 'idle' && state.typedValues.length === 0 && (
                <span className="text-zinc-700 text-base md:text-lg">여기에 입력됩니다...</span>
              )}
            </div>
          </div>
        )
      )}

      {/* ── 키보드 가이드 ────────────────────────────────── */}
      {(state.gameStatus === 'idle' || state.gameStatus === 'playing') && !isEmptyPool && (
        <KeyboardGuide
          activeChar={
            state.snippetDone
              ? 'enter'
              : (currentSnippet[state.currentCharIndex] ?? '')
          }
        />
      )}

      {/* 온스크린 키보드 (모바일) */}
      {state.gameStatus !== 'finished' && (
        <div className="relative min-h-[120px] lg:hidden">
          <GameOverlayController
            type="keyboard"
            onKey={(key) => handleKey({ key } as unknown as KeyboardEvent)}
            disabled={false}
          />
        </div>
      )}

      {/* ── 결과 화면 ──────────────────────────────────── */}
      {state.gameStatus === 'finished' && (
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border-2 border-gray-700 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <span className={[
              'px-3 py-1 rounded-full text-sm font-black border-2',
              activeLang.borderCls, activeLang.textCls, 'bg-zinc-900',
            ].join(' ')}>{activeLang.badge}</span>
            <p className="text-zinc-400 text-base">
              {longMode ? `${LONG_ALGORITHMS.find(a => a.id === selectedAlgoId)?.title ?? ''} 완성!` : '결과'}
            </p>
          </div>

          {longMode && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🎉</span>
              <p className="text-xl font-bold text-yellow-300">알고리즘 완성!</p>
            </div>
          )}

          <div>
            <p className="text-7xl md:text-8xl font-black text-indigo-400 tabular-nums">{state.wpm}</p>
            <p className="text-zinc-500 text-base mt-2">WPM</p>
          </div>

          <div className="flex items-center justify-center gap-10 md:gap-16">
            <div>
              <p className={`text-2xl md:text-3xl font-bold ${
                accuracy >= 95 ? 'text-emerald-400' : accuracy >= 80 ? 'text-yellow-400' : 'text-red-400'
              }`}>{accuracy}%</p>
              <p className="text-sm text-zinc-500 mt-1">정확도</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-zinc-300 tabular-nums">{state.totalTyped}</p>
              <p className="text-sm text-zinc-500 mt-1">타이핑 수</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-red-400 tabular-nums">{state.totalIncorrect}</p>
              <p className="text-sm text-zinc-500 mt-1">오타</p>
            </div>
            {longMode && (
              <div>
                <p className="text-2xl md:text-3xl font-bold text-emerald-400 tabular-nums">{state.perfectCount}</p>
                <p className="text-sm text-zinc-500 mt-1">퍼펙트 라인</p>
              </div>
            )}
          </div>

          {/* 보너스 정보 (일반 모드만) */}
          {!longMode && state.timeBonus > 0 && (
            <div className="flex items-center justify-center gap-8 md:gap-12 text-center border-t border-zinc-800 pt-5">
              <div>
                <p className="text-2xl font-bold text-emerald-400">+{state.timeBonus}s</p>
                <p className="text-sm text-zinc-500 mt-1">획득 보너스</p>
              </div>
              {state.perfectCount > 0 && (
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{state.perfectCount}회</p>
                  <p className="text-sm text-zinc-500 mt-1">퍼펙트 스니펫</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-2 pt-2">
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors text-base"
            >
              다시 시작
            </button>
            <p className="text-xs text-zinc-500 mt-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-sm text-zinc-300 font-mono">Enter</kbd>
              {' '}로 빠른 재시작
            </p>
          </div>
        </div>
      )}

      <p className="text-sm text-zinc-600 text-center flex items-center justify-center gap-1.5 flex-wrap">
        {state.gameStatus === 'idle' && (
          <>키보드를 입력하면 자동 시작</>
        )}
        {state.gameStatus === 'playing' && !state.snippetDone && (
          <>
            <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-sm text-zinc-400 font-mono text-xs">Backspace</kbd> 수정
            ·
            완료 {state.currentSnippetIndex}줄
          </>
        )}
        {state.snippetDone && (
          <span className="text-yellow-400 font-semibold animate-pulse">
            ↵ Enter 로 제출 (다음 문제)
          </span>
        )}
        {state.gameStatus === 'finished' && (
          <><kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-sm text-zinc-400 font-mono text-xs">Enter</kbd> 재시작</>
        )}
      </p>
      </div>
    </div>
  );
}
