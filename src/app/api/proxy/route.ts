import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url)
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch remote file" },
        { status: 500 },
      );
    }

    const pdfBuffer = await response.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `inline; filename="proxied.pdf"`);
    headers.set("Content-Length", response.headers.get("content-length") ?? "");

    const res = new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy failed", detail: String(error) },
      { status: 500 },
    );
  }
}
