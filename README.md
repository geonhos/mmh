# My Model House

브라우저에서 바로 사용하는 3D 방 배치 시뮬레이터입니다.
이사, 인테리어, 가구 배치를 미리 계획해볼 수 있습니다.

## 사이트 접속

**https://mmh-theta.vercel.app/**

설치 없이 PC/모바일 브라우저에서 바로 사용할 수 있습니다.

## 주요 기능

### 방 관리
- 여러 개의 방을 추가하고 크기/위치를 자유롭게 조절
- 문/창문 배치 (벽면 선택, 위치/크기 조절)
- 문 스윙 영역 시각화 (호 + 치수 표기)
- 방 드래그 이동 및 자동 그리드 배치
- 방 잠금(고정) 기능

### 가구 배치
- **카탈로그**: IKEA, 한샘, 일룸 등 브랜드별 프리셋 가구 (검색/필터)
- **직접 만들기**: 이름/크기/색상/모양을 지정하여 커스텀 가구 생성
- 모양 종류: 침대, 테이블, 의자, 소파, 선반, 박스(기본)
- 드래그 앤 드롭으로 3D 씬에 배치
- 이동/회전/복제/삭제/크기 조절/색상 변경
- 충돌 감지 및 시각적 경고
- 벽/격자 자동 스냅 + 실시간 스냅 가이드라인

### 카메라 & 뷰
- 3D 퍼스펙티브 뷰
- 탑뷰 (위에서 보기)
- 1인칭 워크스루 모드 (WASD + 마우스)

### 시각 효과
- PBR 머티리얼 (목재, 패브릭, 금속, 세라믹 등)
- HDRI 환경 조명 + 컨택트 섀도우
- 포스트 프로세싱 (SSAO, Bloom) — 끄기/낮음/높음
- 치수 레이블 오버레이

### 저장 & 공유
- JSON 파일 저장/불러오기
- LocalStorage 자동 저장
- URL 링크 공유 (lz-string 압축)
- 스크린샷 PNG 저장

### UI/UX
- 탭 기반 사이드바 (방 / 가구 / 설정)
- 글로벌 툴바 (실행취소·다시실행, 카메라 전환)
- 가구 선택 시 하단 플로팅 속성 패널
- 도면 이미지 오버레이 (크기/투명도 조절)
- 우클릭 컨텍스트 메뉴
- Shift+클릭 다중 선택
- 모바일 반응형 사이드바

## 단축키

| 키 | 기능 |
|----|------|
| `Ctrl+Z` | 실행취소 |
| `Ctrl+Shift+Z` / `Ctrl+Y` | 다시실행 |
| `Ctrl+D` | 가구 복제 |
| `R` | 오른쪽 90° 회전 |
| `Shift+R` | 왼쪽 90° 회전 |
| `Delete` / `Backspace` | 선택한 가구 삭제 |
| `Escape` | 선택 해제 |
| `?` | 단축키 도움말 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 3D 렌더링 | Three.js + React Three Fiber |
| 3D 유틸 | @react-three/drei (OrbitControls, ContactShadows, Html 등) |
| 포스트 프로세싱 | @react-three/postprocessing (SSAO, Bloom) |
| 상태 관리 | Zustand + immer (패치 기반 undo/redo) |
| 빌드 도구 | Vite |
| URL 공유 | lz-string |

## 프로젝트 구조

```
src/
├── App.tsx                          # 루트 컴포넌트
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx              # 탭 사이드바 + 글로벌 툴바
│   │   └── Viewport.tsx             # Three.js 캔버스 래퍼
│   ├── sidebar/
│   │   ├── RoomConfigurator.tsx      # 방 목록/설정/문·창문
│   │   ├── FurnitureCatalog.tsx      # 카탈로그 + 커스텀 가구 생성
│   │   ├── FurniturePanel.tsx        # 선택된 가구 속성 패널 (플로팅)
│   │   ├── PlacedFurnitureList.tsx   # 배치된 가구 목록 (토글)
│   │   ├── ToolBar.tsx              # 설정 탭 (화면/도면/파일)
│   │   └── ShortcutHelp.tsx         # 단축키 모달
│   ├── scene/
│   │   ├── Room.tsx                 # 3D 방 (바닥/벽/문/창문)
│   │   ├── FurnitureItem.tsx        # 3D 가구 인스턴스
│   │   ├── FurnitureGeometry.tsx     # catalogId → Shape 매핑
│   │   ├── DoorShape.tsx            # 문 + 스윙 호 시각화
│   │   ├── WindowShape.tsx          # 창문
│   │   ├── CameraController.tsx     # 카메라 프리셋
│   │   ├── FirstPersonControls.tsx  # 1인칭 WASD 컨트롤
│   │   ├── PostProcessing.tsx       # SSAO/Bloom
│   │   ├── SnapGuidelines.tsx       # 스냅 가이드라인
│   │   └── FloorPlanOverlay.tsx     # 도면 오버레이
│   └── furniture-shapes/            # 가구별 3D 형상
│       ├── BedShape.tsx
│       ├── TableShape.tsx
│       ├── ChairShape.tsx
│       ├── SofaShape.tsx
│       ├── ShelfShape.tsx
│       └── GenericBoxShape.tsx      # 폴백 박스
├── store/
│   ├── useStore.ts                  # Zustand 전역 스토어
│   └── furnitureCatalog.ts          # 가구 프리셋 데이터
├── hooks/
│   ├── useDragToScene.ts            # 드래그 앤 드롭
│   └── useKeyboardShortcuts.ts      # 키보드 단축키
├── types/index.ts                   # TypeScript 타입 정의
└── utils/
    ├── constants.ts                 # 기본값, 색상 상수
    ├── collision.ts                 # 충돌 감지
    ├── snapGuides.ts                # 스냅 계산
    ├── geometryPool.ts              # 지오메트리/머티리얼 풀링
    ├── materials.ts                 # PBR 머티리얼
    └── sharing.ts                   # URL 인코딩/디코딩
```

## 로컬 개발

```bash
npm install
npm run dev
```

## 라이선스

MIT
