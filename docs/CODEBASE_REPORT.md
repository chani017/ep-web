# nextjs-ep-web 코드베이스 심층 보고서

> **일상의실천(Everyday Practice)** 포트폴리오 웹사이트 — Next.js 16 + Sanity CMS 기반  
> 작성 목적: 상태 설계, 구조, 타입 설계, 렌더링 최적화 및 컴포넌트 단위 해석

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [아키텍처 및 디렉터리 구조](#2-아키텍처-및-디렉터리-구조)
3. [상태 설계 (State Design)](#3-상태-설계-state-design)
4. [타입 설계 (Type Design)](#4-타입-설계-type-design)
5. [데이터 흐름 및 Sanity 연동](#5-데이터-흐름-및-sanity-연동)
6. [렌더링 최적화](#6-렌더링-최적화)
7. [앱 레이어 (app/)](#7-앱-레이어-app)
8. [컨텍스트 (context/)](#8-컨텍스트-context)
9. [훅 (hooks/)](#9-훅-hooks)
10. [레이아웃 컴포넌트](#10-레이아웃-컴포넌트)
11. [메인 콘텐츠 컴포넌트](#11-메인-콘텐츠-컴포넌트)
12. [포스트 관련 컴포넌트](#12-포스트-관련-컴포넌트)
13. [공통 컴포넌트](#13-공통-컴포넌트)
14. [주요 기능 및 문법 정리](#14-주요-기능-및-문법-정리)
15. [결론 및 권장사항](#15-결론-및-권장사항)

---

## 1. 프로젝트 개요

### 1.1 기술 스택

| 구분 | 기술 |
|------|------|
| **프레임워크** | Next.js 16.1.6 (App Router, Turbopack) |
| **런타임** | React 19.2.3 |
| **언어** | TypeScript 5 |
| **스타일** | Tailwind CSS 4 |
| **CMS** | Sanity (next-sanity 12.x) |
| **비디오** | Mux (@mux/mux-player-react) |
| **이미지** | @sanity/image-url, next/image |

### 1.2 핵심 기능

- **데스크탑**: 리사이즈 가능한 2열 레이아웃(메인 그리드 + 사이드 패널), 검색/연도/카테고리 필터, 페이지네이션, 포스트 상세(풀스크린/설명 패널)
- **모바일**: 단일 열, 상단 필터 바, 슬라이드 사이드바(Contact/CV/Client), 포스트 상세 오버레이
- **다국어**: 한국어(kr) / 영어(en) 전환
- **데이터**: Sanity에서 post, exhibition, award, client 목록 조회 및 ISR(30초 revalidate)

---

## 2. 아키텍처 및 디렉터리 구조

### 2.1 디렉터리 트리

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃 (posts fetch, AppProvider, ClientLayout)
│   ├── page.tsx           # 인덱스 페이지 (CV 데이터 fetch, SidePanel)
│   ├── [slug]/page.tsx    # 포스트 상세 (단일 post fetch, PostContent)
│   └── globals.css        # Tailwind, 폰트, CSS 변수
├── context/
│   └── AppContext.tsx      # 전역 상태 (언어, 탭, 풀스크린, 모바일, 사이드바 등)
├── hooks/
│   ├── usePage.ts         # 페이지네이션 + URL 동기화
│   ├── usePostFilter.ts   # 검색/연도/카테고리 필터
│   ├── useResponCols.ts   # ResizeObserver 기반 컬럼 수
│   ├── useInView.ts       # IntersectionObserver 지연 로드
│   ├── useDropdown.ts     # 외부 클릭 시 드롭다운 닫기
│   ├── useSearch.ts       # 검색 포커스/핸들러
│   └── usePostGridLayout.ts # 그리드 비율 계산 (thumbnail_size 기반)
├── sanity/
│   └── client.ts          # Sanity 클라이언트 설정
├── components/
│   ├── layout/            # 레이아웃·네비게이션
│   │   ├── ClientLayout.tsx   # isMobile 분기, 데스크탑/모바일 구조
│   │   ├── ResizableLayout.tsx # 좌우 분할 + 드래그 리사이즈
│   │   ├── SidePanel.tsx      # Contact/CV/Client 탭 콘텐츠
│   │   ├── SidePanelHeader.tsx # 탭 버튼 + 풀스크린 토글
│   │   ├── MobileHeader.tsx   # 모바일 상단(로고, 언어, 필터)
│   │   └── MobileSidePanel.tsx # 모바일 슬라이드 사이드바
│   ├── main/              # 메인 그리드/리스트
│   │   ├── MainContent.tsx    # 데스크탑: 헤더, 필터, 그리드, 페이지네이션
│   │   └── MobileMainContent.tsx # 모바일: 결과 수, 그리드, 페이지네이션
│   ├── post/              # 포스트 단위 UI
│   │   ├── PostCard.tsx       # 카드/리스트 셀 (썸네일, 제목, 카테고리, Mux 지연 로드)
│   │   ├── PostContent.tsx    # 상세: 제목, 미디어, PortableText, 링크
│   │   ├── MediaRenderer.tsx  # image / mux.video / youtube 분기 렌더
│   │   └── CategoryTag.tsx    # 카테고리 칩 + CATEGORIES/CATEGORY_COLORS
│   └── common/
│       ├── Pagination.tsx     # 페이지 번호 + 이전/다음
│       └── MobileTrigger.tsx  # 모바일 메뉴/닫기 플로팅 버튼
```

### 2.2 렌더링 역할 분리

- **서버 컴포넌트**: `app/layout.tsx`, `app/page.tsx`, `app/[slug]/page.tsx` — 데이터 fetch만 수행하고, 클라이언트 트리는 `ClientLayout` 이하에서 시작.
- **클라이언트 진입점**: `ClientLayout`에서 `useAppContext`, `usePostFilter`, `usePathname` 등 사용. `"use client"`는 필요한 최소 구간에만 적용.

---

## 3. 상태 설계 (State Design)

### 3.1 전역 상태 (AppContext)

모든 전역 UI/UX 상태가 **단일 Context**에 집중되어 있음.

| 상태 | 타입 | 용도 |
|------|------|------|
| `language` | `"kr" \| "en"` | 제목/설명/라벨 표시 언어 |
| `activeTab` | `"Contact" \| "CV" \| "Client"` | 사이드 패널 탭 선택 |
| `isFullContentMode` | `boolean` | 데스크탑에서 포스트 상세 풀스크린 여부 |
| `currentPost` | `SanityDocument \| null` | 풀스크린/상세에 표시할 포스트 |
| `isMobile` | `boolean` | 1194px 미만 여부 (레이아웃 분기) |
| `isMounted` | `boolean` | SSR/클라이언트 불일치 방지용 마운트 플래그 |
| `isMobileSidebarOpen` | `boolean` | 모바일에서 Contact/CV/Client 패널 열림 여부 |
| `searchTerm` | `string` | 검색어 (Context에 두어 사이드바 Client 클릭 시 검색 연동) |
| `visibleClients` | `string[]` | 필터 적용 시 보이는 client 목록 (Client 탭에서 dim 처리용) |

**설계 특징**

- **단일 Provider**: `AppProvider` 하나로 전체 앱을 감싸고, `useAppContext()`로만 접근. 별도 Redux/Zustand 없음.
- **동기 setState 회피**: `useEffect` 내부에서 `setIsMounted(true)`, `setIsMobileSidebarOpen(false)` 등을 호출할 때 `queueMicrotask`로 한 번 감싸서, React 권장사항(effect 내 동기 setState 지양)을 준수.
- **브레이크포인트**: `MOBILE_BREAKPOINT = 1194`로 한 번만 정의하고, resize 리스너에서 `isMobile` 갱신.

### 3.2 필터/페이지 상태 (훅으로 분리)

**usePostFilter(posts)**

- **입력**: 전체 `posts`.
- **상태**: `selectedYear`, `selectedCategory` (URL `_categories`와 동기화).
- **Context 연동**: `searchTerm` / `setSearchTerm`은 Context에서 가져옴.
- **출력**: `filteredPosts`, `uniqueYears`, `availableCategories`, 각 setter. 필터 조건(검색/연도/카테고리)이 바뀔 때마다 `filteredPosts`만 재계산하고, 나머지 컴포넌트는 이 결과와 setter만 사용.

**usePage(filteredPosts)**

- **상태**: `currentPage` (초기값은 URL `_paged`).
- **동작**: `filteredPosts`가 바뀌면 1페이지로 리셋(비동기), `paginatedPosts`는 `currentPage`와 `ITEMS_PER_PAGE`로 slice.
- **URL 동기화**: `setCurrentPage` 호출 시 `_paged` 쿼리 업데이트.

**정리**

- **전역**: 언어, 탭, 풀스크린, 현재 포스트, 모바일 여부, 마운트, 모바일 사이드바, 검색어, visible clients.
- **지역(훅)**: 연도/카테고리 선택, 현재 페이지, 페이지네이션 결과. 이렇게 나누어서 “필터 결과”와 “페이지”가 한 곳에서만 관리됨.

---

## 4. 타입 설계 (Type Design)

### 4.1 Sanity 문서

- **next-sanity**의 `SanityDocument`를 기본으로 사용.
- 쿼리 결과는 `client.fetch<SanityDocument[]>()` 또는 `client.fetch<SanityDocument>()`로 타입 지정.
- 포스트 필드: `_id`, `title_kr`, `title_en`, `slug`, `year`, `client`, `category`, `imageUrl`, `thumbnail_size`, `playbackId`, `media`, `description_kr`, `description_en`, `publishedAt`, `additional_link` 등은 런타임에만 존재하므로, 필요한 곳에서 `post.title_kr`, `post.slug?.current`처럼 optional chaining으로 접근.

### 4.2 미디어 아이템 (MediaItem)

**MediaRenderer / PostContent**에서 사용하는 공용 개념:

- **image**: `_type === "image"`, `image.asset`, `caption`.
- **mux.video**: `_type === "mux.video"`, `asset.playbackId`.
- **youtube**: `_type === "youtube"`, `url`에서 video id 추출.

PostContent에서는 유니온으로 정의:

```ts
type MediaItem =
  | { _type: "image"; _key?: string; caption?: string; image?: { asset?: { _ref?: string } }; url?: string; [key: string]: unknown }
  | { _type: "mux.video"; _key?: string; asset?: { playbackId?: string }; [key: string]: unknown }
  | { _type: "youtube"; _key?: string; url?: string; [key: string]: unknown };
```

MediaRenderer에서는 `MediaItem`에 `[key: string]: any`를 두어 Sanity 스키마 확장에 대응.

### 4.3 FilterState

**MainContent / MobileHeader / ClientLayout**에서 공유하는 “필터 상태 + setter” 타입:

- `searchTerm`, `setSearchTerm`
- `selectedYear`, `setSelectedYear`
- `selectedCategory`, `setSelectedCategory`
- `uniqueYears`, `filteredPosts`, `availableCategories`

이것은 **usePostFilter 반환값**과 동일한 형태로, 인터페이스만 여러 컴포넌트에서 재정의하여 사용. (필요 시 한 곳에서 export하는 것이 유지보수에 유리함.)

### 4.4 그리드/카드 관련

- **PostCard**: `viewMode: "desktopImg" | "list" | "mobileImg"`, `cols`, `rowItemsCount`, `widthPct`, `isMobile`, `searchTerm` 등. 데스크탑/모바일/리스트를 하나의 컴포넌트로 처리.
- **usePostGridLayout**: `viewMode: "desktopImg" | "list" | "mobileImg"`, `cols`, `isMobile`로 `SIZE_MULTIPLIERS` vs `MOBILE_SIZE_MULTIPLIERS` 선택 후, 각 post별 `widthPct`, `rowItemsCount` 계산.

### 4.5 MuxPlayer style

Mux 컴포넌트의 `style`이 CSS 변수(`--controls` 등)를 요구하므로, 다음처럼 단언하여 사용:

```ts
style={
  { "--controls": "none", display: "block" } as React.CSSProperties & Record<`--${string}`, string>
}
```

---

## 5. 데이터 흐름 및 Sanity 연동

### 5.1 데이터 소스

- **layout.tsx**: `POSTS_QUERY`로 최대 2000개 post 목록을 가져와 `ClientLayout`에 `posts`로 전달. 30초 revalidate.
- **page.tsx**: `CV_QUERY`로 exhibition, awards, clients를 가져와 `SidePanel`에 전달. 클라이언트는 `children`으로 이 트리를 받음.
- **[slug]/page.tsx**: `POST_QUERY`로 단일 post 조회 후 없으면 `notFound()`, 있으면 `PostContent`에 전달.

### 5.2 클라이언트에서의 흐름

1. **ClientLayout**: `posts` + `children`(인덱스면 SidePanel, slug면 PostContent) 수신.
2. **usePostFilter(posts)**: 검색/연도/카테고리로 `filteredPosts` 계산, URL과 연동.
3. **usePage(filteredPosts)**: `paginatedPosts`, `currentPage`, `totalPages` 제공.
4. **usePostGridLayout**: `paginatedPosts`와 `cols`/`viewMode`로 각 항목의 `widthPct`/`rowItemsCount` 계산.
5. **MainContent / MobileMainContent**: `PostCard`에 post, language, viewMode, widthPct 등 전달.
6. **SidePanel (Client 탭)**: `visibleClients`와 매칭해 client 버튼 dim 처리; 클릭 시 `setSearchTerm(client)` 후 `/`로 이동.

이렇게 **서버에서 한 번 fetch → ClientLayout → filter → page → grid → PostCard**로만 데이터가 흐르고, 별도 클라이언트 fetch는 없음.

---

## 6. 렌더링 최적화

### 6.1 React.memo

- **PostCard**: props가 많고 리스트가 길어, `React.memo`로 불필요한 재렌더 감소.
- **CategoryTag**: 카테고리 배열만 바뀔 때만 재렌더.

### 6.2 지연 로드 (useInView)

- **PostCard** 내부: `useInView()`로 뷰포트 근처(200px)에 들어올 때만 `shouldRenderVideo === true`로 설정.
- Mux 비디오는 `shouldRenderVideo`일 때만 `<MuxPlayer>`를 렌더하고, 그 전에는 썸네일 이미지만 표시. `loadedVideos` Set으로 한 번 로드한 playbackId는 계속 비디오로 유지.

### 6.3 useMemo / useCallback

- **usePostFilter**: `uniqueYears`, `filteredPosts`, `availableCategories`를 `useMemo`로 계산. `setSelectedCategory`는 `useCallback`으로 URL 업데이트와 함께 고정.
- **usePage**: `paginatedPosts`를 `useMemo`로, `setCurrentPage`를 `useCallback`로.
- **usePostGridLayout**: `renderedPosts`(각 post별 widthPct 등)를 `useMemo`로, posts/cols/viewMode/isMobile 변경 시에만 재계산.
- **ResizableLayout**: `startResizing`, `stopResizing`, `resize`를 `useCallback`로 고정해 effect/이벤트 리스너 안정화.

### 6.4 마운트 후 클라이언트만 그리기

- **ClientLayout**: `isMounted === false`일 때는 빈 플레이스홀더(`<div className="h-screen w-screen bg-background" />`)만 반환. hydration 후 레이아웃이 바뀌는 것을 막고, 서버/클라이언트 불일치 경고를 피함.

### 6.5 이미지

- **next/image**: PostCard, PostContent, SidePanelHeader, MobileHeader, MediaRenderer 등에서 사용. `width={0} height={0} sizes="100vw"`로 반응형 대응.
- **next.config.ts**: `cdn.sanity.io`, `image.mux.com`를 `remotePatterns`에 등록.

---

## 7. 앱 레이어 (app/)

### 7.1 app/layout.tsx

**역할**: 루트 HTML/body, 메타데이터, 폰트/스타일, 전역 Provider, 그리고 **전체 포스트 목록 fetch**.

**주요 코드**

- `POSTS_QUERY`: `_type == "post"`이고 `orderRank` 기준 정렬, 상위 2000개. `imageUrl`은 thumbnail type에 따라 image/video/images[0]에서 선택, `playbackId`는 Mux용.
- `client.fetch<SanityDocument[]>(POSTS_QUERY, {}, { next: { revalidate: 30 } })`로 30초 ISR.
- `AppProvider`로 감싼 뒤 `ClientLayout`에 `posts={posts}`와 `children` 전달.

**문법**

- `Readonly<{ children: React.ReactNode }>`: React 19 타입.
- `export const metadata`: 정적 메타데이터.

### 7.2 app/page.tsx

**역할**: 인덱스 라우트. CV(전시/수상/클라이언트) 데이터만 fetch하고, **전체 UI는 SidePanel 한 개**만 렌더.

**주요 코드**

- `CV_QUERY`: exhibition(날짜 내림차순), awards(날짜 내림차순), clients(고유 client 문자열 배열, 정렬).
- exhibition/award에 `category` 라벨 붙임 (Selected Exhibitions / Award).
- clients 정렬: 한글 먼저, 그 다음 `localeCompare(..., "en", { sensitivity: "base" })`.

**의도**

- “메인 그리드”는 layout의 `ClientLayout`에서 `children`으로 받는 것이 아니라, **ClientLayout이 left에 MainContent를 직접 넣고**, right에 `children`(여기서는 SidePanel)을 넣음. 따라서 **page.tsx의 children은 사실상 SidePanel만** 렌더하는 구조가 됨. (layout이 이미 ClientLayout으로 감싸고, layout의 children이 page이므로, 인덱스일 때 page가 SidePanel을 반환하고, 이게 right 패널에 들어감.)

실제로 layout은:

```tsx
<ClientLayout posts={posts}>{children}</ClientLayout>
```

이고, 인덱스일 때 `children`은 `page.tsx`의 결과이므로 `<SidePanel ... />`. 즉 **left = MainContent, right = SidePanel + (스크롤 영역)** 구조가 ResizableLayout에서 나옴.

### 7.3 app/[slug]/page.tsx

**역할**: 동적 라우트. slug로 단일 post 조회 후 없으면 404, 있으면 PostContent에 전달.

**주요 코드**

- `POST_QUERY`: `*[_type == "post" && slug.current == $slug][0]`.
- `params`는 Promise<{ slug: string }> (Next.js 15+).
- `notFound()`로 404 처리.

---

## 8. 컨텍스트 (context/)

### 8.1 AppContext.tsx

**역할**: 전역 상태와 setter 제공.

**상태 초기화**

- `useState`로 language, activeTab, isFullContentMode, currentPost, isMobile, isMounted, isMobileSidebarOpen, searchTerm, visibleClients 관리.

**effect**

1. 마운트 후: `queueMicrotask` 안에서 `setIsMounted(true)`와 `check()`(isMobile 갱신), resize 리스너 등록. cleanup에서 리스너 제거.
2. `isMobile`이 false가 되면(데스크탑으로 전환) `queueMicrotask`로 `setIsMobileSidebarOpen(false)`.

**useAppContext**

- `useContext(AppContext)`를 사용하고, `undefined`면 에러 throw. Provider 밖에서 쓰이지 않도록 보장.

---

## 9. 훅 (hooks/)

### 9.1 usePage.ts

- **목적**: 필터된 목록에 대한 페이지네이션 + URL 쿼리(`_paged`) 동기화.
- **초기 페이지**: `getInitialPage()`에서 `_paged` 읽어 1 이상이면 사용.
- **setCurrentPage**: state 업데이트 + `updatePageUrl(page)`로 `history.replaceState` 호출.
- **filteredPosts 변경 시**: 첫 렌더가 아니면 `queueMicrotask`로 1페이지로 리셋.
- **paginatedPosts**: `useMemo`로 `(currentPage - 1) * ITEMS_PER_PAGE`부터 slice.

### 9.2 useResponCols.ts

- **목적**: 컨테이너 너비와 `window.innerWidth`에 따라 컬럼 수(cols) 계산.
- **ResizeObserver**: ref된 요소의 `contentRect.width`로, 768px 미만이면 2열, 이상이면 `MIN_COL_WIDTH(300)` 기준 1~6열.
- **반환**: `[containerRef, cols]`. deps는 호출부에서 `[isFullContentMode, isMobile]` 등 전달해 레이아웃 변경 시 재계산 유도.

### 9.3 useInView.ts

- **목적**: 요소가 뷰포트에 들어오면 true로 바꾸고, 한 번 true면 유지(비디오 로드 트리거용).
- **IntersectionObserver**: rootMargin 200px, 한 번 intersecting 되면 `unobserve`.
- **반환**: `[ref, inView]`.

### 9.4 usePostFilter.ts

- **목적**: posts에 대해 검색어/연도/카테고리 필터링, URL(`_categories`) 동기화.
- **검색**: `searchTerm`은 Context, 제목/ client/ category에서 대소문자 무시 검색.
- **연도**: `post.year` 문자열화 후 unique, "Year" 옵션 추가.
- **카테고리**: "All Types" + 고정 CATEGORIES 리스트. 선택 시 `updateCategoryUrl`로 URL 갱신.
- **filteredPosts**: 검색+연도 통과한 뒤, 카테고리로 한 번 더 필터. **availableCategories**는 검색+연도 통과한 포스트들의 category 집합.

### 9.5 useDropdown.ts

- **목적**: 드롭다운 열림/닫힘 + 외부 클릭 시 닫기.
- **상태**: `isOpen`, `setIsOpen`.
- **ref**: 드롭다운 컨테이너에 붙여, mousedown이 ref 밖이면 `setIsOpen(false)`.

### 9.6 useSearch.ts

- **목적**: 검색 입력 포커스 + change/clear 핸들러. Context의 searchTerm/setSearchTerm 래핑.
- **반환**: searchTerm, setSearchTerm, isSearchFocused, setIsSearchFocused, handleSearchChange, clearSearch.

### 9.7 usePostGridLayout.ts

- **목적**: thumbnail_size(small/medium/large)에 따른 비율로 각 카드의 `widthPct` 계산.
- **SIZE_MULTIPLIERS / MOBILE_SIZE_MULTIPLIERS**: PostCard에서 export한 상수 사용.
- **로직**: viewMode가 desktopImg 또는 mobileImg일 때, 행 단위로 slice해서 해당 행의 “총 M”을 구하고, 마지막 행이 짧으면 medium으로 패딩. 각 post의 M 비율로 widthPct 계산.
- **반환**: `{ post, widthPct, rowItemsCount }[]`.

---

## 10. 레이아웃 컴포넌트

### 10.1 ClientLayout.tsx

**역할**: 데스크탑/모바일 분기, 필터 상태와 visibleClients 연동, 모바일에서 상세 오버레이 처리.

**주요 로직**

- `useAppContext`: isMobile, isMounted, setVisibleClients.
- `usePostFilter(posts)`: filterState. filteredPosts, searchTerm, selectedYear, selectedCategory 사용.
- **effect**: 필터가 하나라도 걸려 있으면 filteredPosts에서 client 목록을 추출해 `setVisibleClients` 호출. 아니면 빈 배열.
- **pathname**: `/`가 아니면 포스트 상세 페이지. 모바일이고 포스트 페이지일 때 `activePostContent`에 children(PostContent) 설정.
- **isMounted false**: 플레이스홀더만 렌더.
- **모바일**: MobileHeader, MobileMainContent, 스크롤 ref, 하단 고정 레이어(포스트 상세), MobileTrigger. 포스트가 아닐 때만 MobileSidebar에 children(SidePanel) 전달. 포스트일 때는 오버레이로 activePostContent 표시.
- **데스크탑**: ResizableLayout left=MainContent, right=SidePanelHeader + children 스크롤 영역.

### 10.2 ResizableLayout.tsx

**역할**: 좌우 분할 + 포인터 드래그로 비율 변경.

**상태**: leftWidth(%), isResizing.

**이벤트**

- onPointerDown: setPointerCapture, setIsResizing(true).
- pointermove: MIN_MAIN_PX(600), MIN_SIDE_PX(400) 범위 안에서만 leftWidth 갱신.
- pointerup: setIsResizing(false), releaseCapture.

**렌더**: 왼쪽 div(width: leftWidth%), 가운데 리사이즈 바(세로선 3개), 오른쪽 div(width: 100-leftWidth%). 리사이즈 중일 때 반투명 오버레이로 드래그만 보이게 함.

### 10.3 SidePanel.tsx

**역할**: Contact / CV / Client 탭 콘텐츠.

- **ContactSection**: 언어별 소개 문단 + 주소/이메일/전화/인스타 테이블.
- **CV**: exhibition + award를 합쳐 allCvs. category별로 묶고, type별로 정렬(parseCvDate). CvCategorySection → CvTypeSection → CvItem.
- **ClientSection**: clients 배열을 버튼으로 나열. visibleClients에 있으면 system-gray(dim), 없으면 system-white. 클릭 시 setSearchTerm(client), 모바일이면 사이드바 닫고 `/`로 이동.

**타입**: SideBarProps = { exhibition, award, clients }. Tab은 AppContext에서 import.

### 10.4 SidePanelHeader.tsx

**역할**: 탭 버튼(Contact, CV, Client) + 포스트 페이지일 때 풀스크린 토글.

- **isPostPage**: pathname !== "/" && pathname !== "" && pathname !== null.
- **풀스크린 버튼**: isFullContentMode에 따라 아이콘(contract/expand) 전환. next/image 사용.
- **탭 클릭**: setActiveTab(tab), pathname이 `/`가 아니면 router.push("/").

### 10.5 MobileHeader.tsx

**역할**: 모바일 상단 고정. 로고, 언어 전환, 필터(검색/카테고리/연도/뷰 모드).

- **FilterState**: filterState가 없을 수 있으므로 optional. setSearchTerm 등은 optional chaining으로 호출.
- **useSearch**: handleSearchChange 등.
- **useDropdown**: 카테고리/연도 각각 isOpen, setIsOpen, dropdownRef.
- **로고 클릭**: setIsFullContentMode(false), setCurrentPost(null), 필터 리셋, window.location.href로 루트 이동(현재 Vercel URL 하드코딩).
- **뷰 모드**: mobileImg / list 버튼(mask-image로 아이콘). next/image는 검색/리셋/드롭다운 아이콘에 사용.

### 10.6 MobileSidePanel.tsx

**역할**: 모바일에서 Contact/CV/Client 패널. 슬라이드 인/아웃 + 백드롭.

- **구조**: 백드롭(클릭 시 닫기), 상단 보더용 div, 패널 div(translate-x). isMobileSidebarOpen으로 opacity/pointer-events, transform 제어.
- **탭**: SidePanelHeader와 동일한 탭 목록, handleTabClick으로 setActiveTab + 필요 시 router.push("/").
- **children**: SidePanel 본문(Contact/CV/Client 콘텐츠).

---

## 11. 메인 콘텐츠 컴포넌트

### 11.1 MainContent.tsx

**역할**: 데스크탑 메인 영역. 헤더, 필터, 그리드/리스트, 풀스크린 상세, 페이지네이션.

**상태/훅**

- filterState(usePostFilter 결과), viewMode(desktopImg | list), useSearch, usePage(filteredPosts ?? []), useDropdown(연도), useResponCols, usePostGridLayout(paginatedPosts, cols, viewMode).

**렌더 분기**

1. **isFullContentMode && currentPost**: 제목/메타/카테고리 + (currentPost.media || []).map → MediaRenderer. 스크롤 영역만.
2. **그 외**:  
   - 상단: 로고 링크, 언어, 이메일.  
   - 필터: 카테고리 태그 리스트, 뷰 모드 버튼(img/list).  
   - 검색/연도/결과 수+리셋: 그리드 4열.  
   - 그리드/리스트: viewMode에 따라 className과 style(columnGap, rowGap) 변경. renderedPosts.map → PostCard.  
   - Pagination: onPageChange에서 setCurrentPage + containerRef.current?.scrollTo({ top: 0 }).

**FilterState**: searchTerm, setSearchTerm, selectedYear, setSelectedYear, selectedCategory, setSelectedCategory, uniqueYears, filteredPosts, availableCategories. optional이므로 ?? [], ?.() 사용.

### 11.2 MobileMainContent.tsx

**역할**: 모바일 메인. 결과 수, 그리드/리스트, PostCard 목록, 페이지네이션.

- **usePage(filteredPosts || posts)**.
- **usePostGridLayout**: cols=2, viewMode, isMobile=true.
- **렌더**: 결과 수 텍스트, viewMode에 따른 flex 레이아웃, renderedPosts.map → PostCard. Pagination onPageChange에서 scrollToTop?.().

---

## 12. 포스트 관련 컴포넌트

### 12.1 PostCard.tsx

**역할**: 한 포스트의 카드/리스트 셀. 썸네일(이미지 또는 Mux 지연 로드), 제목, 카테고리, publishedAt, client(리스트 뷰).

**상수**

- SIZE_MULTIPLIERS, MOBILE_SIZE_MULTIPLIERS (usePostGridLayout에서도 사용).

**로직**

- **useInView**: cardRef, inView. inView이고 playbackId가 있으면 loadedVideos에 넣어 두고, 이후에는 항상 비디오 렌더.
- **Mux 썸네일 URL**: `https://image.mux.com/${playbackId}/thumbnail.webp?width=480&time=0`.
- **viewMode**: list일 때 리스트용 클래스/컬럼, 그 외 그리드. isMobile에 따라 max-md / md 클래스 분리.
- **style**: 그리드일 때 widthPct, rowItemsCount로 flex 비율 계산.
- **Link**: href=`/${post.slug?.current || ""}`.
- **리스트 뷰**: searchTerm과 post.client가 같으면 system-gray(클라이언트 탭에서 선택된 것과 시각적 일치).

**이미지**: next/image, width={0} height={0} sizes="100vw", alt는 언어별 제목.

### 12.2 PostContent.tsx

**역할**: 포스트 상세. 제목, 날짜, 카테고리, 미디어(MediaRenderer), PortableText 설명, additional_link.

**props**: post, isMobile(optional). context의 isMobile과 합쳐 mobile 판단.

**effect**

- 데스크탑일 때: setCurrentPost(post), cleanup에서 setCurrentPost(null), setIsFullContentMode(false).
- contentRef 높이: description/isExpanded/language 변경 시 setContentHeight(scrollHeight).

**모바일 레이아웃**: 단일 열, 제목/날짜/카테고리, media.map → MediaRenderer, renderDescription().

**데스크탑 레이아웃**:  
- isFullContentMode가 아니면: 스크롤 영역(제목, 메타, 미디어) + 하단 그라데이션 + 설명 패널(높이 70px 또는 contentHeight 또는 100%).  
- 설명 패널 클릭 시 isExpanded 토글(풀스크린이 아닐 때). 화살표 아이콘으로 회전.

**renderDescription**: PortableText + block.normal에서 줄바꿈을 <br /> + spacer로 처리. additional_link는 배열이면 map, 단일 문자열이면 한 개 링크.

**MediaItem**: image / mux.video / youtube 유니온. media.map에서 item을 MediaRenderer에 전달할 때 any 단언 사용(PostContent 219, 221 등).

### 12.3 MediaRenderer.tsx

**역할**: Sanity 미디어 블록 한 개를 image / mux.video / youtube로 렌더.

- **image**: urlFor(item)?.url(), next/image, showCaption이면 figcaption.
- **mux.video**: asset.playbackId로 MuxPlayer, aspectRatio는 isMobile이면 1/1, 아니면 16/9.
- **youtube**: url에서 정규식으로 video id 추출, iframe embed. isMobile이면 aspect-video rounded-sm.

**MediaItem**: _type, _key, caption, asset, url, image 등. [key: string]: any로 유연하게 받음.

### 12.4 CategoryTag.tsx

**역할**: categories 배열을 칩 형태로 표시. CATEGORY_COLORS, CATEGORIES export.

- **React.memo**로 감싸고, categories/className만 받음.
- displayName "CategoryTag" 설정.

---

## 13. 공통 컴포넌트

### 13.1 Pagination.tsx

**역할**: currentPage, totalPages, onPageChange, className. totalPages <= 1이면 null.

**로직**: 1, ..., currentPage 주변 5개, ..., totalPages 형태. "..."는 span, 숫자는 button. 이전/다음 버튼(〈/〉). 클릭 시 onPageChange(page).

### 13.2 MobileTrigger.tsx

**역할**: 모바일에서 고정된 우측 하단 버튼. 포스트 페이지면 “닫기”(/)로 이동, 아니면 사이드바 토글.

- **handleClick**: isPostPage면 router.push("/"). 아니면 isMobileSidebarOpen이면 닫고, 열려 있지 않으면 연다.
- **isRotated**: isPostPage || isMobileSidebarOpen. 아이콘(plus.svg)에 rotate-135 적용.
- next/image로 아이콘.

---

## 14. 주요 기능 및 문법 정리

### 14.1 Next.js App Router

- **layout.tsx**: 루트에서 한 번만 실행되는 레이아웃과 데이터 fetch. children에 page가 들어감.
- **page.tsx**: 라우트별 UI. 인덱스는 SidePanel만, [slug]는 PostContent만 반환.
- **동적 라우트**: params가 Promise이므로 `await params` 후 사용. notFound()로 404.

### 14.2 Sanity

- **createClient**: projectId, dataset, apiVersion, useCdn: false.
- **GROQ**: select(조건 => 값), array::unique, order, [0...N].
- **이미지**: imageUrlBuilder({ projectId, dataset }).image(source).url().

### 14.3 React 19 / TypeScript

- **Readonly<{ children: React.ReactNode }>**: layout props.
- **queueMicrotask**: effect 내 setState를 비동기로 실행해 경고 회피.
- **useCallback / useMemo**: 이벤트 핸들러와 파생 배열 안정화.

### 14.4 접근성·시맨틱

- **alt**: 이미지에 언어별 제목 또는 "Toggle Full Mode", "Search" 등 명시.
- **button/link 구분**: 실제 이동은 Link, 토글/필터는 button.

### 14.5 CSS·Tailwind

- **globals.css**: @theme inline으로 color, font-size, font-family 매핑. no-scrollbar 등 유틸 클래스.
- **z-index**: z-40, z-50, z-80, z-100, z-500, z-1000 등으로 레이어 구분.

---

## 15. 결론 및 권장사항

### 15.1 강점

- **단일 Context**: 전역 상태가 한 곳에 모여 있어 추적이 쉽고, 필터/페이지는 훅으로 분리되어 재사용과 테스트가 용이함.
- **서버 데이터 한 번 로드**: layout/page에서만 fetch하고, 클라이언트는 필터/페이지/그리드 계산만 하여 네트워크 비용이 적음.
- **지연 로드**: PostCard의 useInView + MuxPlayer로 초기 로드와 메모리 사용을 줄임.
- **타입**: SanityDocument, MediaItem, FilterState 등으로 런타임 오류를 줄이고, Mux style 단언으로 라이브러리 제약을 우회함.

### 15.2 개선 여지

- **FilterState 타입**: 여러 파일에 흩어진 인터페이스를 한 모듈에서 export해 일치시키기.
- **MediaItem any**: MediaRenderer/PostContent에서 item 타입을 유니온으로 통일하고 any 제거.
- **모바일 로고 링크**: window.location.href 대신 router.push("/") + 필터 리셋으로 SPA 유지.
- **next/image**: 가능한 곳에서 계속 사용하고, remotePatterns는 이미 설정됨.

### 15.3 유지보수 시 참고

- **브레이크포인트**: 1194(모바일 레이아웃), 768(useResponCols 모바일 열 수). 변경 시 두 곳 모두 확인.
- **페이지 크기**: usePage의 ITEMS_PER_PAGE(20). 변경 시 Pagination UI와 일치하는지 확인.
- **카테고리 목록**: CategoryTag의 CATEGORIES와 usePostFilter의 CATEGORIES 동일 유지.

---

*본 보고서는 nextjs-ep-web 프로젝트의 TSX/TS 파일을 기반으로 상태 설계, 구조, 타입, 렌더링 최적화, 컴포넌트별 역할을 정리한 문서입니다.*
