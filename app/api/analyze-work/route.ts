import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question, userAnswer, correctAnswer, studentWork, drawingImage } =
      await request.json();

    const hasText = studentWork && studentWork.trim().length > 0;
    const hasImage = drawingImage && typeof drawingImage === "string";

    if (!question || !userAnswer || !correctAnswer || (!hasText && !hasImage)) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      const mockAnalysis = `📝 วิเคราะห์วิธีทำของคุณ:

โจทย์: ${question}
คุณตอบ: ${userAnswer}
คำตอบที่ถูก: ${correctAnswer}
${hasText ? `\nวิธีทำที่คุณเขียน:\n"${studentWork}"` : ""}
${hasImage ? "\n(ได้รับภาพวิธีทำที่เขียนด้วยมือ)" : ""}

✅ สิ่งที่ทำถูก: คุณเริ่มต้นแนวคิดได้ดี
❌ จุดที่ควรแก้: ลองทบทวนขั้นตอนการคำนวณอีกครั้ง อาจมีจุดที่คำนวณผิดพลาด
💡 คำแนะนำ: ลองเขียนแต่ละขั้นตอนให้ชัดเจน แล้วตรวจทีละขั้น

(หมายเหตุ: นี่คือการวิเคราะห์ตัวอย่าง — ตั้งค่า ANTHROPIC_API_KEY เพื่อใช้ AI วิเคราะห์จริง)`;

      return Response.json({
        ...(hasImage
          ? { transcription: "(ตัวอย่าง) x² + 5x + 6 = 0 → (x+2)(x+3) = 0 → x = -2, -3" }
          : {}),
        analysis: mockAnalysis,
      });
    }

    const client = new Anthropic({ apiKey });

    const analysisInstructions = `กรุณาวิเคราะห์:
1. ขั้นตอนที่ทำถูก (ชมเชยสั้นๆ)
2. จุดที่ผิดพลาด — ผิดตรงไหน ทำไมถึงผิด
3. วิธีทำที่ถูกต้อง step-by-step
4. สรุปสิ่งที่ควรระวังครั้งต่อไป

ตอบเป็นภาษาไทย เข้าใจง่าย เป็นกันเอง
(นักเรียนอาจเขียนสูตรแบบไม่เป็นทางการ เช่น x^2 แทน x²)`;

    const promptText = hasImage
      ? `คุณเป็นครูคณิตศาสตร์ ม.ปลาย กำลังตรวจวิธีทำของนักเรียนที่เขียนด้วยลายมือ

โจทย์: ${question}
คำตอบที่นักเรียนเลือก: ${userAnswer}
คำตอบที่ถูกต้อง: ${correctAnswer}
${hasText ? `\nวิธีทำที่นักเรียนพิมพ์เพิ่มเติม:\n"""\n${studentWork}\n"""` : ""}

ดูรูปลายมือที่แนบมา แล้วตอบในรูปแบบ JSON เท่านั้น (ห้ามมีข้อความนอก JSON):
{
  "transcription": "ถอดข้อความ/สูตร/ตัวเลข/สัญลักษณ์ทั้งหมดที่มองเห็นในรูป ให้ครบและตรงตามที่เขียน",
  "analysis": "การวิเคราะห์วิธีทำ (4 ข้อตามที่กำหนด)"
}

${analysisInstructions}`
      : `คุณเป็นครูคณิตศาสตร์ ม.ปลาย กำลังตรวจวิธีทำของนักเรียน

โจทย์: ${question}
คำตอบที่นักเรียนเลือก: ${userAnswer}
คำตอบที่ถูกต้อง: ${correctAnswer}
\nวิธีทำที่นักเรียนพิมพ์:\n"""\n${studentWork}\n"""

${analysisInstructions}`;

    // Build content array — text + optional image
    const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

    if (hasImage) {
      // Extract base64 data from data URL
      const base64Data = (drawingImage as string).replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: base64Data,
        },
      });
    }

    content.push({ type: "text", text: promptText });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const rawText = textBlock ? textBlock.text : "";

    if (hasImage) {
      // Extract JSON response with transcription + analysis
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return Response.json({
            transcription: parsed.transcription ?? null,
            analysis: parsed.analysis ?? rawText,
          });
        } catch {
          // Fall through to plain text
        }
      }
    }

    return Response.json({ analysis: rawText || "ไม่สามารถวิเคราะห์ได้" });
  } catch (error) {
    console.error("Analyze work API error:", error);
    return Response.json(
      { error: "Failed to analyze work" },
      { status: 500 }
    );
  }
}
