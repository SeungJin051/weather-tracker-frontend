import './globals.css';
import Providers from './utils/react-query/providers';

export const metadata = {
  title: 'Weather Tracker',
  description:
    '기후 통계를 한눈에 확인하세요. 월별 온도, 강수량, 기후 패턴 등 상세 데이터를 간편하게 살펴볼 수 있어요.',
  openGraph: {
    title: 'Weather Tracker',
    description:
      '기후 통계를 한눈에 확인하세요. 월별 온도, 강수량, 기후 패턴 등 상세 데이터를 간편하게 살펴볼 수 있어요.',
    images: [
      {
        url: '/public/weather-illustration.png',
        alt: 'weather-illustration.png',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
