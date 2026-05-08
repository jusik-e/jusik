# 와인랜드 VIP 소믈리에 챗봇 배포 가이드

## 파일 구성
- wineland_chatbot.html  → 챗봇 프론트엔드
- server.js              → Node.js 백엔드 (API 키 보호)
- package.json           → 패키지 설정

## 설치 및 실행

### 1. 준비
```bash
npm install
mkdir public
cp wineland_chatbot.html public/
```

### 2. 실행
```bash
ANTHROPIC_API_KEY=sk-ant-api03-여기에키입력 node server.js
```

### 3. 접속
브라우저에서 http://localhost:3000 접속

## 클라우드 배포 (예: Railway, Render, Heroku)
1. 위 파일들을 Git 저장소에 업로드
2. 환경변수 ANTHROPIC_API_KEY 설정
3. 빌드 명령: npm install
4. 시작 명령: node server.js

## 주의사항
- ANTHROPIC_API_KEY는 절대 코드에 직접 입력하지 마세요
- 환경변수로만 관리하세요
