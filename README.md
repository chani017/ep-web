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

### 3. 실행

```bash
npm run dev
# http://localhost:3000 접속
```

---

## 기술 스택 및 선정 이유

### **Frontend: Next.js 16 (App Router)**

- **선정 이유**: 방대한 이미지 데이터를 빠르고 효율적으로 처리해야 하는 아카이브 사이트의 특성을 고려하여, 우수한 성능과 유지보수의 용이성을 모두 갖춘 Next.js를 선택했습니다. 특히 서버 컴포넌트를 활용한 초기 로딩 최적화와 SEO 성능이 프로젝트에 적합하다고 판단했습니다.

### **CMS: Sanity.io**

- **선정 이유**: 정형화된 템플릿이 아닌, 다양한 미디어 타입과 커스텀 정렬 로직 등, 프로젝트의 고유한 데이터 구조를 스스로 정의할 수 있는 유연한 스키마 구조를 지원한다는 점에서 선택했습니다. 저는 orderRank 등을 사용하여 드래그 정렬 기능을 새롭게 추가하여 아카이브 자료의 순서를 편하게 정리할 수 있도록 하였습니다.

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/2d9d5894-10ec-4839-83fb-e00939e41e48" 
    alt="preview image"
    width="300"
  />
</p>

### **Styling: Tailwind CSS 4**

- **선정 이유**: grobal CSS 변수(`@theme`)를 활용한 디자인 시스템 구축이 용이하고, 클래스 기반 스타일링으로 개발 생산성을 높이기 위해 선택했습니다.

### **Utility Libraries: clsx, tailwind-merge, cva**

- **선정 이유**: Tailwind CSS를 사용하면서 발생하는 클래스 충돌 문제를 해결하고, 반응형 설계에 따른 복잡한 조건부 스타일링을 효율적으로 관리하기 위해 도입했습니다.
- **clsx & tailwind-merge**: 조건에 따라 클래스를 조합하고, 충돌하는 Tailwind 클래스를 정리하기 위해 사용했습니다. 두 라이브러리를 묶어 cn 유틸 함수로 만들어 일관되게 관리했습니다.
- **cva (Class Variance Authority)**: 스타일 분기를 조건문이 아닌 선언적인 방식으로 관리하기 위해 도입했습니다. PostCard의 레이아웃 변형을 명확히 분리하여 유지보수성을 개선했습니다.

### **영상 스트리밍: Mux Video API**

- **선정 이유**: 일상의실천의 장점인 고화질의 모션 포스터를 웹에서도 끊김 없이 제공하기 위해, 적응형 비트레이트 스트리밍(HLS)을 지원하는 Mux를 도입했습니다. 특히 Sanity와도 플러그인 연동이 잘 되어있기 때문에, 파일 업로드 및 관리에도 매우 수월합니다.

---

## 프로젝트 구조

