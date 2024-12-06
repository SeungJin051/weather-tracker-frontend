import './globals.css';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
  openGraph: {
    title: 'My Next.js App',
    description: 'Experience the best of Next.js with this app!',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono">{children}</body>
    </html>
  );
}
