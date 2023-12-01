import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const prompt = await req.json();

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Translate the following text into the language specified in the text. The language may be misspelled, incorrectly labeled, or not clearly stated. If no language is given, or you are confused, just translate to English.",
        },
        {
          role: "user",
          content: "The quick brown fox jumps over the lazy dog in French",
        },
        {
          role: "assistant",
          content: "Le renard brun rapide saute par-dessus le chien paresseux.",
        },
        {
          role: "user",
          content:
            "To be, or not to be, that is the question, translate to spanish",
        },
        {
          role: "assistant",
          content: "Ser o no ser, esa es la cuestión.",
        },
        {
          role: "user",
          content:
            "All human beings are born free and equal in dignity and rights. The Language Hitler Spoke",
        },
        {
          role: "assistant",
          content:
            "Alle Menschen werden frei und gleich an Würde und Rechten geboren.",
        },
        {
          role: "user",
          content:
            "Life is what happens when you're busy making other plans. American",
        },
        {
          role: "assistant",
          content: "Life is what happens when you're busy making other plans.",
        },
        {
          role: "user",
          content: "It's a small world after all, trasnlate to italy.",
        },
        {
          role: "assistant",
          content: "È un piccolo mondo dopo tutto.",
        },
        {
          role: "user",
          content:
            "Beautiful is better than ugly - Python philosophy in Russian",
        },
        {
          role: "assistant",
          content: "Красивое лучше, чем уродливое.",
        },
        {
          role: "user",
          content:
            "Freedom is nothing but a chance to be better, translate this in Americana.",
        },
        {
          role: "assistant",
          content: "Freedom is nothing but a chance to be better.",
        },
        {
          role: "user",
          content: prompt.prompt,
        },
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.log("[GENERATE_POST]", e);
    return new NextResponse("Internal Error beng resolved" + e, {
      status: 500,
    });
  }
}
