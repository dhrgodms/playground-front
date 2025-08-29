# Playground - 개인 콘텐츠 관리 블로그

## 프로젝트 소개

Playground는 다양한 형태의 콘텐츠를 관리하고 공유할 수 있는 블로그 입니다. React와 Chakra UI를 기반으로 구축되었습니다.

## 주요 기능

###  콘텐츠 관리
- **생각글**: 개인적인 생각과 고민을 나누는 글
- **일상만화**: 만화와 그림 관련 콘텐츠
- **마크다운**: 마크다운 형식의 문서
- **파일**: 다양한 파일 업로드 및 관리
- **플레이리스트**: 음악 플레이리스트 공유

### 사용자 시스템
- 관리자 권한을 통한 콘텐츠 관리
- 게스트북을 통한 방문자 소통

### 태그 시스템
- 카테고리별 콘텐츠 분류
- 태그 기반 콘텐츠 필터링
- 시각적 태그 아이콘 및 색상 구분

## 기술 스택

### Frontend
- **React 18.2.0** - 사용자 인터페이스 구축
- **Chakra UI 2.7.0** - 컴포넌트 라이브러리
- **React Router DOM 6.11.2** - 라우팅
- **Axios 1.4.0** - HTTP 클라이언트
- **Framer Motion 10.12.16** - 애니메이션

### Development Tools
- **Webpack 5.89.0** - 모듈 번들러
- **Babel** - JavaScript 컴파일러
- **Markdown Loader** - 마크다운 파일 지원
- **File Loader** - 파일 업로드 지원

## 프로젝트 구조

```
src/
├── Articles/           # 포스트 관련 컴포넌트
│   ├── LoginForm.jsx   # 로그인 폼
│   ├── SignUpForm.jsx  # 회원가입 폼
│   └── Post/          # 포스트 타입별 컴포넌트
│       ├── AllPostsList.jsx
│       ├── DefaultPost.jsx
│       ├── FilePostsList.jsx
│       ├── GuestBook.jsx
│       ├── ImagesPostsLists.jsx
│       ├── MarkdownPostLists.jsx
│       └── WritePostsList.jsx
├── Atoms/              # 기본 UI 컴포넌트
│   ├── DeleteAlertDialog.jsx
│   ├── EditableTextArea.jsx
│   ├── PageTitle.jsx
│   ├── ScrollToTop.jsx
│   └── ThumbnailUpload.jsx
├── Components/         # 재사용 가능한 컴포넌트
│   ├── Comments.jsx
│   ├── MainCard.jsx
│   ├── PostCard.jsx
│   ├── PostLists.jsx
│   ├── Slider.jsx
│   └── TagSystem.jsx
├── Constants/          # 상수 및 설정
│   └── Constants.js
├── Pages/              # 페이지 컴포넌트
│   ├── Admin/         # 관리자 페이지
│   │   ├── CategoryManagement.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PostManagement.jsx
│   │   └── TagManagement.jsx
│   ├── AdminPage.jsx
│   ├── LoginPage.jsx
│   ├── MainPage.jsx
│   ├── SignUpPage.jsx
│   ├── UpdatePostPage.jsx
│   └── UploadPostPage.jsx
└── Templates/          # 페이지 템플릿
    ├── MainTemplate.jsx
    └── SubTemplate.jsx
```

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone [repository-url]
cd my-app
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:
```env
REACT_APP_SERVER_URL=http://localhost
```

### 4. 개발 서버 실행
```bash
npm start
```

### 5. 프로덕션 빌드
```bash
npm run build
```

### 사용 가능한 스크립트

- `npm start` - 개발 서버 실행 (포트 3000)
- `npm run build` - 프로덕션용 빌드
- `npm test` - 테스트 실행
- `npm run eject` - Create React App 설정 추출

## API 엔드포인트

프로젝트는 다음 API 엔드포인트를 사용합니다:
- **Base URL**: `http://localhost:8080`
- **API v1**: `/api`
- **API v2**: `/api/v2`

### 주요 API
- `GET /api/v2/posts` - 모든 포스트 조회
- `GET /api/v2/posts?categoryId={id}` - 카테고리별 포스트 조회


## 주요 페이지

1. **메인 페이지** (`/`) - 전체 콘텐츠 개요 및 태그 필터링
2. **포스트 상세** (`/post/:id`) - 개별 포스트 내용
3. **카테고리별 목록** - 각 콘텐츠 타입별 목록 페이지
4. **관리자 페이지** (`/admin`) - 콘텐츠 및 카테고리 관리



### 문의

---
구현: @dhrgodms123
