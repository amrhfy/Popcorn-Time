import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Popcorn Time",
  description: "Sixides Interview Assignment",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
