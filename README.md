# 일상의실천 프론트엔드 사전과제

'일상의실천'의 웹 아카이브 클론 과제물입니다. Next.js 16과 Sanity CMS를 활용하여 구축되었습니다.

## 프로젝트 실행 방법

### 1. 설치

```bash
# 레포지토리 클론
git clone https://github.com/chani017/ep-web.git

# Frontend 의존성 설치
cd ep-web/nextjs-ep-web
npm install
```

### 2. 환경 변수 설정 (.env.local)

프로젝트 루트(`nextjs-ep-web/`)에 `.env.local` 파일을 생성하고 아래 내용을 그대로 붙여넣어 주세요.
(공개된 `dataset`이므로 별도의 인증 없이 바로 데이터를 불러올 수 있습니다.)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=f7s9b9q3
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-02-06
```

### 3. 실행 (Run)

```bash
npm run dev
# http://localhost:3000 접속
```

---

## 기술 스택 및 선정 이유

### **Frontend: Next.js 16 (App Router)**

- **선정 이유**: 방대한 이미지 데이터를 빠르고 효율적으로 처리해야 하는 아카이브 사이트의 특성을 고려하여, 우수한 성능과 유지보수의 용이성을 모두 갖춘 Next.js를 선택했습니다. 특히 서버 컴포넌트를 활용한 초기 로딩 최적화와 SEO 성능이 프로젝트에 적합하다고 판단했습니다.

### **CMS: Sanity.io**

- **선정 이유**: 정형화된 템플릿이 아닌, 스스로 정리할 수 있는 스키마를 통해 프로젝트의 고유한 데이터 구조(다양한 미디어 타입, 커스텀 정렬 로직 등)를 자유롭게 정의할 수 있어 선택했습니다. 저는 orderRank 등을 사용하여 드래그 정렬 기능을 새롭게 추가하여 아카이브 자료의 순서를 편하게 정리할 수 있도록 하였습니다.

### **Styling: Tailwind CSS 4**

- **선정 이유**: grobal CSS 변수(`@theme`)를 활용한 디자인 시스템 구축이 용이하고, 클래스 기반 스타일링으로 개발 생산성을 높이기 위해 선택했습니다.

### **영상 스트리밍: Mux Video API**

- **선정 이유**: 일상의실천의 장점인 고화질의 모션 포스터를 웹에서도 끊김 없이 제공하기 위해, 적응형 비트레이트 스트리밍(HLS)을 지원하는 Mux를 도입했습니다. 특히 Sanity와도 플러그인 연동이 잘 되어있기 때문에, 파일 업로드 및 관리에도 매우 수월합니다.

---

## 프로젝트 구조

```bash
📦 ep-web
├── 📂 nextjs-ep-web (Frontend)
│   ├── 📂 src
│   │   ├── 📂 app          # 앱 라우터 (페이지, 레이아웃)
│   │   ├── 📂 components   # UI 컴포넌트 (재사용 가능)
│   │   │   ├── 📂 common   # 공통 컴포넌트 (페이지네이션 등)
│   │   │   ├── 📂 layout   # 레이아웃 컴포넌트 (헤더, 사이드바 등)
│   │   │   ├── 📂 main     # 메인 콘텐츠 컴포넌트
│   │   │   └── 📂 post     # 포스트 관련 컴포넌트 (카드, 디테일)
│   │   ├── 📂 constants    # 상수 데이터 (색상, 카테고리 등)
│   │   ├── 📂 context      # 전역 상태 관리 (AppContext)
│   │   ├── 📂 hooks        # 커스텀 훅 (비즈니스 로직)
│   │   ├── 📂 sanity       # Sanity 클라이언트 설정
│   │   └── ...
│   └── ...
└── 📂 studio-ep-web (Headless CMS)
    ├── 📂 schemaTypes      # 콘텐츠 스키마 정의
    └── ...
```

## CMS 구조 및 설계 의도 (Schema Design)

Sanity Studio는 데이터의 성격에 따라 **메인 포트폴리오**와 **아카이브 정보**로 구분하여 설계했습니다.

### 1. `post` (메인 포트폴리오)

가장 핵심이 되는 프로젝트 데이터입니다.

- **title_kr / title_en**: 국문·영문 제목을 분리하여 다국어 환경에 대응하고, 각 언어가 독립적인 정보 단위로 기능하도록 구성했습니다.
- **slug**: 프로젝트별 고유 URL을 생성하기 위한 필드로, 제목과는 분리된 영속적인 경로 체계를 유지하도록 설계했습니다.
- **year**: 작업의 제작 시기를 간결하게 표기하기 위한 필드로, 날짜 기반 데이터가 아닌 전시 캡션 형식의 연도 표기를 목적으로 구현했습니다.
- **client**: 상업 프로젝트 및 협업 작업의 맥락을 명확히 드러내기 위해 클라이언트 정보를 별도로 분리했습니다. 이 필드 데이터는 사이드 패널의 CV 항목과도 연결되어 CV 내의 클라이언트 목록을 클릭하면 해당 프로젝트들을 연동하는 기능을 구현하는데 사용됐습니다.
- **category**: 프로젝트 카테고리로, 각 프로젝트의 카테고리를 표시하고 태깅을 하는데에 사용되는 정보입니다. 카테고리 정보를 기반으로 검색 혹은 연도 순 정렬 기능을 사용할 때, 그 목록에 카테고리에 해당하는 프로젝트가 없으면 그 부분을 시각적으로 구분해주는 기능에 사용됐습니다.
- **thumbnail**: 썸네일을 이미지 또는 Mux 비디오 중 선택 가능하도록 설계하여, 프로젝트의 성격에 맞는 대표 시각 요소를 유연하게 설정할 수 있도록 했습니다.
- **thumbnail_size**: Small / Medium / Large 옵션을 통해 썸네일의 시각적 비중을 조절할 수 있도록 하여, 그리드 뷰의 리듬과 밀도를 CMS에서 제어할 수 있게 구현했습니다.
- **media**: 이미지와 유튜브를 하나의 배열 안에서 자유롭게 순서를 배치할 수 있도록 유연하게 설계했습니다.
- **description_kr / description_en**: Portable Text 기반으로 구성하여 단순 텍스트를 넘어 구조화된 문단 및 확장 가능한 콘텐츠 작성을 지원하도록 설계했습니다.
- **additional_link**: 프로젝트 추가 링크로, 외부 기사, 전시 링크 등 프로젝트와 관련된 외부 링크를 추가할 수 있도록 설계했습니다. 프로젝트와 관련된 외부 링크가 여러 개일 수 있음을 고려하여 배열(Array) 형태로 구현했습니다.

<details>
<summary><b>postType.ts 코드 보기</b></summary>

```typescript
import { defineField, defineType } from "sanity";
import { ThumbnailSizeField } from "./components/ThumbnailSizeField";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

