export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'messages required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('API Key exists:', !!apiKey);
  console.log('API Key prefix:', apiKey ? apiKey.substring(0, 12) : 'NONE');

  const REGULATIONS = `=== 취업규칙 ===
제6조 시업 08:00 / 종업 17:00 / 휴게 12:00~13:00. 1일 8시간, 주40시간.
제14조 연차유급휴가: 1년 이상(80% 출근) 15일. 1년 미만 월 1일. 3년 이상 매 2년마다 1일 가산, 최대 25일.
제15조 경조휴가: 본인결혼 7일, 자녀결혼 2일, 형제자매결혼 1일, 배우자출산 10일. 부모·배우자·자녀사망 6일, 조부모·형제자매사망 4일.
제20조 출산전후휴가: 90일(쌍태아 120일).
제21조 육아휴직: 만 8세 이하 자녀, 최대 1년.
제37조 정년: 만 60세 도달한 월의 말일.
퇴직원: 퇴직일 30일 전 제출.

=== 급여규정 ===
제11조 급여지급일: 매월 25일(휴일이면 전날).
제12조 휴직중급여: 원칙 미지급. 업무외 상병휴직 최초 3개월 70%, 이후 3개월 50%.
제15조 퇴직금: 1년 이상 근무. 퇴사일로부터 14일 이내 지급.

=== 복리후생규정 ===
제4조 의료비(가톨릭의료원): 본인 60%, 배우자 50%, 부모·미혼자녀 30%, 미혼형제자매 20%.
제15조 경조사비: 본인결혼 20만원, 자녀결혼 20만원, 형제자매결혼 10만원, 부모처부모사망 30만원, 배우자사망 30만원, 자녀사망 20만원, 본인일반사망 500만원, 본인순직 1000만원.
제16조 셋째자녀출산축하금: 1,500만원.

=== 여비교통비규정 ===
출퇴근교통비: 원칙 미지원.
국내출장숙박: 대표이사 실비or10만원, 임원·본부장 8만원, 부장 6만원, 차장·과장 5만원.

=== 인사규정 ===
수습기간: 신규채용 3개월.
승진기준: 대졸→대리 3년, 대리→부과장 3년, 부과장→정과장 2년, 정과장→차장 3년, 차장→부장 4년.
정년: 만 60세.`;

  const systemPrompt = `당신은 평화누리 회사의 인사규정 안내 챗봇입니다. 친근하고 따뜻한 말투로 이모지를 적절히 사용하여 답변하세요.

규정 내용:
${REGULATIONS}

규정에 없는 내용은 "규정에 명시되어 있지 않아요. 인사팀에 문의해 주세요 😊"라고 안내하세요.`;

  try {
    console.log('Calling Anthropic API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 800,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response type:', data.type);
    if (data.error) console.log('API Error:', JSON.stringify(data.error));

    res.status(response.status).json(data);
  } catch (err) {
    console.log('Fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
