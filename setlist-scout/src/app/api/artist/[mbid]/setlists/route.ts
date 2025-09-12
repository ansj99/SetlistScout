import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ mbid: string }> }
): Promise<NextResponse> {
  const { mbid } = await context.params;

  if (!mbid) {
    return NextResponse.json({ error: "Missing artist MBID" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.setlist.fm/rest/1.0/artist/${mbid}/setlists?p=1`,
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
