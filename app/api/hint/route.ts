import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer } = await request.json();

    if (!question || !userAnswer || !correctAnswer) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback mock hint when no API key is set
      return Response.json({
        hint: `💡 คำใบ้สำหรับโจทย์นี้:\n\nโจทย์: ${question}\n\nคุณตอบ: ${userAnswer} ซึ่งยังไม่ถูกต้อง\nคำตอบที่ถูกคือ: ${correctAnswer}\n\n📝 วิธีคิด:\nลองทบทวนสูตรและหลักการที่เกี่ยวข้องกับโจทย์ข้อนี้อีกครั้ง แล้วลองแทนค่าดูทีละขั้นตอนนะครับ\n\n(หมายเหตุ: นี่คือ hint ตัวอย่าง — ตั้งค่า ANTHROPIC_API_KEY เพื่อใช้ AI hint จริง)`,
      });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `นักเรียนกำลังแก้โจทย์: ${question}
คำตอบที่นักเรียนตอบ: ${userAnswer}
คำตอบที่ถูกต้อง: ${correctAnswer}
กรุณาอธิบายวิธีคิดแบบ step-by-step เป็นภาษาไทย ให้เข้าใจง่าย เหมือนครูสอนนักเรียน ม.ปลาย`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const hint = textBlock ? textBlock.text : "ไม่สามารถสร้าง hint ได้";

    return Response.json({ hint });
  } catch (error) {
    console.error("Hint API error:", error);
    return Response.json(
      { error: "Failed to generate hint" },
      { status: 500 }
    );
  }
}
