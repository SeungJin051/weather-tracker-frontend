import Tab from '../components/Tab';
import Test from './components/Bar';

export default function Page() {
  const tabs = [
    {
      name: '통계 1',
      content: <Test />,
    },
    {
      name: '통계 2',
      content: <Test />,
    },
  ];
  return (
    <div className="container mx-auto p-4">
      <p>This page dynamically renders content for the year .</p>
      <Tab tabs={tabs} />
    </div>
  );
}
