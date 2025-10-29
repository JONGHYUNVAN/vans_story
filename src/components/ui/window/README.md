# Windows 11 스타일 윈도우 시스템

Next.js 애플리케이션을 위한 완전한 Windows 11 스타일 멀티 윈도우 시스템입니다.

## 🎯 주요 기능

### ✨ 핵심 기능
- **다중 윈도우 관리**: 여러 개의 독립적인 윈도우를 동시에 관리
- **드래그 & 드롭**: 타이틀바를 드래그하여 윈도우 이동
- **리사이즈**: 8방향(상/하/좌/우/4개 모서리)으로 크기 조절
- **최소화/최대화/복원**: Windows 11과 동일한 윈도우 상태 관리
- **스냅 기능**: 화면 가장자리로 드래그하여 자동 정렬
  - 상단 → 최대화
  - 좌측 → 왼쪽 50% 스냅
  - 우측 → 오른쪽 50% 스냅
- **작업표시줄**: 하단 중앙 정렬, 윈도우 프리뷰, 상태 표시
- **상태 저장**: localStorage를 통한 윈도우 위치/크기/상태 저장

### 🎨 디자인 시스템
- **Fluent Design**: Acrylic 배경, 블러 효과
- **부드러운 애니메이션**: Framer Motion 기반
- **다크 모드**: Windows 11 다크 테마
- **반응형**: 데스크톱(1024px+)에서만 활성화

### ♿ 접근성
- ARIA 레이블 지원
- 키보드 네비게이션
- 스크린 리더 지원

## 📦 설치

```bash
npm install framer-motion lucide-react
```

## 🚀 기본 사용법

### 1. WindowManagerProvider로 앱 감싸기

```tsx
import { WindowManagerProvider } from '@/components/ui/window'

function App() {
  return (
    <WindowManagerProvider persistKey="my-app-windows">
      {/* 여기에 앱 컨텐츠 */}
    </WindowManagerProvider>
  )
}
```

### 2. 윈도우 생성 및 사용

```tsx
'use client'

import { useEffect } from 'react'
import { Window, useWindowManager, Taskbar } from '@/components/ui/window'
import { FileText } from 'lucide-react'

function MyApp() {
  const { createWindow, windows } = useWindowManager()

  useEffect(() => {
    // 윈도우가 없으면 생성
    if (!Array.from(windows.values()).find(w => w.id === 'my-window')) {
      createWindow({
        id: 'my-window',
        type: 'form',
        title: '내 윈도우',
        icon: <FileText size={14} />,
        position: { x: 100, y: 100 },
        size: { width: 600, height: 400 },
        minSize: { width: 400, height: 300 },
        state: 'normal',
      })
    }
  }, [])

  return (
    <>
      <Window id="my-window">
        <div className="p-4">
          <h1>윈도우 내용</h1>
          <p>여기에 원하는 컨텐츠를 넣으세요</p>
        </div>
      </Window>

      <Taskbar />
    </>
  )
}
```

### 3. 반응형 처리

```tsx
import { useWindowSystem } from '@/hooks/useWindowSystem'

function ResponsiveApp() {
  const { shouldUseWindowSystem } = useWindowSystem({
    minWidth: 1024,
    waitForMount: true,
  })

  if (shouldUseWindowSystem) {
    return <WindowBasedLayout />
  }

  return <TraditionalLayout />
}
```

## 🎛️ API 레퍼런스

### WindowManagerProvider

```tsx
interface WindowManagerProviderProps {
  children: React.ReactNode
  persistKey?: string // localStorage 키 (기본: 'windows-state')
}
```

### useWindowManager Hook

```tsx
const {
  windows,           // Map<string, WindowConfig>
  activeWindowId,    // string | null
  createWindow,      // (config) => void
  closeWindow,       // (id) => void
  minimizeWindow,    // (id) => void
  maximizeWindow,    // (id) => void
  restoreWindow,     // (id) => void
  focusWindow,       // (id) => void
  updateWindowPosition, // (id, position) => void
  updateWindowSize,     // (id, size) => void
  toggleWindowState,    // (id) => void
} = useWindowManager()
```

