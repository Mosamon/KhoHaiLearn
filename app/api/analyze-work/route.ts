import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer, studentWork } =
      await request.json();

    if (!question || !userAnswer || !correctAnswer || !studentWork) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return Response.json({
        analysis: `📝 วิเคราะห์วิธีทำของคุณ:

โจทย์: ${question}
คุณตอบ: ${userAnswer}
คำตอบที่ถูก: ${correctAnswer}

วิธีทำที่คุณเขียน:
"${studentWork}"

✅ สิ่งที่ทำถูก: คุณเริ่มต้นแนวคิดได้ดี
❌ จุดที่ควรแก้: ลองทบทวนขั้นตอนการคำนวณอีกครั้ง อาจมีจุดที่คำนวณผิดพลาด
💡 คำแนะนำ: ลองเขียนแต่ละขั้นตอนให้ชัดเจน แล้วตรวจทีละขั้น

(หมายเหตุ: นี่คือการวิเคราะห์ตัวอย่าง — ตั้งค่า ANTHROPIC_API_KEY เพื่อใช้ AI วิเคราะห์จริง)`,
      });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `คุณเป็นครูคณิตศาสตร์ ม.ปลาย กำลังตรวจวิธีทำของนักเรียน

โจทย์: ${question}
คำตอบที่นักเรียนเลือก: ${userAnswer}
คำตอบที่ถูกต้อง: ${correctAnswer}

วิธีทำของนักเรียน:
"""
${studentWork}
"""

กรุณาวิเคราะห์:
1. ขั้นตอนที่ทำถูก (ชมเชยสั้นๆ)
2. จุดที่ผิดพลาด — ผิดตรงไหน ทำไมถึงผิด
3. วิธีทำที่ถูกต้อง step-by-step
4. สรุปสิ่งที่ควรระวังครั้งต่อไป

ตอบเป็นภาษาไทย เข้าใจง่าย เป็นกันเอง
(นักเรียนอาจเขียนสูตรแบบไม่เป็นทางการ เช่น x^2 แทน x²)`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const analysis = textBlock
      ? textBlock.text
      : "ไม่สามารถวิเคราะห์ได้";

    return Response.json({ analysis });
  } catch (error) {
    console.error("Analyze work API error:", error);
    return Response.json(
      { error: "Failed to analyze work" },
      { status: 500 }
    );
  }
}
