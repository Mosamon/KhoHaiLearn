import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "ขอให้ Learn | ฝึกโจทย์คณิต PAT1 TCAS พร้อม AI",
  description:
    "ฝึกโจทย์คณิตศาสตร์ ม.ปลาย PAT1 TCAS พร้อมระบบ AI ช่วยอธิบายวิธีคิดแบบ step-by-step เข้าใจง่าย",
};

const features = [
  {
    title: "ฝึกโจทย์หลากหลาย",
    description:
      "โจทย์คณิตศาสตร์ ม.ปลาย ครอบคลุม พีชคณิต แคลคูลัส ความน่าจะเป็น และเรขาคณิต",
    icon: "📝",
  },
  {
    title: "AI ช่วยอธิบาย",
    description:
      "ไม่เข้าใจ? ให้ AI อธิบายวิธีคิดแบบ step-by-step เป็นภาษาไทย เข้าใจง่าย",
    icon: "🤖",
  },
  {
    title: "ติดตาม Progress",
    description:
      "Dashboard แสดงสถิติ กราฟพัฒนาการ และแนะนำหมวดที่ควรฝึกเพิ่ม",
    icon: "📊",
  },
];

const linkButton =
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-primary text-primary-foreground text-base font-medium px-8 h-9 transition-all hover:bg-primary/80";
const linkButtonOutline =
  "inline-flex items-center justify-center rounded-lg border border-border bg-background text-foreground text-base font-medium px-8 h-9 transition-all hover:bg-muted";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm">
            EdTech Platform สำหรับนักเรียน ม.ปลาย
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="text-primary">ขอให้ Learn</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            ฝึกโจทย์คณิต PAT1 TCAS พร้อม AI ช่วยอธิบาย
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/practice" className={linkButton}>
              เริ่มฝึกฟรี
            </Link>
            <Link href="/dashboard" className={linkButtonOutline}>
              ดู Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            ทำไมต้อง ขอให้ Learn?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 text-4xl">{f.icon}</div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {f.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Pricing Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">แพ็กเกจ</h2>
          <p className="mb-12 text-center text-muted-foreground">
            เลือกแผนที่เหมาะกับคุณ
          </p>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">ฟรี</CardTitle>
                <CardDescription>เริ่มต้นฝึกโจทย์ได้เลย</CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold">฿0</span>
                  <span className="text-muted-foreground">/เดือน</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> โจทย์ฝึก 10 ข้อ/วัน
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> ดูเฉลยหลังตอบ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Dashboard พื้นฐาน
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span>✗</span> AI Hint (จำกัด 3 ครั้ง/วัน)
                  </li>
                </ul>
                <Link href="/practice" className={`${linkButtonOutline} mt-6 w-full`}>
                  เริ่มฝึกฟรี
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-primary shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <Badge>แนะนำ</Badge>
                </div>
                <CardDescription>ฝึกได้ไม่จำกัด พร้อม AI ช่วย</CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold">฿199</span>
                  <span className="text-muted-foreground">/เดือน</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> โจทย์ฝึกไม่จำกัด
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> ดูเฉลยหลังตอบ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> Dashboard ขั้นสูง
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> AI Hint ไม่จำกัด
                  </li>
                </ul>
                <Link href="/practice" className={`${linkButton} mt-6 w-full`}>
                  สมัคร Premium
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