### Window 컴포넌트

```tsx
<Window
  id="unique-id"      // 고유 ID (필수)
  className="..."     // 추가 CSS 클래스
>
  {children}
</Window>
```

### WindowConfig

```tsx
interface WindowConfig {
  id: string
  type: 'form' | 'editor' | 'preview' | 'ai-chat'
  title: string
  icon?: React.ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
  state: 'normal' | 'minimized' | 'maximized'
  resizable?: boolean   // 기본: true
  draggable?: boolean   // 기본: true
  closable?: boolean    // 기본: true
  minimizable?: boolean // 기본: true
  maximizable?: boolean // 기본: true
}
```

### ContextMenu

```tsx
import { ContextMenu, useContextMenu } from '@/components/ui/window'

function MyComponent() {
  const { isOpen, position, items, handleContextMenu, close } = useContextMenu()

  const menuItems = [
    { id: '1', label: '새로 만들기', onClick: () => {} },
    { id: '2', separator: true },
    { id: '3', label: '삭제', danger: true, onClick: () => {} },
  ]

  return (
    <>
      <div onContextMenu={(e) => handleContextMenu(e, menuItems)}>
        우클릭하세요
      </div>
      
      <ContextMenu
        items={items}
        position={position}
        isOpen={isOpen}
        onClose={close}
      />
    </>
  )
}
```

## 🎨 커스터마이징

### 테마 커스터마이징

Tailwind CSS 클래스를 사용하여 쉽게 커스터마이징할 수 있습니다:

```tsx
<Window id="my-window" className="border-2 border-purple-500">
  {/* 내용 */}
</Window>
```

### 윈도우 기본 설정 변경

```tsx
createWindow({
  id: 'custom-window',
  title: '커스텀 윈도우',
  position: { x: 200, y: 200 },
  size: { width: 800, height: 600 },
  minSize: { width: 400, height: 300 },
  maxSize: { width: 1200, height: 900 },
  resizable: true,
  draggable: true,
  closable: true,
  minimizable: true,
  maximizable: true,
  state: 'normal',
})
```

## 💡 사용 예시

### PostForm 예시

프로젝트의 `src/components/post/PostFormWindows.tsx`를 참고하세요.
다음 윈도우들을 사용합니다:

1. **폼 윈도우**: 기본 정보 입력
2. **에디터 윈도우**: 컨텐츠 작성
3. **미리보기 윈도우**: 실시간 프리뷰
4. **AI 채팅 윈도우**: AI 어시스턴트

## 🔧 고급 기능

### 프로그래밍 방식으로 윈도우 제어

```tsx
const { 
  focusWindow, 
  minimizeWindow, 
  maximizeWindow,
  updateWindowPosition 
} = useWindowManager()

// 윈도우 포커스
focusWindow('my-window')

// 프로그래밍 방식으로 최소화
minimizeWindow('my-window')

// 위치 변경
updateWindowPosition('my-window', { x: 300, y: 300 })
```

### 상태 초기화

```tsx
// localStorage 클리어
localStorage.removeItem('my-app-windows')
```

## ⚠️ 주의사항

1. **SSR 호환성**: `'use client'` 지시어 필요
2. **성능**: 많은 윈도우(10개 이상)는 성능에 영향을 줄 수 있음
3. **모바일**: 1024px 미만에서는 자동으로 비활성화됨
4. **z-index**: 9999를 사용하므로 다른 요소와 충돌 가능

## 🐛 문제 해결

### 윈도우가 표시되지 않음
- WindowManagerProvider로 감싸져 있는지 확인
- 윈도우 ID가 고유한지 확인
- createWindow가 호출되었는지 확인

### 드래그/리사이즈가 작동하지 않음
- resizable/draggable 옵션 확인
- CSS pointer-events 확인

### 상태가 저장되지 않음
- persistKey 설정 확인
- localStorage 권한 확인

## 📝 라이센스

프로젝트 라이센스를 따릅니다.

