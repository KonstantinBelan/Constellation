import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, HoroscopeResponse } from "../types";

const apiKey = process.env.API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateHoroscope = async (user: UserProfile): Promise<HoroscopeResponse> => {
  if (!ai) {
    throw new Error("API Key is missing.");
  }

  const currentDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const periodTextMap: Record<string, string> = {
    'Today': `на сегодня (${currentDate})`,
    'Tomorrow': 'на завтра',
    'Week': 'на ближайшую неделю',
    'Month': 'на текущий месяц'
  };

  const styleInstructionMap: Record<string, string> = {
    'Serious': 'Стиль: Профессиональный, мистический, глубокий, но лаконичный и поддерживающий. Избегай негатива.',
    'Humorous': 'Стиль: Шуточный, веселый, ироничный, с добрым сарказмом. Используй забавные метафоры.'
  };

  const focusInstruction = user.focus === 'Общий' 
    ? 'Составь сбалансированный прогноз, где все разделы (Общее, Любовь, Карьера, Здоровье) одинаково важны и информативны.'
    : `Пользователя особенно волнует сфера "${user.focus}". Сделай раздел "${user.focus}" максимально развернутым, подробным и детальным (минимум 4-5 предложений). Остальные разделы опиши кратко.`;

  const prompt = `
    Ты мудрый астролог. Составь персональный гороскоп.
    
    Информация о пользователе:
    - Имя: ${user.name || "Путешественник"}
    - Знак зодиака: ${user.sign}
    - Пол: ${user.gender}
    - Период прогноза: ${periodTextMap[user.period]}
    
    ${styleInstructionMap[user.style]}
    ${focusInstruction}

    Также оцени благоприятность этого периода в процентах (0-100) для четырех сфер: Любовь, Карьера, Здоровье, Общая удача.

    Ответ должен быть строго в формате JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "Заголовок даты или периода прогноза (например '15 Октября' или '16-22 Октября')" },
            general: { type: Type.STRING, description: "Общий прогноз" },
            love: { type: Type.STRING, description: "Прогноз в сфере отношений" },
            career: { type: Type.STRING, description: "Прогноз в сфере работы и финансов" },
            health: { type: Type.STRING, description: "Прогноз здоровья и самочувствия" },
            luckyColor: { type: Type.STRING, description: "Цвет удачи (одним словом или словосочетанием)" },
            luckyNumber: { type: Type.STRING, description: "Число удачи" },
            mood: { type: Type.STRING, description: "Эмоциональный фон (одним словом)" },
            advice: { type: Type.STRING, description: "Короткий совет" },
            scores: {
              type: Type.OBJECT,
              properties: {
                love: { type: Type.INTEGER, description: "Оценка сферы Любви (0-100)" },
                career: { type: Type.INTEGER, description: "Оценка сферы Карьеры (0-100)" },
                health: { type: Type.INTEGER, description: "Оценка сферы Здоровья (0-100)" },
                general: { type: Type.INTEGER, description: "Оценка Общей удачи (0-100)" }
              },
              required: ["love", "career", "health", "general"]
            }
          },
          required: ["date", "general", "love", "career", "health", "luckyColor", "luckyNumber", "mood", "advice", "scores"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    return JSON.parse(jsonText) as HoroscopeResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Не удалось получить предсказание звезд. Попробуйте позже.");
  }
};