```bash
src/
├── 📂 app/                # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃 (posts fetch, AppProvider, ClientLayout)
│   ├── page.tsx           # 인덱스 페이지 (CV 데이터 fetch, SidePanel)
│   ├── [slug]/page.tsx    # 포스트 상세 (단일 post fetch, PostContent)
│   └── globals.css        # Tailwind, 폰트, CSS 변수
├── 📂 context/
│   └── AppContext.tsx     # 전역 상태 (언어, 탭, 풀스크린, 모바일, 사이드바 등)
├── 📂 hooks/
│   ├── usePage.ts         # 페이지네이션 + URL 동기화
│   ├── usePostFilter.ts   # 검색/연도/카테고리 필터
│   ├── useResponCols.ts   # ResizeObserver 기반 컬럼 수
│   ├── useInView.ts       # Lazy Loading 지연 로드
│   ├── useDropdown.ts     # 외부 클릭 시 드롭다운 닫기
│   ├── useSearch.ts       # 검색 포커스/핸들러
│   └── usePostGridLayout.ts # 그리드 비율 계산 (thumbnail_size 기반)
├── 📂 sanity/
│   └── client.ts          # Sanity 클라이언트 설정
├── 📂 components/
│   ├── 📂 layout/            # 레이아웃·네비게이션
│   │   ├── ClientLayout.tsx   # isMobile 분기, 데스크탑/모바일 구조
│   │   ├── ResizableLayout.tsx # 좌우 분할 + 드래그 리사이즈
│   │   ├── SidePanel.tsx      # Contact/CV/Client 사이드 패널 콘텐츠
│   │   ├── SidePanelHeader.tsx # 사이드 패널 헤더(탭 버튼 + 풀스크린 토글)
│   │   ├── MobileHeader.tsx   # 모바일 상단(로고, 언어, 필터)
│   │   └── MobileSidePanel.tsx # 모바일 슬라이드 사이드바
│   ├── 📂 main/              # 메인 그리드/리스트
│   │   ├── MainContent.tsx    # 데스크탑: 헤더, 필터, 그리드, 페이지네이션
│   │   └── MobileMainContent.tsx # 모바일: 결과 수, 그리드, 페이지네이션
│   ├── 📂 post/              # 포스트 단위 UI
│   │   ├── PostCard.tsx       # 그리드/리스트 셀 (썸네일, 제목, 카테고리)
│   │   ├── PostContent.tsx    # 프로젝트 세부내용: 제목, 미디어, PortableText, 링크
│   │   ├── MediaRenderer.tsx  # image / mux.video / youtube 분기 렌더
│   │   └── CategoryTag.tsx    # 카테고리 태그 정보(컬러, 텍스트 등)
│   └── 📂 common/
│       ├── Pagination.tsx     # 페이지 번호 + 이전/다음
│       └── MobileTrigger.tsx  # 모바일 메뉴/닫기 플로팅 버튼
```

## CMS 구조 및 설계 의도 (Schema Design)

Sanity Studio는 데이터의 성격에 따라 **메인 포트폴리오**와 **아카이브 정보**로 구분하여 설계했습니다.

### 1. `postType.ts` (메인 포트폴리오)

가장 핵심이 되는 프로젝트 데이터입니다.

- **title_kr / title_en**
  - 국문·영문 제목을 분리하여 다국어 환경에 대응하고, 각 언어가 독립적인 정보 단위로 기능하도록 구성했습니다.
- **slug**
  - 프로젝트별 고유 URL을 생성하기 위한 필드로, 제목과는 분리된 영속적인 경로 체계를 유지하도록 설계했습니다.
- **year**
  - 작업의 제작 시기를 간결하게 표기하기 위한 필드로, 날짜 기반 데이터가 아닌 전시 캡션 형식의 연도 표기를 목적으로 구현했습니다.
- **client**
  - 클라이언트 정보를 별도로 분리했습니다. 이 필드 데이터는 사이드 패널의 CV 항목과도 연결되어 CV 내의 클라이언트 목록을 클릭하면 해당 프로젝트들을 연동하는 기능을 구현하는데 사용됐습니다.
- **category**
  - 프로젝트 카테고리로, 각 프로젝트의 카테고리를 표시하고 태깅을 하는데에 사용되는 정보입니다. 카테고리 정보를 기반으로 검색 혹은 연도 순 정렬 기능을 사용할 때, 그 목록에 카테고리에 해당하는 프로젝트가 없으면 그 부분을 시각적으로 구분해주는 기능에 사용됐습니다.
- **thumbnail**
  - 썸네일을 이미지 또는 Mux 비디오 중 선택 가능하도록 설계하여, 프로젝트의 성격에 맞는 대표 시각 요소를 유연하게 설정할 수 있도록 했습니다.
- **thumbnail_size**
  - Small / Medium / Large 옵션을 통해 썸네일의 시각적 비중을 조절할 수 있도록 하여, 그리드 뷰의 리듬과 밀도를 CMS에서 제어할 수 있게 구현했습니다.
