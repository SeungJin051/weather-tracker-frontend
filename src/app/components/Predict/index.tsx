'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Ai from './AI/Ai';
import { PredictData, PredictResponse } from './types';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const mutation = useMutation<PredictResponse, Error, PredictData>({
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
    },
    onError: error => {
      setSubmittedData(null);
      setPredictedUsage(null);
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

    mutation.mutate(parsedData);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-5">
        <h4 className="block text-xl font-medium text-slate-800">
          전력 사용량 예측
        </h4>
        <p className="font-light text-slate-500">예측을 위한 데이터 입력</p>

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
        >
          전송
        </button>
        {mutation.isError && (
          <p className="text-red-500">에러: {mutation.error?.message}</p>
        )}
        {mutation.isSuccess && submittedData && predictedUsage !== null && (
          <div className="mt-4 flex flex-col items-center">
            <p className="text-green-500">
              예측된 전력 사용량: {predictedUsage} kWh
            </p>
            <Ai data={submittedData} predictedUsage={predictedUsage} />
          </div>
        )}
      </div>
    </div>
  );
}
