import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    const { primaryArchetype, shadowLevel, answers, sessionId } = await req.json();

    if (!primaryArchetype || !sessionId) {
      return NextResponse.json({ error: "Missing required tracking nodes" }, { status: 400 });
    }

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    if (!apiKey || !folderId) {
      return NextResponse.json({ error: "AI Infrastructure credentials missing" }, { status: 500 });
    }

    // Жесткий клинический промпт на английском под Юнга
    const systemPrompt = `You are a world-class Jungian psychiatrist and expert in behavioral psychoanalysis. 
    The user has completed a subconscious test. Their dominant core archetype is defined as "${primaryArchetype}" with a Shadow Density level of ${shadowLevel}%.
    Write a deep, sophisticated psychological portrait of this user. Explain how their dominant archetype shapes their hidden desires and blind spots. 
    Provide 2 brief but therapeutic insights on how to balance this state. 
    Tone: Philosophical, academic yet mysterious, deeply clinical. Use clear Markdown layout with headers '## '. Do not use introductory fluff or conversational filler.`;

    const yandexResponse = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
        completionOptions: { stream: false, temperature: 0.75, maxTokens: 1500 },
        messages: [
          { role: "system", text: systemPrompt },
          { role: "user", text: `Analyze my shadow state matrix.` }
        ]
      })
    });

    const yandexData = await yandexResponse.json();
    const aiResult = yandexData.result?.alternatives?.[0]?.message?.text;

    if (!aiResult) {
      return NextResponse.json({ error: "Failed to compile the psychological mirror" }, { status: 500 });
    }

    // Бесшовный автономный UPSERT в общую Supabase
    const { error: dbError } = await supabase
      .from("user_archetypes")
      .upsert({
        session_id: sessionId,
        primary_archetype: primaryArchetype,
        shadow_level: shadowLevel,
        quest_answers: answers
      }, { onConflict: 'session_id' });

    if (dbError) {
      console.error("Database synchronisation failure:", dbError.message);
    }

    return NextResponse.json({ result: aiResult });

  } catch (error) {
    console.error("Mirror API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Matrix Error" }, { status: 500 });
  }
}