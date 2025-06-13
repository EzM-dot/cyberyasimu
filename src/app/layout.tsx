
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Cyber ya Simu',
  description: 'Countdown and lock your focus.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

// Interface for the layout props, explicitly including params
interface RootLayoutProps {
  children: React.ReactNode;
  params: { [key: string]: string | string[] | undefined }; // Explicitly type params
}

export default function RootLayout({
  children,
  params, // Destructure params, even if not directly used in the body
}: Readonly<RootLayoutProps>) {
  // By destructuring 'params', we acknowledge its presence, which can help
  // Next.js internals or dev tools that might be probing component props.
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
