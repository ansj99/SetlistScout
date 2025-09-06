import { NextResponse } from "next/server";

const BASE = "https://api.setlist.fm/rest/1.0";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const page = searchParams.get("p") ?? "1";

  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const res = await fetch(
    `${BASE}/search/artists?artistName=${encodeURIComponent(name)}&sort=relevance&p=${page}`,
    {
      headers: {
        Accept: "application/json",
        "x-api-key": process.env.SETLIST_FM_API_KEY ?? "",
        "Accept-Language": "en",
      },
      // Cache on the server for 5 minutes to ease rate limits
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    return NextResponse.json({ error: msg || res.statusText }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
