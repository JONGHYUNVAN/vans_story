# 이미지 업로드 서비스

## 개요

Next.js 기반의 API 서버로, 이미지 업로드 및 AWS S3 저장 기능을 제공합니다. 클라이언트에서 전송한 이미지 파일을 WebP 형식으로 변환한 후, AWS S3에 업로드하여 이미지 URL을 반환하는 현대적이고 효율적인 이미지 처리 서비스입니다.

## 목차

- [개요](#개요)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능](#주요-기능)
- [API 엔드포인트](#api-엔드포인트)
- [환경 변수 설정](#환경-변수-설정)
- [설치 및 실행](#설치-및-실행)
- [주요 의존성](#주요-의존성)
- [사용 예제](#사용-예제)
- [WebP 변환 옵션](#webp-변환-옵션)
- [에러 처리](#에러-처리)

## 프로젝트 구조

```
vans_devblog_image/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts           # POST /api/upload 엔드포인트
│   └── utils/
│       ├── errors.ts              # 커스텀 에러 클래스 정의
│       ├── s3Uploader.ts          # AWS S3 업로드 유틸리티
│       └── webpConverter.ts       # WebP 변환 및 메타데이터 추출
├── docs/                          # TypeDoc 생성 문서
├── public/                        # 정적 파일
├── styles/                        # 스타일 파일
├── eslint.config.mjs              # ESLint 설정
├── jsdoc.config.json              # JSDoc 설정 (미사용)
├── next.config.ts                 # Next.js 설정
├── next-env.d.ts                  # Next.js 타입 선언
├── package.json                   # npm 의존성 및 스크립트
├── tsconfig.json                  # TypeScript 설정
├── typedoc.json                   # TypeDoc 문서화 설정
└── README.md                      # 프로젝트 문서
```

## 주요 기능

### 이미지 처리
- **WebP 변환**: Sharp 라이브러리를 사용하여 이미지를 WebP 형식으로 변환
- **품질 설정**: 기본 80%, API 업로드 시 85% 품질 사용
- **크기 옵션**: 원본 크기 유지 또는 사용자 지정 크기로 리사이징
- **메타데이터 추출**: 이미지의 너비, 높이, 포맷, 색상 공간 정보 추출

### AWS S3 업로드
- **멀티파트 업로드**: 대용량 파일도 안정적으로 업로드
- **고유 파일명**: 타임스탬프 기반 중복 방지 파일명 생성
- **폴더 구조**: `images/` 폴더에 체계적으로 저장
- **Content-Type 자동 설정**: WebP MIME 타입 자동 적용

### 에러 처리
- **ImageProcessingError**: 이미지 변환 관련 에러 (26가지 세부 상황)
- **S3UploadError**: AWS S3 업로드 관련 에러 (9가지 세부 상황)
- **ValidationError**: 입력값 검증 관련 에러 (9가지 세부 상황)

## API 엔드포인트

### POST /api/upload

이미지 파일을 WebP로 변환하여 S3에 업로드하고 URL을 반환합니다.

#### 요청
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `image`: 업로드할 이미지 파일 (최대 5MB)
  - 지원 형식: JPEG, PNG, GIF, WebP, TIFF, AVIF

#### 응답

**성공 (200)**
```json
{
  "success": true,
  "imageUrl": "https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/1734567890123-example.webp"
}
```

**클라이언트 에러 (400)**
```json
{
  "error": "이미지 파일이 필요합니다."
}
```
```json
{
  "error": "파일 크기는 5MB를 초과할 수 없습니다."
}
```

**서버 에러 (500)**
```json
{
  "error": "이미지 처리 오류: 지원하지 않는 이미지 형식입니다."
}
```
```json
{
  "error": "S3 업로드 오류: AWS 인증에 실패했습니다."
}
```

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# AWS S3 설정
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-bucket-name

# Next.js 설정 (선택사항)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 환경 변수 설명

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `AWS_ACCESS_KEY_ID` | 필수 | AWS 액세스 키 ID |
| `AWS_SECRET_ACCESS_KEY` | 필수 | AWS 시크릿 액세스 키 |
| `AWS_REGION` | 필수 | AWS 리전 (예: ap-northeast-2) |
| `AWS_S3_BUCKET` | 필수 | S3 버킷 이름 |
| `NEXT_PUBLIC_API_URL` | 선택 | API 서버 URL (개발/프로덕션 구분) |

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 프로덕션 빌드
```bash
npm run build
npm start
```

### 4. 문서 생성
```bash
npm run docs
```

## 주요 의존성

### 프로덕션 의존성
- **Next.js 15.3.1**: React 기반 풀스택 프레임워크
- **React 19.0.0**: UI 라이브러리
- **Sharp 0.34.1**: 고성능 이미지 처리 라이브러리
- **AWS SDK 3.803.0**: S3 클라이언트 및 요청 서명
- **Multer 1.4.5**: 멀티파트 파일 업로드 처리
- **Next-Connect 1.0.0**: Next.js 미들웨어 연결

### 개발 의존성
- **TypeScript 5**: 정적 타입 검사
- **ESLint 9**: 코드 품질 검사
- **TypeDoc 0.28.5**: API 문서 자동 생성
- **@types/***: TypeScript 타입 정의

## 사용 예제

### cURL로 테스트
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "image=@path/to/your/image.jpg" \
  -H "Content-Type: multipart/form-data"
```

### JavaScript (Fetch API)
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
if (result.success) {
  console.log('업로드 성공:', result.imageUrl);
} else {
  console.error('업로드 실패:', result.error);
}
```

### React 컴포넌트 예제
```tsx
import { useState } from 'react';

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setImageUrl(result.imageUrl);
      } else {
        console.error('업로드 실패:', result.error);
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />
      
      {uploading && <p>업로드 중...</p>}
      
      {imageUrl && (
        <div>
          <p>업로드 완료!</p>
          <img src={imageUrl} alt="업로드된 이미지" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
}
```

## WebP 변환 옵션

### 품질 설정 가이드
- **90-100%**: 최고 품질 (포트폴리오, 아트워크)
- **80-90%**: 고품질 (일반 웹사이트 이미지)
- **70-80%**: 균형 (블로그, 상품 이미지)
- **50-70%**: 압축 우선 (썸네일, 아이콘)

### 지원하는 변환 옵션
- `quality`: 1-100 (기본값: 80)
- `width`: 출력 너비 (선택사항)
- `height`: 출력 높이 (선택사항)
- `preserveMetadata`: 메타데이터 보존 여부 (기본값: false)

### WebP 변환 설정 커스터마이징
```typescript
// webpConverter.ts에서 설정 변경
const webpOptions = {
  quality: 85,          // 품질 (1-100)
  effort: 6,            // 압축 노력도 (0-6, 높을수록 더 압축)
  lossless: false,      // 무손실 압축 여부
  nearLossless: false,  // 거의 무손실 압축 여부
  smartSubsample: true, // 스마트 서브샘플링
};
```

### 이미지 최적화 팁
1. **적절한 품질 선택**: 용도에 맞는 품질 설정
2. **크기 조정**: 필요한 크기로 리사이징하여 파일 크기 줄이기
3. **메타데이터 제거**: 불필요한 메타데이터 제거로 파일 크기 최소화
4. **포맷 선택**: WebP는 JPEG 대비 25-35% 작은 파일 크기

## 에러 처리

### 에러 타입별 대응 방법

#### ImageProcessingError
```typescript
// 이미지 처리 관련 에러
try {
  const result = await convertToWebP(buffer);
} catch (error) {
  if (error instanceof ImageProcessingError) {
    console.error('이미지 처리 실패:', error.message);
    // 사용자에게 친화적인 에러 메시지 표시
  }
}
```

#### S3UploadError
```typescript
// S3 업로드 관련 에러
try {
  const uploadResult = await uploadToS3(buffer, fileName);
} catch (error) {
  if (error instanceof S3UploadError) {
    console.error('S3 업로드 실패:', error.message);
    // 재시도 로직 또는 대체 저장소 사용
  }
}
```

#### ValidationError
```typescript
// 입력 검증 관련 에러
try {
  validateFile(file);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('파일 검증 실패:', error.message);
    // 사용자에게 올바른 파일 형식 안내
  }
}
```

### 일반적인 에러 상황

1. **파일 크기 초과**
   - 원인: 5MB를 초과하는 파일 업로드
   - 해결: 파일 크기 확인 후 압축 또는 리사이징

2. **지원하지 않는 형식**
   - 원인: HEIC, BMP 등 지원하지 않는 이미지 형식
   - 해결: 지원하는 형식(JPEG, PNG, GIF, WebP, TIFF, AVIF)으로 변환

3. **AWS 인증 실패**
   - 원인: 잘못된 AWS 자격 증명 또는 권한 부족
   - 해결: 환경 변수 확인 및 IAM 권한 설정

4. **네트워크 타임아웃**
   - 원인: 대용량 파일 업로드 시 네트워크 지연
   - 해결: 타임아웃 시간 증가 또는 파일 크기 제한

### 로깅 및 모니터링
```typescript
// 상세한 에러 로깅
console.error('Upload Error:', {
  error: error.message,
  fileName: file.name,
  fileSize: file.size,
  timestamp: new Date().toISOString(),
  userAgent: request.headers['user-agent']
});
```
