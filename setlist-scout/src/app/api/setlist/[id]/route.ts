import { NextResponse } from "next/server";
const BASE = "https://api.setlist.fm/rest/1.0";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "Missing setlist id" }, { status: 400 });
  }

  const res = await fetch(`${BASE}/setlist/${params.id}`, {
    headers: {
      Accept: "application/json",
      "x-api-key": process.env.SETLIST_FM_API_KEY ?? "",
      "Accept-Language": "en",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const msg = await res.text();
    return NextResponse.json({ error: msg || res.statusText }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}
