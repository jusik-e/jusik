// 와인랜드 챗봇 백엔드 서버
// 설치: npm install express cors
// 실행: ANTHROPIC_API_KEY=sk-ant-... node server.js

const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// 정적 파일 제공 (wineland_chatbot.html)
app.use(express.static(path.join(__dirname, 'public')));

// Anthropic API 프록시
app.post('/api/chat', async (req, res) => {
  try {
    const body = JSON.stringify(req.body);

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => { data += chunk; });
      apiRes.on('end', () => {
        res.status(apiRes.statusCode).set('Content-Type', 'application/json').send(data);
      });
    });

    apiReq.on('error', (err) => {
      console.error('API 오류:', err);
      res.status(500).json({ error: { message: '서버 오류' } });
    });

    apiReq.write(body);
    apiReq.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: '서버 오류' } });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wineland_chatbot.html'));
});

app.listen(PORT, () => {
  console.log(`✅ 와인랜드 챗봇 서버 실행 중: http://localhost:${PORT}`);
});
