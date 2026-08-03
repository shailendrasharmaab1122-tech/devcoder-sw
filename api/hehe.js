export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  // Auto-detect target based on the path or keywords
  let targetUrl = "";
  if (path.includes("pdfs") || path.startsWith("courses/") && path.includes("/pdfs")) {
    const searchParams = new URLSearchParams(queryParams).toString();
    targetUrl = `https://gdgoenkaratia.com/api/${path}${searchParams ? '?' + searchParams : ''}`;
  } else {
    const searchParams = new URLSearchParams(queryParams).toString();
    targetUrl = `https://backend.multistreaming.site/api/${path}${searchParams ? '?' + searchParams : ''}`;
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      redirect: "follow"
    });

    const buffer = await response.arrayBuffer();
    const data = Buffer.from(buffer);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");

    return res.status(response.status).send(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
