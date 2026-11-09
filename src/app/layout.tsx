<<<<<<< HEAD
import type { Metadata } from "next"
import { inter, sora } from "../font"
import { AppShell } from "@/components/app/AppShell"
import "./globals.css"

=======
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

>>>>>>> 048c352f8235b4b90d3a305ea1db33a9ff141112
export const metadata: Metadata = {
  title: "Buy & Build",
  description: "Buy What You Love. Build Wealth As You Live.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
      data-theme="light"
    >
      <body className="min-h-full flex flex-col relative z-0 bg-[var(--ink)] text-[var(--text)]">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}
=======
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[var(--ink)] text-[var(--text)] antialiased">
        {children}
      </body>
    </html>
  );
}
>>>>>>> 048c352f8235b4b90d3a305ea1db33a9ff141112
