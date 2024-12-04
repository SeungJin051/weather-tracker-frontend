import { notFound } from 'next/navigation';

const validYears = ['2018', '2019', '2020', '2021', '2022', '2023'];

export function generateStaticParams() {
  return validYears.map(year => ({ years: year }));
}

interface PageProps {
  params: {
    years: string;
  };
}

export default function Page({ params }: PageProps) {
  const { years } = params;

  if (!validYears.includes(years)) {
    notFound();
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Year: {years}</h1>
      <p>This page dynamically renders content for the year {years}.</p>
    </div>
  );
}
