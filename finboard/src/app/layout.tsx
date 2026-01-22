import type { Metadata } from "next";
import "globals.css";

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
      <body className="bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}