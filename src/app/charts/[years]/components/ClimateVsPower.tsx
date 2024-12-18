'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function ClimateVsPower({
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
        label: '강수량 (mm)',
        data: weatherData.map((item: any) => item.precipitation),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y1',
      },
      {
        label: '전력 사용량 (kWh)',
        data: electricData.map((item: any) => item.totalPowerUsage),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y2',
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
        text: `${params.year}년 기온, 강수량, 전력 사용량 비교`,
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
      y2: {
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
      <h1 className="text-xl font-bold mb-5">
        {params.year}년 기후, 강수량, 전력 사용량
      </h1>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