- **media**
  - 이미지와 유튜브를 하나의 배열 안에서 자유롭게 순서를 배치할 수 있도록 유연하게 설계했습니다.
- **description_kr / description_en**
  - Portable Text 기반으로 구성하여 단순 텍스트를 넘어 구조화된 문단 및 확장 가능한 콘텐츠 작성을 지원하도록 설계했습니다.
- **additional_link**
  - 프로젝트 추가 링크로, 외부 기사, 전시 링크 등 프로젝트와 관련된 외부 링크를 추가할 수 있도록 설계했습니다. 프로젝트와 관련된 외부 링크가 여러 개일 수 있음을 고려하여 배열(Array) 형태로 구현했습니다.

<details>
<summary><b>postType.ts 코드 보기</b></summary>

```typescript
import {defineField, defineType} from 'sanity'
import {ThumbnailSizeField} from './components/ThumbnailSizeField'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const postType = defineType({
  name: 'post',
  title: '프로젝트',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'post'}),
    defineField({
      name: 'title_kr',
      title: '제목 (국문)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: '제목 (영문)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL 슬러그',
      type: 'slug',
      options: {source: 'title_kr'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: '연도',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: '클라이언트',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: '카테고리',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Graphic', value: 'Graphic'},
              {title: 'Editorial', value: 'Editorial'},
              {title: 'Website', value: 'Website'},
              {title: 'Identity', value: 'Identity'},
              {title: 'Space', value: 'Space'},
              {title: 'Practice', value: 'Practice'},
              {title: 'Motion', value: 'Motion'},
              {title: 'Press', value: 'Press'},
              {title: 'Everyday', value: 'Everyday'},
            ],
          },
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: 'thumbnail',
      title: '썸네일 (이미지 또는 비디오)',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: '종류',
          type: 'string',
          options: {
            list: [
              {title: '이미지', value: 'image'},
              {title: '비디오', value: 'video'},
            ],
            layout: 'radio',
          },
          initialValue: 'image',
        },
        {
          name: 'image',
          title: '이미지',
          type: 'image',
          hidden: ({parent}) => parent?.type !== 'image',
        },
        {
          name: 'video',
          title: '비디오',
          type: 'mux.video',
          hidden: ({parent}) => parent?.type !== 'video',
        },
      ],
    }),
    defineField({
      name: 'thumbnail_size',
      title: '썸네일 크기',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'medium',
      components: {
        field: ThumbnailSizeField,
      },
    }),
    defineField({
      name: 'media',
      title: '미디어 갤러리',
      type: 'array',
      of: [
        {
          name: 'image',
          title: '이미지',
          type: 'image',
          options: {hotspot: true},
        },
        {
          type: 'object',
          name: 'youtube',
          title: '유튜브 비디오',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: '유튜브 주소',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'description_kr',
      title: '내용 (국문)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'description_en',
      title: '내용 (영문)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'additional_link',
      title: '추가 링크',
      type: 'array',
      of: [{type: 'url'}],
    }),
  ],
  preview: {
    select: {
      title: 'title_kr',
      subtitle: 'client',
      media: 'thumbnail.image',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title,
        subtitle: subtitle,
        media: media,
      }
    },
  },
})
```

</details>

<br />

### 2. `exhibitionType.ts` & `awardType.ts` (CV)

사이드 패널(CV)에 노출되는 텍스트 위주의 아카이브 정보입니다.

- **분리 이유**: 메인 `post`와 성격이 다른 목록형 데이터이므로, 관리 효율을 위해 별도 타입으로 분리했습니다.
- **필드 구성**: `date` (YYYY.MM) 필드를 활용해 Figma와 동일한 과거순 정렬을 자동화해서 구현했습니다.

---

## 기타

