'use client';

import { useMutation } from '@tanstack/react-query';

export default function PowerUsagePrediction() {
  interface PredictData {
    avgTemp: number;
    precipitation: number;
    avgRhm: number;
    season: string;
  }

  interface PredictResponse {
    predicted_power_usage: number;
    error?: string;
  }

  const handleSubmit = () => {
    const data: PredictData = {
      avgTemp: parseFloat(
        (document.getElementById('avgTemp') as HTMLInputElement).value,
      ),
      precipitation: parseFloat(
        (document.getElementById('precipitation') as HTMLInputElement).value,
      ),
      avgRhm: parseFloat(
        (document.getElementById('avgRhm') as HTMLInputElement).value,
      ),
      season: (document.getElementById('season') as HTMLSelectElement).value,
    };

    mutation.mutate(data);
  };

  const mutation = useMutation<PredictResponse, Error, PredictData>({
    mutationFn: async data => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_FASTAPI}/predict`,
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
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <h4 className="block text-xl font-medium text-slate-800">전력 사용량</h4>
      <p className="font-light text-slate-500">예측을 위한 데이터 입력</p>
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">
          평균 기온 °C
        </label>
        <input
          id="avgTemp"
          type="number"
          className="w-full px-3 py-2 text-sm transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
          placeholder="평균 기온 °C"
          required
        />
      </div>
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">강수량 mm</label>
        <input
          id="precipitation"
          type="number"
          className="w-full px-3 py-2 text-sm transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
          placeholder="강수량 mm"
          required
        />
      </div>
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">습도</label>
        <input
          id="avgRhm"
          type="number"
          className="w-full px-3 py-2 text-sm transition duration-300 bg-transparent border rounded-md shadow-sm placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 focus:shadow"
          placeholder="습도"
          required
        />
      </div>
      <div className="w-full max-w-sm min-w-[200px] flex-grow">
        <label className="block mb-2 text-sm text-slate-600">계절</label>
        <select
          id="season"
          name="season"
          className="w-full py-2 pl-3 pr-8 text-sm transition duration-300 bg-transparent border rounded shadow-sm appearance-none cursor-pointer text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 focus:shadow-md"
          required
        >
          <option value="season_spring">봄</option>
          <option value="season_summer">여름</option>
          <option value="season_fall">가을</option>
          <option value="season_winter">겨울</option>
        </select>
      </div>
      <button
        className="w-full max-w-sm min-w-[200px] px-4 py-2 mt-4 text-sm text-center text-white transition-all border border-transparent rounded-md shadow-md  bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700"
        type="button"
        onClick={handleSubmit}
      >
        전송
      </button>
      {mutation.isError && <p>Error: {mutation.error?.message}</p>}
      {mutation.isSuccess && (
        <p>Prediction: {mutation.data?.predicted_power_usage}</p>
      )}
    </div>
  );
}
