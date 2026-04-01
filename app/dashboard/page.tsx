"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getStats, getDbStats, type PracticeStats } from "@/lib/store";
import { categoryLabels, type Category } from "@/lib/problems";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<PracticeStats | null>(null);

  useEffect(() => {
    async function load() {
      if (session?.user?.email) {
        const dbStats = await getDbStats();
        setStats(dbStats ?? getStats()); // DB first, localStorage fallback
      } else {
        setStats(getStats());
      }
    }
    load();
  }, [session]);

  if (!stats) return null;

  const accuracy =
    stats.totalAttempted > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
      : 0;

  // Find weakest category
  const categoryStats = Object.entries(stats.byCategory)
    .map(([key, val]) => ({
      key: key as Category,
      label: categoryLabels[key as Category] || key,
      ...val,
      accuracy: val.attempted > 0 ? Math.round((val.correct / val.attempted) * 100) : 0,
    }))
    .filter((c) => c.attempted > 0);

  const weakest = categoryStats.length > 0
    ? categoryStats.reduce((a, b) => (a.accuracy < b.accuracy ? a : b))
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          ติดตามพัฒนาการและสถิติการฝึกของคุณ
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ทำไปแล้ว</CardDescription>
            <CardTitle className="text-4xl">{stats.totalAttempted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">ข้อ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ตอบถูก</CardDescription>
            <CardTitle className="text-4xl text-green-600">
              {accuracy}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.totalCorrect} จาก {stats.totalAttempted} ข้อ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>หมวดที่ควรฝึกเพิ่ม</CardDescription>
            <CardTitle className="text-2xl">
              {weakest ? (
                <Badge variant="destructive" className="text-base px-3 py-1">
                  {weakest.label} ({weakest.accuracy}%)
                </Badge>
              ) : (
                <span className="text-muted-foreground text-base">
                  ยังไม่มีข้อมูล
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {weakest
                ? `ตอบถูก ${weakest.correct} จาก ${weakest.attempted} ข้อ`
                : "เริ่มฝึกเพื่อดูสถิติ"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-8" />

      {/* Category Breakdown */}
      <h2 className="mb-4 text-xl font-bold">สถิติรายหมวด</h2>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {(Object.entries(categoryLabels) as [Category, string][]).map(
          ([key, label]) => {
            const cat = stats.byCategory[key] || { attempted: 0, correct: 0 };
            const catAccuracy =
              cat.attempted > 0
                ? Math.round((cat.correct / cat.attempted) * 100)
                : 0;
            return (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{label}</CardTitle>
                    <Badge variant={catAccuracy >= 70 ? "default" : catAccuracy > 0 ? "secondary" : "outline"}>
                      {cat.attempted > 0 ? `${catAccuracy}%` : "—"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={catAccuracy}
                    className="mb-2 h-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    ทำ {cat.attempted} ข้อ · ถูก {cat.correct} ข้อ
                  </p>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      <Separator className="mb-8" />

      {/* Weekly Chart */}
      <h2 className="mb-4 text-xl font-bold">กราฟ Progress รายสัปดาห์</h2>
      <Card>
        <CardContent className="pt-6">
          {stats.weeklyData.some((d) => d.total > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="correct"
                  name="ตอบถูก"
                  fill="oklch(0.488 0.243 264.376)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="total"
                  name="ทำทั้งหมด"
                  fill="oklch(0.8 0.05 250)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              ยังไม่มีข้อมูล — เริ่มฝึกโจทย์เพื่อดูกราฟพัฒนาการ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