- 이번 과제를 하면서 대량의 데이터들을 사전에 테스트해보기에는 양이 너무 많아 Sanity에서 더미 데이터들을 한번에 만들어낼 수 있는 스크립트를 만들어보았습니다. 다른 프로젝트를 테스트해볼 때도 유용할 것 같아 기록합니다.

<details>
<summary><b>스크립트 코드 보기</b></summary>

```javascript
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'f7s9b9q3',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: '', // 여기에 Write 권한이 있는 토큰을 넣으세요
})

const CATEGORIES = [
  'Graphic',
  'Editorial',
  'Website',
  'Identity',
  'Space',
  'Practice',
  'Motion',
  'Press',
  'Everyday',
]

const CLIENTS = [
  'Samsung',
  'Apple',
  'Google',
  'Naver',
  'Kakao',
  'Hyundai',
  'LG',
  'Everyday Practice',
  'National Museum of Korea',
  'Seoul Museum of Art',
]

async function generateDummyData() {
  console.log('Fetching current state...')
  const maxRankQuery =
    '*[_type == "post" && defined(orderRank)] | order(orderRank desc)[0].orderRank'
  const maxRank = await client.fetch(maxRankQuery)
  console.log('Current Max OrderRank:', maxRank || 'None')

  // 기존 데이터 이후로 오도록 접두사 설정
  // 만약 이미 z| 로 시작하는 데이터가 있다면 그 뒤로 붙임
  const timestamp = Date.now()

  console.log(`Generating 300 dummy posts using timestamp ${timestamp}...`)

  const transaction = client.transaction()

  for (let i = 1; i <= 300; i++) {
    const title_kr = `더미 프로젝트 ${timestamp}-${i}`
    const title_en = `Dummy Project ${timestamp}-${i}`
    const slug = `dummy-project-${timestamp}-${i}`
    const year = (Math.floor(Math.random() * (2025 - 2015 + 1)) + 2015).toString()
    const clientName = CLIENTS[Math.floor(Math.random() * CLIENTS.length)]

    // 1~3개의 랜덤 카테고리 선택
    const randomCategories = Array.from(
      {length: Math.floor(Math.random() * 3) + 1},
      () => CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    )
    const uniqueCategories = [...new Set(randomCategories)]

    // orderRank 생성:
    // 기존 maxRank가 z| 로 시작하면 그 숫자를 파싱해서 더하거나,
    // 그냥 타임스탬프를 활용하여 항상 고유하고 정렬 가능하게 만듭니다.
    const doc = {
      _type: 'post',
      _id: `dummy-post-${timestamp}-${i}`, // ID에 타임스탬프를 추가하여 고유성 확보
      title_kr,
      title_en,
      slug: {
        _type: 'slug',
        current: slug,
      },
      year,
      client: clientName,
      category: uniqueCategories,
      orderRank: `z|${timestamp}|${i.toString().padStart(3, '0')}`, // 타임스탬프 기반 순서로 중복 방지 및 추가 시 뒤로 배치
      thumbnail_size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
      // 실제 이미지/비디오 데이터가 없으므로 썸네일 객체는 생략하거나 빈 상태로 둡니다.
    }

    transaction.createOrReplace(doc)

    // 50개마다 트랜잭션 제출 (Sanity 제한 방지)
    if (i % 50 === 0) {
      await transaction.commit()
      console.log(`Committed ${i} documents...`)
      transaction.reset()
    }
  }

  try {
    const result = await transaction.commit()
    console.log('Successfully generated all dummy data!')
  } catch (err) {
    console.error('Error generating dummy data:', err.message)
    console.log(
      '\n[!] 필독: Sanity 관리자 페이지(Manage) -> API -> Tokens에서 "Write" 권한이 있는 토큰을 생성하여 스크립트에 넣었는지 확인해주세요.',
    )
  }
}

generateDummyData()
```

### 실행

```bash
node generateDummyData.js
```

</details>

## 배포 URL

- https://ep-web-three.vercel.app/
