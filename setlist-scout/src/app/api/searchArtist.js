// api/searchArtist.js
export default async function handler(req, res) {
    const { name } = req.query;
  
    if (!name) {
      return res.status(400).json({ error: "Artist name is required" });
    }
  
    try {
      const response = await fetch(
        `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${encodeURIComponent(
          name
        )}`,
        {
          headers: {
            "x-api-key": process.env.SETLIST_API_KEY,
            Accept: "application/json",
          },
        }
      );
  
      if (!response.ok) {
        return res
          .status(response.status)
          .json({ error: "Failed to fetch from Setlist.fm" });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  