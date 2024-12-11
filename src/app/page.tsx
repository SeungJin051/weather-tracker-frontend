import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Form from './components/Form';
import Tab from './components/Tab';
import Predict from './components/Predict';

export default function Home() {
  const queryClient = new QueryClient();

  const tabs = [
    {
      name: '전력 예측',
      content: <Predict />,
    },
    {
      name: '연간 통계',
      content: <Form />,
    },
  ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col items-center gap-5 mt-5">
        <Tab tabs={tabs} />
      </div>
    </HydrationBoundary>
  );
}
