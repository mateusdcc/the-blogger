import type { Metadata } from "next";
import {
  IM_Fell_English,
  JetBrains_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const display = IM_Fell_English({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const body = Playfair_Display({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: {
    default: "Mateus Cavalcanti | everything is an exchange",
    template: "%s | Mateus Cavalcanti",
  },
  description:
    "A static notebook for behavioral psychology, philosophy, attention, narcissism, and the transactions underneath ordinary life.",
  metadataBase: new URL("https://mateusdcc.github.io"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
