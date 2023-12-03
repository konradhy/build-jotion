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
            "You are an AI capable of creating stories. Generate a story based on the provided elements. Be colorful in your details. Pick a genre and stick to it. Add twists at the end.",
        },
        {
          role: "user",
          content: `Here is some random user input by me for which you are to create a story ${prompt.prompt}`,
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
