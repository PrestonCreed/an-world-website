import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Anything World — Home",
  description: "AN: a next-generation entertainment brand and creator ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-an-bg text-an-fg">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
