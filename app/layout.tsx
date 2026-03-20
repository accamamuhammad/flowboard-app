import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Clover } from "lucide-react";
import { Metadata } from "next";
import NavBar from "./Primary/navBar";
import SideBar from "./Primary/sideBar";

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
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <header className="w-full h-16 flex justify-end items-center pr-7 py-6 gap-4">
              {/* Logo */}
              <div className="md:min-w-72 h-20 gap-1 pt-1.5 pl-7 bg-white flex flex-row items-center justify-start">
                <Clover size={30}/>
                <h1 className="text-3xl text-newt font-bold">Flowboard</h1>
              </div>
              {/* Navigation */}
              <NavBar />
              {/* Clekr Account */}
              <Show when="signed-out">
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </header>
            <main>{children}</main>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
