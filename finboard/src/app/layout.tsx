import type { Metadata } from "next";
import "./globals.css"; // <--- This imports the styles we just added above

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
    <html lang="en">
      {/* These classes set the default background color for the whole app */}
      <body className="bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}