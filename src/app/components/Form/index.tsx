'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';

type Weather = {
  date: string;
  city: string;
  temperature: number;
  minTemperature: number;
  description: string;
};

export default function Form() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedYear = formData.get('years') as string;
    if (selectedYear) {
      router.push(`/${selectedYear}`);
    }
  };

  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [filteredWeatherData, setFilteredWeatherData] = useState<Weather[]>([]);

  const getTodayInMMDD = (): string => {
    const koreaTime = new Date();
    koreaTime.setHours(koreaTime.getHours() + 9);
    const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreaTime.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get('/db/weather.json');
        setWeatherData(response.data.weather);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (weatherData.length > 0) {
      const today = getTodayInMMDD();

      const last7DaysWeather = weatherData.filter(({ date }) => {
        const [currentMonth, currentDay] = today.split('-').map(Number);
        const [weatherMonth, weatherDay] = date.split('-').map(Number);

        const diffInDays =
          (currentMonth - weatherMonth) * 30 + (currentDay - weatherDay);
        return diffInDays >= 0 && diffInDays <= 6;
      });

      const sortedWeather = last7DaysWeather.sort(
        (a, b) =>
          new Date(`2024-${b.date}`).getTime() -
          new Date(`2024-${a.date}`).getTime(),
      );

      setFilteredWeatherData(sortedWeather);
    }
  }, [weatherData]);

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-2xl ">
        지난 기후를 한눈에! <br />
        연도를 선택해 통계를 확인하세요.
      </h1>
      <div className="flex flex-col gap-7">
        <form onSubmit={handleSubmit}>
          <div className="w-full max-w-sm min-w-[350px] flex items-center space-x-2">
            <div className="relative flex-grow">
              <select
                name="years"
                className="w-full py-2 pl-3 pr-8 text-sm transition duration-300 bg-transparent border rounded shadow-sm appearance-none cursor-pointer placeholder:text-slate-400 text-slate-700 border-slate-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 focus:shadow-md"
              >
                <option value="">년도 선택</option>
                <option value="2018">2018년</option>
                <option value="2019">2019년</option>
                <option value="2020">2020년</option>
                <option value="2021">2021년</option>
                <option value="2022">2022년</option>
                <option value="2023">2023년</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>

            <button
              className="px-4 py-2 text-sm text-center text-white transition-all border border-transparent rounded-md shadow-md bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="submit"
            >
              전송
            </button>
          </div>
          <p className="flex items-center mt-2 text-xs text-slate-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              ></path>
            </svg>
            선택 후 전송을 눌러주세요.
          </p>
        </form>
        <div>
          <ul>
            {filteredWeatherData.map(
              (
                { date, city, temperature, minTemperature, description },
                index,
              ) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div className="w-1/6 text-sm text-left text-gray-500">
                    {date}
                  </div>
                  <div className="w-3/6 text-sm font-semibold text-left">
                    {city} - {temperature}°C / {minTemperature}°C
                  </div>
                  <div className="w-1/6 text-sm text-right text-gray-600">
                    {description}
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
