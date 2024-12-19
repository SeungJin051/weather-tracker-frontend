'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Ai from './AI/Ai';
import { PredictData, PredictResponse, PredictBillResponse } from './types';

export default function PowerUsagePrediction() {
  const [formData, setFormData] = useState({
    avgTemp: '',
    minTemp: '',
    maxTemp: '',
    precipitation: '',
    avgRhm: '',
    month: '1',
  });

  const [submittedData, setSubmittedData] = useState<PredictData | null>(null);
  const [predictedUsage, setPredictedUsage] = useState<number | null>(null);
  const [predictedBill, setPredictedBill] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const usageMutation = useMutation<PredictResponse, Error, PredictData>({
    mutationFn: async data => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_EXPRESS}/predict`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to fetch prediction');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      setSubmittedData(variables);
      setPredictedUsage(data.predicted_power_usage);
      billMutation.mutate({ usage: data.predicted_power_usage });
    },
    onError: () => {
      setSubmittedData(null);
      setPredictedUsage(null);
      setPredictedBill(null);
    },
  });

  const billMutation = useMutation<
    PredictBillResponse,
    Error,
    { usage: number }
  >({
    mutationFn: async data => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_EXPRESS}/predictbill`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to fetch bill prediction');
      }

      return response.json();
    },
    onSuccess: data => {
      setPredictedBill(data.predicted_bill);
    },
    onError: () => {
      setPredictedBill(null);
    },
  });

  const handleSubmit = () => {
    const parsedData: PredictData = {
      avgTemp: parseFloat(formData.avgTemp),
      minTemp: parseFloat(formData.minTemp),
      maxTemp: parseFloat(formData.maxTemp),
      precipitation: parseFloat(formData.precipitation),
      avgRhm: parseFloat(formData.avgRhm),
      month: parseInt(formData.month, 10),
    };

    for (const key in parsedData) {
      if (isNaN(parsedData[key as keyof PredictData])) {
        alert(`${key} 숫자를 입력해주세요.`);
        return;
      }
    }

    usageMutation.mutate(parsedData);
  };

  const isLoading = usageMutation.isPending || billMutation.isPending;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-5">
        <h4 className="block text-xl font-medium text-slate-800">
          전력 사용량을 예측해보세요
        </h4>
        <p className="font-light text-slate-500">
          데이터를 입력하면 사용량과 예상 요금을 알려드립니다.
        </p>

        {/* Input Fields */}
        {[
          {
            id: 'avgTemp',
            label: '평균 기온 °C',
            placeholder: '평균 기온 °C',
          },
          {
            id: 'minTemp',
            label: '최저 온도 °C',
            placeholder: '최저 온도 °C',
          },
          {
            id: 'maxTemp',
            label: '최고 온도 °C',
            placeholder: '최고 온도 °C',
          },
          {
            id: 'precipitation',
            label: '강수량 mm',
            placeholder: '강수량 mm',
          },
          {
            id: 'avgRhm',
            label: '습도 (%)',
            placeholder: '습도 (%)',
          },
        ].map(field => (
          <div className="w-full max-w-sm min-w-[200px]" key={field.id}>
            <label className="block mb-2 text-sm text-slate-600">
              {field.label}
            </label>
            <input
              id={field.id}
              type="number"
              value={formData[field.id as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
              placeholder={field.placeholder}
              required
            />
          </div>
        ))}
        <div className="w-full max-w-sm min-w-[200px]">
          <label className="block mb-2 text-sm text-slate-600">월</label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full py-2 pl-3 pr-8 text-sm transition duration-300 bg-transparent border rounded shadow-sm appearance-none cursor-pointer text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 focus:shadow-md"
            required
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}월
              </option>
            ))}
          </select>
        </div>
        <button
          className="w-full max-w-sm min-w-[200px] px-4 py-2 mt-4 text-sm text-center text-white transition-all border border-transparent rounded-md shadow-md bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 text-white animate-spin"
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
            '전송'
          )}
        </button>

        {usageMutation.isError && (
          <p className="text-red-500">에러: {usageMutation.error?.message}</p>
        )}
        {billMutation.isError && (
          <p className="text-red-500">에러: {billMutation.error?.message}</p>
        )}
        {usageMutation.isSuccess &&
          submittedData &&
          predictedUsage !== null && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-green-500 border-t-2 p-3">
                예측된 가구별 전력 사용량: {predictedUsage} kWh
              </p>
              {predictedBill !== null && (
                <>
                  <p className="text-blue-500">
                    예측된 가구별 청구 금액: {predictedBill.toLocaleString()} 원
                  </p>
                  <Ai
                    data={submittedData}
                    predictedUsage={predictedUsage}
                    predictedBill={predictedBill}
                  />
                </>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
