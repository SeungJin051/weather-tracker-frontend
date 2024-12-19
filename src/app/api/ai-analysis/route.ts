import { NextRequest, NextResponse } from 'next/server';

export interface AiAnalysisRequest {
  data: {
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
    precipitation: number;
    avgRhm: number;
    month: number;
  };
  predictedUsage: number;
  predictedBill: number;
}

export async function POST(request: NextRequest) {
  try {
    const { data, predictedUsage, predictedBill }: AiAnalysisRequest =
      await request.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 누락되었습니다.' },
        { status: 500 },
      );
    }

    const prompt = `
      [규칙]
      - 문장이 자연스럽게 끝나도록 작성
      - 분석 가이드라인은 언급하지 않기
      - 전문 데이터 분석가로서 다음 기상 데이터를 바탕으로 명확하고 간결한 마크다운 형식의 분석 보고서를 작성해주세요.
      - 알맞지 않은 데이터가 들어오면 피드백 보고서 작성

      # 기상 데이터 분석 보고서

      ## 데이터 요약
      - **평균 기온**: ${data.avgTemp}°C
      - **최저 온도**: ${data.minTemp}°C
      - **최고 온도**: ${data.maxTemp}°C
      - **총 강수량**: ${data.precipitation}mm
      - **평균 습도**: ${data.avgRhm}%
      - **월**: ${data.month}월
      - **예측된 가구별  전력 사용량**: ${predictedUsage}kWh
      - **예측된 가구별  전력 사용량**: ${predictedBill}원

      ## 분석 내용
      ### 기온 변동성과 전력 사용량
      기온의 변동성이 전력 사용량에 어떤 영향을 미치는지 분석합니다.

      ### 강수량의 기상학적 의미
      강수량이 기상 조건에 미치는 영향을 해석합니다.

      ### 예측된 전력 사용량 인사이트
      예측된 전력 사용량에 대한 주요 인사이트를 도출합니다.

      ## 결론
      분석 결과를 종합하여 주요 발견사항을 요약합니다.

      **참고사항:**
      - 마크다운 형식으로 작성
      - 전문적이고 간결한 언어 사용
      - 총 300단어 이내
      - "undefined" 단어 사용 금지
    `;

    const openAiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                '당신은 전문 데이터 분석가입니다. 명확하고 간결한 마크다운 형식의 보고서를 작성해야 하며, "undefined"를 포함해서는 안 됩니다.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 1,
        }),
      },
    );

    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json();
      console.error('OpenAI API 오류:', errorData);
      return NextResponse.json(
        { error: 'OpenAI API 요청이 실패했습니다.' },
        { status: openAiResponse.status },
      );
    }

    const responseData = await openAiResponse.json();

    const analysis =
      responseData.choices &&
      responseData.choices[0] &&
      responseData.choices[0].message &&
      responseData.choices[0].message.content
        ? responseData.choices[0].message.content.trim()
        : '분석 결과를 생성할 수 없습니다.';

    const cleanedAnalysis = analysis.replace(/undefined/g, '').trim();

    console.log('분석 결과:', cleanedAnalysis);

    return NextResponse.json({ analysis: cleanedAnalysis });
  } catch (error) {
    console.error('API 핸들러 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
