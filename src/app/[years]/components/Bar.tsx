'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
);

interface MonthlyData {
  month: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  rainfall: number;
}

interface WeatherData {
  year: number;
  data: MonthlyData[];
}

const Test: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  useEffect(() => {
    axios
      .get('/db/years.json') // JSON 파일의 엔드포인트
      .then(response => {
        const rawData: WeatherData[] = response.data; // years.json 데이터
        console.log('Fetched Data:', rawData);
        setWeatherData(rawData);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }, []);

  // 연도별 평균 기온 데이터
  const getLineChartData = () => {
    const labels = weatherData.map(yearData => yearData.year.toString());
    const avgTemps = weatherData.map(
      yearData =>
        yearData.data.reduce((sum, monthData) => sum + monthData.avgTemp, 0) /
        yearData.data.length,
    );

    return {
      labels,
      datasets: [
        {
          label: 'Average Temperature',
          data: avgTemps,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
      ],
    };
  };

  // 월별 강수량 데이터
  const getBarChartData = () => {
    const months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    const rainfallData = months.map(month =>
      weatherData.reduce((sum, yearData) => {
        const monthData = yearData.data.find(m => m.month === month);
        return sum + (monthData ? monthData.rainfall : 0);
      }, 0),
    );

    return {
      labels: months,
      datasets: [
        {
          label: 'Total Rainfall',
          data: rainfallData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // 월별 평균 기온 데이터
  const getRadarChartData = () => {
    const months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    const datasets = weatherData.map(yearData => ({
      label: yearData.year.toString(),
      data: months.map(month => {
        const monthData = yearData.data.find(m => m.month === month);
        return monthData ? monthData.avgTemp : 0;
      }),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255,
      )}, ${Math.floor(Math.random() * 255)}, 0.2)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255,
      )}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 1,
    }));

    return {
      labels: months,
      datasets,
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weather Data Visualization</h1>
      <div style={{ marginBottom: '40px' }}>
        <h2>Average Temperature Over Years</h2>
        <Line data={getLineChartData()} />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Total Rainfall by Month</h2>
        <Bar data={getBarChartData()} />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h2>Monthly Average Temperature Trends (Radar)</h2>
        <Radar data={getRadarChartData()} />
      </div>
    </div>
  );
};

export default Test;
