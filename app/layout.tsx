
import { ThemeProvider } from "next-themes";

import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { Metadata } from "next";

const instrumentSerif = Instrument_Serif({
  weight: "400",

  subsets: ["latin"],

  variable: "--font-serif",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],

  weight: ["300", "400", "500", "600"],

  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FlowBoard",
  description: "Boards and Tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${plusJakarta.variable} font-sans`}
      >
          <ThemeProvider attribute="class" defaultTheme="light">
            <header className="flex justify-end items-center p-4 gap-4 h-16">
            </header>
            <main>{children}</main>
          </ThemeProvider>
      </body>
    </html>
  );
}
