'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Bar chart를 사용하기 위해 변경
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function TemperatureVsPower({
  params,
}: {
  params: { year: string };
}) {
  const [weatherData, setWeatherData] = useState([]);
  const [electricData, setElectricData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL_EXPRESS}/api/weather`,
        );
        const electResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL_EXPRESS}/api/elect`,
        );

        const yearWeather = weatherResponse.data.filter(
          (item: any) => item.year === parseInt(params.year),
        );
        const yearElect = electResponse.data.filter(
          (item: any) => item.year === parseInt(params.year),
        );

        setWeatherData(yearWeather);
        setElectricData(yearElect);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.year]);

  const chartData = {
    labels: weatherData.map((item: any) => `${item.month}월`),
    datasets: [
      {
        label: '평균 기온 (°C)',
        data: weatherData.map((item: any) => item.avgTemp),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
      },
      {
        label: '전력 사용량 (kWh)',
        data: electricData.map((item: any) => item.averagePowerUsage),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderRadius: 10,
        yAxisID: 'y1',
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${params.year}년 월별 기후 및 전력 사용량`,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold mb-5">{params.year}년 데이터 시각화</h1>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
