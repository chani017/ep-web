# Everyday Practice (일상의실천) Web Archive

'일상의실천'의 웹 아카이브 프로젝트입니다. Next.js와 Sanity CMS를 활용하여 구축되었으며, 다양한 프로젝트 포트폴리오를 효과적으로 보여주기 위해 그리드/리스트 뷰 전환, 필터링, 그리고 반응형 디자인에 중점을 두었습니다.

## 🚀 시작하기 (Getting Started)

### 1. 프로젝트 클론 및 설치

```bash
git clone https://github.com/chani017/ep-web.git
cd ep-web/nextjs-ep-web
npm install
```

### 2. 환경 변수 설정 (.env.local)

프로젝트 루트의 `nextjs-ep-web` 폴더 안에 `.env.local` 파일을 생성하고, Sanity 프로젝트 연동을 위한 환경 변수를 설정합니다.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-06
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

---

## 🛠 기술 스택 및 선택 이유 (Tech Stack)

### **Frontend: Next.js 15 (App Router)**

- **이유**: SEO 최적화와 초기 로딩 속도 개선을 위해 서버 사이드 렌더링(SSR)과 정적 사이트 생성(SSG)을 유연하게 사용할 수 있는 Next.js를 선택했습니다. 특히 App Router의 서버 컴포넌트(RSC)를 활용하여 데이터 페칭 효율을 높였습니다.

### **CMS: Sanity.io**

- **이유**:
  - **유연한 스키마 설계**: 정형화된 템플릿 없이 프로젝트 성격에 맞춰 데이터 구조를 자유롭게 정의할 수 있습니다.
  - **실시간 프리뷰**: 콘텐츠 수정 시 즉각적인 반영이 가능하여 운영 효율성이 높습니다.
  - **이미지 파이프라인**: 강력한 이미지 최적화 및 변환 API를 기본 제공하여 미디어 중심의 포트폴리오 사이트에 적합합니다.

### **Styling: Tailwind CSS**

- **이유**: `globals.css`의 `:root` 변수와 Tailwind의 유틸리티 클래스를 조합하여 다크/라이트 모드 대응 및 일관된 디자인 시스템(Typography, Spacing)을 빠르게 구축할 수 있었습니다.

### **State Management: React Context API**

- **이유**: 전역적으로 관리해야 할 상태(`isMobile`, `language`, `viewMode` 등)가 복잡하지 않아, Redux나 Zustand 같은 외부 라이브러리 없이 가볍고 효율적인 Context API를 사용했습니다.

---

## 🗂 CMS 구조 및 설계 의도

Sanity Studio(`studio-ep-web`)에서 관리되는 주요 데이터 타입은 다음과 같습니다.

### 1. `post` (메인 포트폴리오)

- **설계 의도**: 각 프로젝트는 단순한 이미지가 아닌, 영상(Mux Video), 텍스트, 링크 등 다양한 미디어를 포함할 수 있어야 합니다.
- **주요 필드**:
  - `title_kr`, `title_en`: 다국어 지원을 위한 이중 제목 필드
  - `slug`: SEO 친화적인 URL 생성
  - `category`: 필터링을 위한 다중 선택 태그 (Graphic, Identity 등)
  - `media`: 이미지, 비디오, 유튜브 링크를 자유롭게 섞어 배치할 수 있는 배열형 필드

### 2. `selExhs`, `award`, `client` (아카이브 데이터)

- **설계 의도**: 단순 목록형 데이터(전시 이력, 수상 내역)를 효율적으로 관리하고 날짜순 정렬을 용이하게 하기 위해 분리했습니다.
- **특징**: `date` 필드를 활용하여 연도별 내림차순 정렬을 자동화했습니다.

---

## ✨ 주요 기능 구현 (Key Features)

### 1. 반응형 & 적응형 디자인 (Responsive & Adaptive)

- **Mobile First**: `ClientLayout`에서 `isMobile` 상태를 감지하여 모바일 전용 컴포넌트(`MobileHeader`, `MobileMainContent`)와 데스크톱 전용 컴포넌트(`ResizableLayout`)를 분기 렌더링합니다.
- **모바일 최적화**: 모바일에서는 터치 친화적인 UI와 슬라이드 업 패널 애니메이션을 적용하여 앱과 같은 경험을 제공합니다.

### 2. 뷰 모드 전환 (View Switcher)

- **내용**: 갤러리 형태의 `Grid View`와 상세 정보를 볼 수 있는 `List View`를 제공합니다.
- **기술적 디테일**:
  - 두 뷰 간 전환 시 **DOM을 새로 그리지 않고 CSS 레이아웃만 변경**하는 방식으로 구현하여, 포함된 **동영상(Mux Player)이 끊기거나 재로딩되는 현상을 방지**했습니다. (Persistence Optimization)

### 3. 강력한 필터링 및 검색

- **기능**:
  - **카테고리**: Graphic, Editorial 등 다중 카테고리 필터링
  - **연도**: 프로젝트 진행 연도별 필터링
  - **검색**: 제목 및 클라이언트명 실시간 검색
- **구현**: 클라이언트 사이드 필터링을 채택하여, 서버 요청 없이 즉각적인 반응성을 보장합니다.

### 4. 다국어 지원 (I18n)

- 헤더의 `Kor / Eng` 토글 버튼을 통해 사이트 전반의 텍스트(메뉴, 프로젝트 설명 등)를 즉시 전환할 수 있습니다.

### 5. 미디어 최적화

- **Mux Video**: 고화질 포트폴리오 영상을 스트리밍 방식으로 제공하여 초기 로딩 속도를 저하시키지 않으면서 고품질의 시각적 경험을 전달합니다.
- **Lazy Loading**: 리스트 뷰 등에서 보이지 않는 이미지는 지연 로딩 처리하여 성능을 최적화했습니다.

---

## 📂 폴더 구조 (Folder Structure)

```
/nextjs-ep-web
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/         # UI Components (Header, PostCard, SidePanel...)
│   ├── context/            # React Context (AppContext)
│   ├── hooks/              # 커스텀 훅을 정리해두었습니다.(useInView: Mux Player를 위한 현재 화면 안에 들어온 영상만 로딩하는 훅)
│   ├── sanity/             # Sanity Client Config & Queries
│   └── types/              # TypeScript Definitions
├── public/                 # 웹에 사용된 아이콘들을 정리해두었습니다.
└── ...

```
