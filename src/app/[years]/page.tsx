import { notFound } from 'next/navigation';

const validYears = ['2018', '2019', '2020', '2021', '2022', '2023'];

export function generateStaticParams() {
  return validYears.map(year => ({ years: year }));
}

export default function Page({ params }: { params: { years: string } }) {
  const { years } = params;

  if (!validYears.includes(years)) {
    notFound(); // Redirect to 404 if the year is invalid
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Year: {years}</h1>
      <p>This page dynamically renders content for the year {years}.</p>
    </div>
  );
}
