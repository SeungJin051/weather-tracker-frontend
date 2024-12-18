'use client';

import { useParams } from 'next/navigation';
import Tab from '../../components/Tab';
import TemperatureVsPower from './components/TemperatureVsPower';
import ClimateVsPower from './components/ClimateVsPower';
import HumidityVsPower from './components/HumidityVsPower';

export default function Page() {
  const params = useParams();
  const year = Array.isArray(params?.years)
    ? params.years[0]
    : params.years || 'default-year';

  console.log('Params:', params);

  const tabs = [
    {
      name: '평균 기온별 전력 사용량의 관계',
      content: <TemperatureVsPower params={{ year }} />,
    },
    {
      name: '기온, 강수량 및 전력 사용량의 관계',
      content: <ClimateVsPower params={{ year }} />,
    },
    {
      name: '월별 평균 습도와 전력 사용량의 관계',
      content: <HumidityVsPower params={{ year }} />,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-5 mt-5">
      <Tab tabs={tabs} />
    </div>
  );
}
