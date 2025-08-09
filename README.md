# AI 심리상담 웹 앱

익명으로 이용할 수 있는 AI 심리상담 웹 애플리케이션입니다. 로그인 없이 감정 체크, 고민 상담, AI 응답, 위기 감지 등의 기능을 제공합니다.

## 🚀 주요 기능

- **완전 익명 상담**: 로그인이나 개인정보 입력 없이 이용 가능
- **감정 체크**: 이모지 버튼으로 현재 감정 상태 선택
- **AI 상담**: OpenRouter를 통한 LLM 기반 심리상담
- **감정 분석**: 입력 텍스트 기반 감정 상태 분석
- **위기 감지**: 자살, 자해 등 위기 키워드 감지 및 전문기관 연결
- **상담 기록**: 브라우저 로컬 스토리지를 통한 상담 내용 저장
- **Q&A 탐색**: 자주 묻는 질문과 답변 제공

## 🛠 기술 스택

### 프론트엔드
- React 18 + TypeScript
- React Router Dom (라우팅)
- Styled Components (스타일링)
- Axios (HTTP 클라이언트)

### 백엔드
- FastAPI (Python)
- Pydantic (데이터 검증)
- HTTPX (HTTP 클라이언트)
- Python-dotenv (환경변수 관리)

## 📁 프로젝트 구조

```
ai-counseling-app/
├── backend/                 # FastAPI 백엔드
│   ├── main.py             # 메인 API 서버
│   ├── requirements.txt    # Python 의존성
│   └── .env.example       # 환경변수 예시
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트들
│   │   ├── services/      # API 서비스
│   │   ├── types/         # TypeScript 타입 정의
│   │   └── App.tsx        # 메인 앱 컴포넌트
│   └── package.json       # Node.js 의존성
└── README.md              # 프로젝트 문서
```

## ⚙️ 설치 및 실행

### 로컬 개발환경

#### 1. 저장소 클론
```bash
git clone <repository-url>
cd ai-counseling-app
```

#### 2. 백엔드 설정
```bash
cd backend

# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일에 OpenRouter API 키 입력

# 서버 실행
python main.py
```

#### 3. 프론트엔드 설정
```bash
cd frontend

# 의존성 설치
npm install

# 환경변수 설정 (선택사항)
cp .env.example .env
# .env 파일에 API URL과 OpenRouter 키 설정

# 개발 서버 실행
npm start
```

#### 4. 브라우저에서 접속
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

### 🌐 배포 (Production)

본 프로젝트는 GitHub Pages + 백엔드 별도 배포 방식을 지원합니다.

**자세한 배포 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

#### 간단 배포 요약:
1. **백엔드**: Railway/Render에 배포
2. **프론트엔드**: GitHub Pages 자동 배포
3. **환경변수**: GitHub Secrets로 API 키 보호

## 🔑 환경변수 설정

`backend/.env` 파일에 다음 내용을 설정하세요:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
```

OpenRouter API 키는 [OpenRouter](https://openrouter.ai)에서 발급받을 수 있습니다.

## 📱 화면 구성

1. **시작화면**: 서비스 소개 및 상담 시작
2. **감정 체크**: 이모지로 현재 감정 선택
3. **고민 입력**: 자유롭게 고민 내용 작성
4. **AI 응답**: AI 상담사 응답 및 감정 분석
5. **위기 지원**: 위기 상황 감지 시 전문기관 연결
6. **상담 기록**: 저장된 상담 내용 관리
7. **FAQ**: 자주 묻는 질문과 답변

## 🔒 개인정보 보호

- 완전 익명 서비스 (로그인 불필요)
- 개인 식별 정보 수집 안함
- 상담 내용은 사용자 브라우저에만 저장
- 서버에는 개인정보 저장 안함

## ⚠️ 위기 상황 대응

다음 키워드 감지 시 자동으로 위기 지원 서비스 안내:
- 자살, 죽고싶다, 자해, 죽음, 끝내고싶다
- 살기싫다, 괴롭다, 혼자, 절망, 포기 등

### 긴급 연락처
- 생명의전화: 1393
- 정신건강위기상담전화: 1577-0199
- 청소년전화: 1388
- 응급상황: 119

## 🤝 기여하기

1. Fork 프로젝트
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## ⚠️ 중요 안내

이 서비스는 응급 상황이나 심각한 정신건강 문제에 대한 전문적인 치료를 대체하지 않습니다. 위기 상황에서는 반드시 전문가의 도움을 받으시기 바랍니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.
