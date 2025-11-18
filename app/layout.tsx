import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./navbar";
import { Providers } from "./providers";


export const metadata: Metadata = {
  title: "E-commerce App",
  description: "Next.js e-commerce application with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
