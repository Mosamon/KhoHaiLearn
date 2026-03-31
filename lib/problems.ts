export type Category = "algebra" | "calculus" | "probability" | "geometry";

export interface Problem {
  id: number;
  category: Category;
  question: string;
  choices: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
  explanation: string;
}

export const categoryLabels: Record<Category, string> = {
  algebra: "พีชคณิต",
  calculus: "แคลคูลัส",
  probability: "ความน่าจะเป็น",
  geometry: "เรขาคณิต",
};

export const problems: Problem[] = [
  // === พีชคณิต (Algebra) ===
  {
    id: 1,
    category: "algebra",
    question: "ถ้า x² - 5x + 6 = 0 แล้ว x มีค่าเท่ากับข้อใด",
    choices: { A: "1, 6", B: "2, 3", C: "-2, -3", D: "1, 5" },
    answer: "B",
    explanation: "แยกตัวประกอบ (x-2)(x-3) = 0 ดังนั้น x = 2 หรือ x = 3",
  },
  {
    id: 2,
    category: "algebra",
    question: "ค่าของ log₂(32) เท่ากับเท่าไร",
    choices: { A: "4", B: "5", C: "6", D: "3" },
    answer: "B",
    explanation: "2⁵ = 32 ดังนั้น log₂(32) = 5",
  },
  {
    id: 3,
    category: "algebra",
    question: "ถ้า f(x) = 2x + 3 แล้ว f(f(1)) มีค่าเท่ากับเท่าไร",
    choices: { A: "11", B: "13", C: "15", D: "9" },
    answer: "B",
    explanation: "f(1) = 2(1)+3 = 5, f(5) = 2(5)+3 = 13",
  },
  {
    id: 4,
    category: "algebra",
    question: "ผลบวกของอนุกรมเลขคณิต 2 + 5 + 8 + ... + 29 เท่ากับเท่าไร",
    choices: { A: "150", B: "155", C: "160", D: "145" },
    answer: "B",
    explanation:
      "a=2, d=3, aₙ=29 → n=10, S = n(a₁+aₙ)/2 = 10(2+29)/2 = 155",
  },
  {
    id: 5,
    category: "algebra",
    question: "เซต A = {1,2,3,4,5} และ B = {3,4,5,6,7} แล้ว A ∩ B มีสมาชิกกี่ตัว",
    choices: { A: "2", B: "3", C: "4", D: "5" },
    answer: "B",
    explanation: "A ∩ B = {3,4,5} มี 3 สมาชิก",
  },

  // === แคลคูลัส (Calculus) ===
  {
    id: 6,
    category: "calculus",
    question: "อนุพันธ์ของ f(x) = 3x² + 2x - 1 คือข้อใด",
    choices: { A: "6x + 2", B: "6x - 2", C: "3x + 2", D: "6x + 1" },
    answer: "A",
    explanation: "f'(x) = 6x + 2 (ใช้กฎ power rule)",
  },
  {
    id: 7,
    category: "calculus",
    question: "∫(2x + 3)dx เท่ากับข้อใด",
    choices: {
      A: "x² + 3x + C",
      B: "x² + 3 + C",
      C: "2x² + 3x + C",
      D: "x² + C",
    },
    answer: "A",
    explanation: "∫(2x+3)dx = x² + 3x + C",
  },
  {
    id: 8,
    category: "calculus",
    question: "ค่า lim(x→0) (sin x)/x เท่ากับเท่าไร",
    choices: { A: "0", B: "1", C: "∞", D: "ไม่มีค่า" },
    answer: "B",
    explanation: "เป็นลิมิตพื้นฐานที่สำคัญ lim(x→0) sinx/x = 1",
  },
  {
    id: 9,
    category: "calculus",
    question: "ถ้า f(x) = x³ - 3x แล้ว f'(x) = 0 เมื่อ x เท่ากับเท่าไร",
    choices: { A: "0, 3", B: "1, -1", C: "-1, 3", D: "0, 1" },
    answer: "B",
    explanation: "f'(x) = 3x² - 3 = 0 → x² = 1 → x = 1 หรือ x = -1",
  },
  {
    id: 10,
    category: "calculus",
    question: "∫₀¹ 2x dx มีค่าเท่ากับเท่าไร",
    choices: { A: "0", B: "1", C: "2", D: "0.5" },
    answer: "B",
    explanation: "∫₀¹ 2x dx = [x²]₀¹ = 1 - 0 = 1",
  },

  // === ความน่าจะเป็น (Probability) ===
  {
    id: 11,
    category: "probability",
    question: "ทอดลูกเต๋า 1 ลูก ความน่าจะเป็นที่จะได้แต้มมากกว่า 4 คือเท่าไร",
    choices: { A: "1/6", B: "1/3", C: "1/2", D: "2/3" },
    answer: "B",
    explanation: "แต้มที่มากกว่า 4 คือ 5 และ 6 → P = 2/6 = 1/3",
  },
  {
    id: 12,
    category: "probability",
    question:
      "หยิบไพ่ 1 ใบจากสำรับ 52 ใบ ความน่าจะเป็นที่จะได้ไพ่หัวใจคือเท่าไร",
    choices: { A: "1/13", B: "1/4", C: "1/2", D: "1/52" },
    answer: "B",
    explanation: "ไพ่หัวใจมี 13 ใบจากทั้งหมด 52 ใบ → P = 13/52 = 1/4",
  },
  {
    id: 13,
    category: "probability",
    question: "โยนเหรียญ 3 ครั้ง ความน่าจะเป็นที่จะได้หัวทั้ง 3 ครั้งคือเท่าไร",
    choices: { A: "1/2", B: "1/4", C: "1/8", D: "3/8" },
    answer: "C",
    explanation: "P = (1/2)³ = 1/8",
  },
  {
    id: 14,
    category: "probability",
    question:
      "จำนวนวิธีเลือกกรรมการ 3 คนจาก 10 คน (ไม่สนลำดับ) เท่ากับเท่าไร",
    choices: { A: "120", B: "720", C: "210", D: "30" },
    answer: "A",
    explanation: "C(10,3) = 10!/(3!×7!) = 120",
  },
  {
    id: 15,
    category: "probability",
    question:
      "ถ้า P(A) = 0.3 และ P(B) = 0.4 โดย A กับ B เป็นอิสระกัน P(A∩B) เท่ากับเท่าไร",
    choices: { A: "0.7", B: "0.12", C: "0.1", D: "0.58" },
    answer: "B",
    explanation: "เมื่อ A กับ B เป็นอิสระกัน P(A∩B) = P(A)×P(B) = 0.3×0.4 = 0.12",
  },

  // === เรขาคณิต (Geometry) ===
  {
    id: 16,
    category: "geometry",
    question: "พื้นที่วงกลมรัศมี 7 ซม. เท่ากับกี่ ตร.ซม. (ใช้ π ≈ 22/7)",
    choices: { A: "144", B: "154", C: "164", D: "176" },
    answer: "B",
    explanation: "A = πr² = (22/7)(7²) = (22/7)(49) = 154 ตร.ซม.",
  },
  {
    id: 17,
    category: "geometry",
    question:
      "สามเหลี่ยมมีด้าน 3, 4, 5 ซม. เป็นสามเหลี่ยมชนิดใด",
    choices: {
      A: "สามเหลี่ยมมุมแหลม",
      B: "สามเหลี่ยมมุมฉาก",
      C: "สามเหลี่ยมมุมป้าน",
      D: "สามเหลี่ยมด้านเท่า",
    },
    answer: "B",
    explanation: "3² + 4² = 9 + 16 = 25 = 5² เป็นไปตามทฤษฎีพีทาโกรัส",
  },
  {
    id: 18,
    category: "geometry",
    question: "ระยะทางระหว่างจุด (1,2) กับ (4,6) เท่ากับเท่าไร",
    choices: { A: "4", B: "5", C: "6", D: "7" },
    answer: "B",
    explanation: "d = √((4-1)² + (6-2)²) = √(9+16) = √25 = 5",
  },
  {
    id: 19,
    category: "geometry",
    question:
      "มุมภายในของรูปหกเหลี่ยมด้านเท่ารวมกันเท่ากับกี่องศา",
    choices: { A: "540", B: "720", C: "900", D: "1080" },
    answer: "B",
    explanation: "ผลบวกมุมภายใน = (n-2)×180 = (6-2)×180 = 720 องศา",
  },
  {
    id: 20,
    category: "geometry",
    question:
      "เส้นตรง y = 2x + 1 มีความชัน (slope) เท่ากับเท่าไร",
    choices: { A: "1", B: "2", C: "3", D: "-1" },
    answer: "B",
    explanation: "จากสมการ y = mx + c ค่า m (ความชัน) = 2",
  },
  {
    id: 21,
    category: "algebra",
    question: "ค่าของ |−7| + |3| เท่ากับเท่าไร",
    choices: { A: "4", B: "-4", C: "10", D: "-10" },
    answer: "C",
    explanation: "|−7| = 7 และ |3| = 3 ดังนั้น 7 + 3 = 10",
  },
  {
    id: 22,
    category: "calculus",
    question: "อนุพันธ์ของ f(x) = eˣ คือข้อใด",
    choices: { A: "xeˣ⁻¹", B: "eˣ", C: "eˣ⁺¹", D: "1/eˣ" },
    answer: "B",
    explanation: "อนุพันธ์ของ eˣ คือ eˣ เสมอ",
  },
  {
    id: 23,
    category: "probability",
    question: "ค่าเฉลี่ยของข้อมูล 2, 4, 6, 8, 10 เท่ากับเท่าไร",
    choices: { A: "5", B: "6", C: "7", D: "8" },
    answer: "B",
    explanation: "ค่าเฉลี่ย = (2+4+6+8+10)/5 = 30/5 = 6",
  },
  {
    id: 24,
    category: "geometry",
    question: "ปริมาตรของทรงกลมรัศมี 3 ซม. เท่ากับกี่ ลบ.ซม. (เอาค่า π ≈ 3.14)",
    choices: { A: "113.04", B: "84.78", C: "28.26", D: "150.72" },
    answer: "A",
    explanation: "V = (4/3)πr³ = (4/3)(3.14)(27) = 113.04 ลบ.ซม.",
  },
];
