import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Try direct call first
      let response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      }).catch(async () => {
        // If direct call fails, try different CORS proxies
        console.warn("Direct Jupiter swap call failed, trying CORS proxies...");
        
        const swapUrl = "https://quote-api.jup.ag/v6/swap";
        const proxies = [
          `https://corsproxy.io/?${swapUrl}`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(swapUrl)}`,
        ];
        
        for (const proxy of proxies) {
          try {
            const proxyResponse = await fetch(proxy, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
              signal: controller.signal,
            });
            if (proxyResponse.ok) return proxyResponse;
          } catch (e) {
            console.warn(`Proxy ${proxy} failed, trying next...`);
          }
        }
        
        throw new Error("All CORS proxies failed");
      });

      if (!response.ok) {
        const error = await response.text();
        return res
          .status(response.status)
          .json({ error: `Jupiter swap error: ${response.status}`, details: error });
      }

      const data = await response.json();
      res.status(200).json(data);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Proxy swap error:", errorMessage);
    res.status(500).json({ error: "Failed to build swap", details: errorMessage });
  }
}
