'use client';

import ReactMarkdown from 'react-markdown';
import { AiProps } from '../types';
import { useState, useEffect } from 'react';

export default function Ai({ data, predictedUsage, averageBill }: AiProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [typingText, setTypingText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (analysis) {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < analysis.length) {
          setTypingText(prev => prev + analysis[currentIndex]);
          currentIndex += 1;
        } else {
          clearInterval(typingInterval);
        }
      }, 50); // 50ms마다 한 글자 추가

      return () => clearInterval(typingInterval);
    } else {
      setTypingText('');
    }
  }, [analysis]);

  const handleAiAnalysis = async () => {
    setAnalysis('');
    setTypingText('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, predictedUsage, averageBill }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI 분석 요청 실패');
      }

      const result = await response.json();

      console.log('API 응답:', result);

      let cleanedResult = '';
      if (result.analysis) {
        cleanedResult = result.analysis
          .replace(/undefined/g, '')
          .replace(/\\n/g, '\n')
          .trim();

        cleanedResult = cleanedResult.replace(/\s*undefined\s*/g, '');
      }

      setAnalysis(cleanedResult);
    } catch (error: any) {
      console.error('AI 분석 중 오류:', error);
      setErrorMessage(error.message || 'AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        className="px-4 py-2 mb-4 text-sm text-center text-white transition-all border border-transparent rounded-md shadow-md bg-blue-600 hover:bg-blue-700 focus:bg-blue-700"
        onClick={handleAiAnalysis}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
          </div>
        ) : (
          'AI 분석 실행'
        )}
      </button>

      {isLoading && (
        <div className="w-full max-w-lg p-4 mb-4 text-center bg-gray-100 rounded-md shadow-md">
          <p className="text-blue-700 animate-pulse">
            AI가 당신의 질문에 대한 답을 찾고 있습니다..
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="w-full max-w-lg p-4 mb-4 bg-red-100 rounded-md shadow-md">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      {typingText && (
        <div className="w-full max-w-lg p-4 bg-gray-100 rounded-md shadow-md">
          <h5 className="mb-2 text-lg font-semibold text-slate-800">
            AI 분석 결과
          </h5>
          <div className="markdown prose max-w-full">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h2 {...props} />,
                h2: ({ node, ...props }) => <h3 {...props} />,
              }}
              skipHtml={true}
              allowedElements={[
                'p',
                'strong',
                'em',
                'h1',
                'h2',
                'h3',
                'ul',
                'ol',
                'li',
              ]}
            >
              {typingText}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
