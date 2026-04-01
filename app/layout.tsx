import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import Link from "next/link";
import { Providers } from "@/components/providers";
import { AuthButton } from "@/components/auth-button";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ขอให้ Learn | ฝึกโจทย์คณิต PAT1 TCAS พร้อม AI",
  description:
    "ฝึกโจทย์คณิตศาสตร์ ม.ปลาย PAT1 TCAS พร้อมระบบ AI ช่วยอธิบายวิธีคิดแบบ step-by-step เข้าใจง่าย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="text-xl font-bold text-primary">
                ขอให้ Learn
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/practice"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  ฝึกโจทย์
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <AuthButton />
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-8 text-center text-sm text-muted-foreground">
            © 2026 ขอให้ Learn — KhoHaiLearn.com
          </footer>
        </Providers>
      </body>
    </html>
  );
}
