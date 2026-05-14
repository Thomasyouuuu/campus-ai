import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: {
    messages: Array<{ role: string; content: string }>;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = body.apiKey || process.env.AI_API_KEY;
  const baseUrl =
    body.baseUrl ||
    process.env.AI_API_BASE_URL ||
    "https://api.deepseek.com/v1";
  const model = body.model || process.env.AI_MODEL || "deepseek-chat";

  if (!apiKey) {
    return NextResponse.json(
      { error: "API Key not configured" },
      { status: 400 },
    );
  }

  if (!body.messages?.length) {
    return NextResponse.json(
      { error: "Messages array is empty" },
      { status: 400 },
    );
  }

  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: body.messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      let errorMsg = `Upstream error ${response.status}`;
      try {
        const errJson = JSON.parse(text);
        errorMsg = errJson.error?.message || errorMsg;
      } catch {
        errorMsg = text || errorMsg;
      }
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "AI service timeout" },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { error: "Failed to reach AI service" },
      { status: 502 },
    );
  }
}
