// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RootProviders from "../components/providers/RootProviders";

export const metadata: Metadata = {
  title: "Anything World — Home",
  description: "AN: a next-generation entertainment brand and creator ecosystem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-an-bg text-an-fg">
        <RootProviders>
          <Header />
          <main>{children}</main>
          <Footer />
        </RootProviders>
      </body>
    </html>
  );
}
