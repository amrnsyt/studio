import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KickSync - Collaborative Baby Tracker',
  description: 'Real-time collaborative baby kick tracker with shared sync.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
