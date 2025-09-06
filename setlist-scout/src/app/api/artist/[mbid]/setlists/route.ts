import { NextResponse } from "next/server";
const BASE = "https://api.setlist.fm/rest/1.0";

export async function GET(
  req: Request,
  { params }: { params: { mbid: string } }
) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("p") ?? "1";

  if (!params.mbid) {
    return NextResponse.json({ error: "Missing mbid" }, { status: 400 });
  }

  const res = await fetch(
    `${BASE}/artist/${params.mbid}/setlists?p=${page}`,
    {
      headers: {
        Accept: "application/json",
        "x-api-key": process.env.SETLIST_FM_API_KEY ?? "",
        "Accept-Language": "en",
      },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    const msg = await res.text();
    return NextResponse.json({ error: msg || res.statusText }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
