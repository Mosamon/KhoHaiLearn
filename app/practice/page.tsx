"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  problems,
  categoryLabels,
  type Category,
  type Problem,
} from "@/lib/problems";
import { recordAnswer } from "@/lib/store";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<Category>("algebra");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [questionQueue] = useState<Record<Category, Problem[]>>(() => ({
    algebra: shuffle(problems.filter((p) => p.category === "algebra")),
    calculus: shuffle(problems.filter((p) => p.category === "calculus")),
    probability: shuffle(problems.filter((p) => p.category === "probability")),
    geometry: shuffle(problems.filter((p) => p.category === "geometry")),
  }));
  const [queueIndex, setQueueIndex] = useState<Record<Category, number>>({
    algebra: 0,
    calculus: 0,
    probability: 0,
    geometry: 0,
  });

  // Answer attempt state
  const [wrongAttempts, setWrongAttempts] = useState<Set<string>>(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const isFinished = isCorrect || gaveUp; // เฉลยแล้ว (ถูก หรือ ยอมแพ้)

  // Show-your-work state
  const [studentWork, setStudentWork] = useState("");
  const [showWorkInput, setShowWorkInput] = useState(false);
  const [workAnalysis, setWorkAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const currentProblem = useMemo(() => {
    const queue = questionQueue[activeTab];
    const idx = queueIndex[activeTab];
    return queue[idx % queue.length];
  }, [activeTab, questionQueue, queueIndex]);

  const totalProblems = problems.length;
  const progressPercent = Math.min((completed / totalProblems) * 100, 100);

  const hasWork = studentWork.trim().length > 0;

  const getChoiceLabel = useCallback(
    (key: string | null) => {
      if (!key) return "ไม่ได้ตอบ";
      return `${key}. ${currentProblem.choices[key as keyof typeof currentProblem.choices]}`;
    },
    [currentProblem]
  );

  const handleAnalyzeWork = useCallback(async () => {
    setAnalysisLoading(true);
    try {
      const res = await fetch("/api/analyze-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentProblem.question,
          userAnswer: getChoiceLabel(selectedAnswer),
          correctAnswer: getChoiceLabel(currentProblem.answer),
          studentWork,
        }),
      });
      const data = await res.json();
      setWorkAnalysis(data.analysis || data.error || "ไม่สามารถวิเคราะห์ได้");
    } catch {
      setWorkAnalysis("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setAnalysisLoading(false);
    }
  }, [currentProblem, selectedAnswer, studentWork, getChoiceLabel]);

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentProblem.answer) {
      // ถูก!
      setIsCorrect(true);
      setCompleted((c) => c + 1);
      recordAnswer(currentProblem.category, true, hasWork);
    } else {
      // ผิด — เพิ่มเข้า wrongAttempts แล้วให้ลองใหม่
      setWrongAttempts((prev) => new Set(prev).add(selectedAnswer));
      setSelectedAnswer(null);
    }
  }, [selectedAnswer, currentProblem, hasWork]);

  const handleGiveUp = useCallback(() => {
    setGaveUp(true);
    setCompleted((c) => c + 1);
    recordAnswer(currentProblem.category, false, hasWork);

    // Auto-analyze if student wrote work
    if (hasWork) {
      // Need to set selectedAnswer context for analysis
      setAnalysisLoading(true);
      const lastWrong = [...wrongAttempts].pop() || selectedAnswer;
      fetch("/api/analyze-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentProblem.question,
          userAnswer: getChoiceLabel(lastWrong),
          correctAnswer: getChoiceLabel(currentProblem.answer),
          studentWork,
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          setWorkAnalysis(data.analysis || data.error || "ไม่สามารถวิเคราะห์ได้")
        )
        .catch(() => setWorkAnalysis("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"))
        .finally(() => setAnalysisLoading(false));
    }
  }, [currentProblem, hasWork, wrongAttempts, selectedAnswer, studentWork, getChoiceLabel]);

  const handleNext = useCallback(() => {
    setQueueIndex((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + 1,
    }));
    setSelectedAnswer(null);
    setIsCorrect(false);
    setGaveUp(false);
    setWrongAttempts(new Set());
    setHint(null);
    setStudentWork("");
    setShowWorkInput(false);
    setWorkAnalysis(null);
  }, [activeTab]);

  const handleHint = useCallback(async () => {
    setHintLoading(true);
    try {
      const lastWrong = [...wrongAttempts].pop() || selectedAnswer;
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentProblem.question,
          userAnswer: getChoiceLabel(lastWrong),
          correctAnswer: getChoiceLabel(currentProblem.answer),
        }),
      });
      const data = await res.json();
      setHint(data.hint || data.error || "ไม่สามารถสร้าง hint ได้");
    } catch {
      setHint("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setHintLoading(false);
    }
  }, [currentProblem, selectedAnswer, wrongAttempts, getChoiceLabel]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as Category);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setGaveUp(false);
    setWrongAttempts(new Set());
    setHint(null);
    setStudentWork("");
    setShowWorkInput(false);
    setWorkAnalysis(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">ฝึกโจทย์คณิตศาสตร์</h1>
        <p className="text-muted-foreground">
          เลือกหมวดที่ต้องการฝึก แล้วเริ่มทำโจทย์ได้เลย
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              ทำไปแล้ว {completed} ข้อ จากทั้งหมด {totalProblems} ข้อ
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6 grid w-full grid-cols-4">
          {(Object.entries(categoryLabels) as [Category, string][]).map(
            ([key, label]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            )
          )}
        </TabsList>

        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <TabsContent key={cat} value={cat}>
            {/* Question Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{categoryLabels[cat]}</Badge>
                  <Badge variant="secondary">
                    ข้อที่ {queueIndex[cat] + 1}
                  </Badge>
                  {wrongAttempts.size > 0 && !isFinished && (
                    <Badge variant="destructive" className="text-xs">
                      ตอบผิด {wrongAttempts.size} ครั้ง
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentProblem.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Answer Choices */}
                <div className="grid gap-3">
                  {(
                    Object.entries(currentProblem.choices) as [string, string][]
                  ).map(([key, value]) => {
                    const wasWrong = wrongAttempts.has(key);
                    let variant:
                      | "outline"
                      | "default"
                      | "secondary"
                      | "destructive" = "outline";

                    if (isFinished) {
                      // เฉลยแล้ว — แสดงข้อถูกเป็นสีเขียว, ข้อผิดเป็นสีแดง
                      if (key === currentProblem.answer) variant = "default";
                      else if (wasWrong) variant = "destructive";
                    } else if (wasWrong) {
                      // ข้อที่เคยตอบผิด — แสดงเป็นสีแดงจางๆ
                      variant = "destructive";
                    } else if (key === selectedAnswer) {
                      variant = "secondary";
                    }

                    return (
                      <Button
                        key={key}
                        variant={variant}
                        className={`h-auto justify-start whitespace-normal py-3 px-4 text-left text-base ${
                          wasWrong && !isFinished ? "opacity-50" : ""
                        }`}
                        onClick={() => {
                          if (!isFinished && !wasWrong) setSelectedAnswer(key);
                        }}
                        disabled={isFinished || wasWrong}
                      >
                        <span className="mr-3 font-bold">{key}.</span>
                        {value}
                        {wasWrong && !isFinished && (
                          <span className="ml-auto text-xs">✗</span>
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Show Your Work (collapsible) */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => !isFinished && setShowWorkInput((v) => !v)}
                    className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
                    disabled={isFinished}
                  >
                    <ChevronDown
                      className={`size-4 transition-transform ${showWorkInput ? "rotate-180" : ""}`}
                    />
                    <span>
                      {showWorkInput
                        ? "ซ่อนวิธีทำ"
                        : "แสดงวิธีทำ (ไม่บังคับ)"}
                    </span>
                    {hasWork && !showWorkInput && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        เขียนแล้ว
                      </Badge>
                    )}
                  </button>

                  {showWorkInput && (
                    <div className="mt-3">
                      <textarea
                        value={studentWork}
                        onChange={(e) =>
                          setStudentWork(e.target.value.slice(0, 1000))
                        }
                        disabled={isFinished}
                        rows={4}
                        placeholder="เขียนวิธีทำของคุณที่นี่... เช่น สูตรที่ใช้ ขั้นตอนการคำนวณ"
                        className="w-full resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                      />
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        {studentWork.length}/1000
                      </p>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Submit / Result Section */}
                <div className="flex flex-wrap gap-3">
                  {!isFinished ? (
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleSubmit}
                        disabled={!selectedAnswer}
                        size="lg"
                      >
                        ส่งคำตอบ
                      </Button>
                      {wrongAttempts.size > 0 && (
                        <>
                          {!hint && (
                            <Button
                              variant="outline"
                              onClick={handleHint}
                              disabled={hintLoading}
                            >
                              {hintLoading
                                ? "กำลังโหลด..."
                                : "💡 ขอ Hint จาก AI"}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            onClick={handleGiveUp}
                            className="text-muted-foreground"
                          >
                            🏳️ ยอมแพ้ ดูเฉลย
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex w-full items-center gap-3 mb-3">
                        {isCorrect ? (
                          <Badge className="bg-green-600 text-white text-base px-4 py-1">
                            ✅ ถูกต้อง!
                            {wrongAttempts.size > 0 && (
                              <span className="ml-2 font-normal">
                                (ลองผิด {wrongAttempts.size} ครั้ง)
                              </span>
                            )}
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="text-base px-4 py-1"
                          >
                            เฉลย: {currentProblem.answer}.{" "}
                            {currentProblem.choices[currentProblem.answer]}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {/* AI feedback buttons */}
                        {gaveUp && !hasWork && !hint && (
                          <Button
                            variant="outline"
                            onClick={handleHint}
                            disabled={hintLoading}
                          >
                            {hintLoading
                              ? "กำลังโหลด..."
                              : "💡 ขอ Hint จาก AI"}
                          </Button>
                        )}

                        {/* Show analyze button for correct answers with work */}
                        {isCorrect && hasWork && !workAnalysis && (
                          <Button
                            variant="outline"
                            onClick={handleAnalyzeWork}
                            disabled={analysisLoading}
                          >
                            {analysisLoading
                              ? "กำลังวิเคราะห์..."
                              : "📝 วิเคราะห์วิธีทำ"}
                          </Button>
                        )}

                        {/* Loading indicator for auto-analysis (gave up + has work) */}
                        {gaveUp && hasWork && analysisLoading && !workAnalysis && (
                          <Badge variant="secondary" className="px-3 py-1">
                            กำลังวิเคราะห์วิธีทำ...
                          </Badge>
                        )}

                        <Button onClick={handleNext}>ข้อถัดไป →</Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Analysis Card */}
            {workAnalysis && (
              <Card className="mb-6 border-blue-500/30 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    📝 วิเคราะห์วิธีทำ
                  </CardTitle>
                  <CardDescription>
                    AI ตรวจวิธีทำของคุณ แล้วชี้จุดที่ควรปรับปรุง
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {workAnalysis}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Hint Card */}
            {hint && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">
                    💡 AI Hint — วิธีคิด
                  </CardTitle>
                  <CardDescription>
                    อธิบายโดย AI เป็นภาษาไทย แบบ step-by-step
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {hint}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
