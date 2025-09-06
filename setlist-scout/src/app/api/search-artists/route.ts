import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Missing artist name" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.setlist.fm/rest/1.0/search/artists?artistName=${encodeURIComponent(
      name
    )}&p=1&sort=relevance`,
    {
      headers: {
        "x-api-key": process.env.SETLIST_FM_API_KEY as string,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
