import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinBoard",
  description: "Internship Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) {}
        ` }} />
      </head>
      <body className="bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}