export const postType = defineType({
  name: "post",
  title: "프로젝트",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "post" }),
    defineField({
      name: "title_kr",
      title: "제목 (국문)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title_en",
      title: "제목 (영문)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL 슬러그",
      type: "slug",
      options: { source: "title_kr" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "연도",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "클라이언트",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Graphic", value: "Graphic" },
              { title: "Editorial", value: "Editorial" },
              { title: "Website", value: "Website" },
              { title: "Identity", value: "Identity" },
              { title: "Space", value: "Space" },
              { title: "Practice", value: "Practice" },
              { title: "Motion", value: "Motion" },
              { title: "Press", value: "Press" },
              { title: "Everyday", value: "Everyday" },
            ],
          },
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: "thumbnail",
      title: "썸네일 (이미지 또는 비디오)",
      type: "object",
      fields: [
        {
          name: "type",
          title: "종류",
          type: "string",
          options: {
            list: [
              { title: "이미지", value: "image" },
              { title: "비디오", value: "video" },
            ],
            layout: "radio",
          },
          initialValue: "image",
        },
        {
          name: "image",
          title: "이미지",
          type: "image",
          hidden: ({ parent }) => parent?.type !== "image",
        },
        {
          name: "video",
          title: "비디오",
          type: "mux.video",
          hidden: ({ parent }) => parent?.type !== "video",
        },
      ],
    }),
    defineField({
      name: "thumbnail_size",
      title: "썸네일 크기",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
      },
      initialValue: "medium",
      components: {
        field: ThumbnailSizeField,
      },
    }),
    defineField({
      name: "media",
      title: "미디어 갤러리",
      type: "array",
      of: [
        {
          name: "image",
          title: "이미지",
          type: "image",
          options: { hotspot: true },
        },
        {
          type: "object",
          name: "youtube",
          title: "유튜브 비디오",
          fields: [
            {
              name: "url",
              type: "url",
              title: "유튜브 주소",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "description_kr",
      title: "내용 (국문)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "description_en",
      title: "내용 (영문)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "additional_link",
      title: "추가 링크",
      type: "array",
      of: [{ type: "url" }],
    }),
  ],
  preview: {
    select: {
      title: "title_kr",
      subtitle: "client",
      media: "thumbnail.image",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title,
        subtitle: subtitle,
        media: media,
      };
    },
  },
});
```

</details>

<br />

### 2. `exhibition` & `award` (CV)

사이드 패널(CV)에 노출되는 텍스트 위주의 정보입니다.

- **분리 이유**: 메인 `post`와 성격이 다른 목록형 데이터이므로, 관리 효율을 위해 별도 타입으로 분리했습니다.
- **필드 구성**: `date` (YYYY.MM) 필드를 활용해 Figma와 동일한 과거순 정렬을 자동화해서 구현했습니다.

---

## 주요 구현 기능 (Key Features)

1. **지속성 있는 뷰 전환**
   - 리스트 뷰 ↔ 그리드 뷰 전환 시, 컴포넌트를 언마운트하지 않고 CSS로 스타일만 변경하여 Mux가 재로딩되지않고 동영상 재생 상태가 부드럽게 유지되도록 구현했습니다.

2. **URL 동기화 필터링**
   - 카테고리/연도 필터 상태를 URL 쿼리 파라미터와 동기화하여, 새로고침이나 링크 공유 시에도 상태가 유지됩니다.

3. **기능별 커스텀 훅 / 컴포넌트 분리**
   - 기능별로 커스텀 훅과 컴포넌트를 분리하여 재사용성을 높였습니다.

---

## 기타

- CMS에 구축된 데이터를 기반으로 프론트엔드를 구현했기때문에 사이드 패널의 Client 목록이 Figma 보다 적게 구현된 점 참고해주시길 바랍니다.
- 현재의 데이터 양으로는 페이지네이션이 완벽하게 구현되었다 어렵다고 보기 때문에, 평가에 영향이 없다면 제출 완료 기한까지 남은 시간동안 CMS 데이터를 충분한 양만큼 추가해보겠습니다.

## 배포 URL

- https://ep-web-three.vercel.app/
