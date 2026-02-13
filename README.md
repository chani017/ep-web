# 일상의실천 프론트엔드 사전과제

'일상의실천'의 웹 아카이브 클론 과제물입니다. Next.js 16과 Sanity CMS를 활용하여 구축되었습니다.

## 프로젝트 개요

이 프로젝트는 **Frontend (Next.js)**와 **CMS Studio (Sanity)** 두 개의 파트로 구성되어 있습니다.

### 1. 설치 (Installation)

```bash
# 레포지토리 클론
git clone https://github.com/chani017/ep-web.git

# Frontend 의존성 설치
cd ep-web/nextjs-ep-web
npm install

# Sanity Studio 의존성 설치
cd ../studio-ep-web
npm install
```

### 2. 환경 변수 설정 (.env.local)

`nextjs-ep-web` 폴더 루트에 `.env.local` 파일을 생성하고 아래 내용을 입력합니다.

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=f7s9b9q3
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-06
```

### 3. 실행 (Run)

**Frontend (Next.js)**

```bash
# 터미널 1
cd nextjs-ep-web
npm run dev
# http://localhost:3000 접속
```

**Sanity Studio (CMS)**

```bash
# 터미널 2
cd studio-ep-web
npm run dev
# http://localhost:3333 접속 (로컬 스튜디오)
```

---

## 🛠 기술 스택 및 선정 이유 (Tech Stack)

### **Frontend: Next.js 15 (App Router)**

- **선정 이유**: 최신 React 기능(Server Components)을 적극 활용하여 초기 로딩 속도를 최적화하고, SEO 성능을 극대화하기 위해 선택했습니다. `searchParams`를 활용한 URL 동기화 필터링 기능 구현에도 적합합니다.
- **주요 특징**:
  - **Server Components**: 데이터 페칭 로직을 서버로 옮겨 클라이언트 번들 사이즈 감소
  - **Image Optimization**: `next/image`를 통해 디바이스별 최적화된 이미지 제공

### **CMS: Sanity.io (v3)**

- **선정 이유**: 정형화된 템플릿이 아닌, **Schema-First** 접근 방식으로 프로젝트의 고유한 데이터 구조(다양한 미디어 타입, 정렬 로직 등)를 자유롭게 정의할 수 있어 선택했습니다.
- **주요 특징**:
  - **Real-time Collaboration**: 데이터 수정 시 즉각적인 반영
  - **GROQ Query**: GraphQL보다 유연하고 강력한 쿼리 언어로 필요한 데이터만 정확히 페칭

### **Video Streaming: Mux**

- **선정 이유**: 포트폴리오 특성상 고화질 영상이 많습니다. 자체 호스팅의 대역폭 문제와 긴 로딩 시간을 해결하기 위해, 적응형 비트레이트 스트리밍(HLS)을 지원하는 Mux를 도입했습니다.
- **효과**: 모바일/데스크톱 환경에 맞춰 자동으로 최적화된 화질로 재생되어 사용자 경험 향상

### **Styling: Tailwind CSS 4**

- **선정 이유**: CSS 변수(`@theme`)를 활용한 디자인 시스템 구축이 용이하고, 클래스 기반 스타일링으로 개발 생산성을 높이기 위해 선택했습니다.

---

## 🗂 CMS 구조 및 설계 의도 (Schema Design)

Sanity Studio는 데이터의 성격에 따라 크게 **메인 포트폴리오**와 **아카이브 정보**로 구분하여 설계했습니다.

### 1. `post` (Main Portfolio)

가장 핵심이 되는 프로젝트 데이터입니다. 단순한 이미지 나열을 넘어, **‘이야기’를 전달하는 구조**로 설계했습니다.

- **`media` (Array of Objects)**:
  - **설계 의도**: 프로젝트마다 이미지, Mux 비디오, YouTube 영상의 구성이 제각각입니다. 이를 하나의 고정된 필드가 아닌 `array`로 정의하여, 에디터가 자유롭게 순서를 배치하고 섞어서 보여줄 수 있도록 했습니다.
- **`category` (Tags)**: `Graphic`, `Identity`, `Editorial` 등 다중 태그 선택을 가능하게 하여 프론트엔드 필터링 시스템과 연동했습니다.
- **`additional_link` (Array of URLs)**:
  - **설계 의도**: 프로젝트와 관련된 뉴스, 리뷰, 구매처 등 외부 링크가 여러 개일 수 있음을 고려하여, 단일 URL 필드를 배열(Array) 형태로 변경하여 확장성을 확보했습니다.

### 2. `exhibition` & `award` (CV & Archive)

사이드 패널(CV)에 노출되는 텍스트 위주의 정보입니다.

- **분리 이유**: 메인 `post`와 섞일 경우 데이터 관리가 복잡해집니다. 전시(`exhibition`)와 수상(`award`)은 포트폴리오 상세 페이지가 필요 없는 ‘목록형 데이터’이므로 별도 타입으로 분리하여 관리 효율을 높였습니다.
- **필드 구성**:
  - `date` (YYYY.MM): 최신순 정렬을 위한 필수 필드
  - `type` (Solo/Group): 전시 성격에 따른 카테고리 구분

---

## ✨ 주요 구현 기능 (Key Features)

1. **반응형 레이아웃 분기 (Adaptive Layout)**
   - 모바일(`ClientLayout`)과 데스크톱(`ResizableLayout`)의 UX가 완전히 다르기 때문에, CSS 미디어 쿼리만으로는 한계가 있습니다.
   - `isMobile` 컨텍스트를 통해 **DOM 구조 자체를 다르게 렌더링**하여 각 환경에 최적화된 경험을 제공합니다.

2. **지속성 있는 뷰 전환 (Persisted View State)**
   - 리스트 뷰 ↔ 그리드 뷰 전환 시, 컴포넌트를 언마운트하지 않고 CSS로 스타일만 변경하도록 구현했습니다.
   - 이를 통해 **동영상 재생 상태가 유지**되며, 뷰 전환 시 깜빡임 없는 부드러운 전환이 가능합니다.

3. **URL 동기화 필터링**
   - 카테고리나 연도를 선택하면 URL 쿼리 파라미터(`?category=...&year=...`)가 업데이트됩니다.
   - 새로고침 하거나 링크를 공유해도 사용자가 보고 있던 필터 상태가 그대로 유지됩니다.

4. **스마트 페이지네이션**
   - 첫 페이지에서는 이전 버튼(`<`)을 숨기고 왼쪽으로 정렬하며, 마지막 페이지에서는 다음 버튼(`>`)을 숨기는 등 디테일한 UX를 챙겼습니다.
