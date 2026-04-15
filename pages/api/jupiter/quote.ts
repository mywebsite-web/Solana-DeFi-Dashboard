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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { inputMint, outputMint, amount, slippageBps } = req.query;

    // Build Jupiter API URL
    const jupiterUrl = new URL("https://quote-api.jup.ag/v6/quote");
    if (inputMint) jupiterUrl.searchParams.set("inputMint", inputMint as string);
    if (outputMint) jupiterUrl.searchParams.set("outputMint", outputMint as string);
    if (amount) jupiterUrl.searchParams.set("amount", amount as string);
    if (slippageBps) jupiterUrl.searchParams.set("slippageBps", slippageBps as string);
    jupiterUrl.searchParams.set("onlyDirectRoutes", "false");
    jupiterUrl.searchParams.set("asLegacyTransaction", "false");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Try direct call first
      let response = await fetch(jupiterUrl.toString(), {
        signal: controller.signal,
      }).catch(async () => {
        // If direct call fails, try different CORS proxies
        console.warn("Direct Jupiter call failed, trying CORS proxies...");
        
        const proxies = [
          `https://corsproxy.io/?${jupiterUrl.toString()}`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(jupiterUrl.toString())}`,
        ];
        
        for (const proxy of proxies) {
          try {
            const proxyResponse = await fetch(proxy, { signal: controller.signal });
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
          .json({ error: `Jupiter quote error: ${response.status}`, details: error });
      }

      const data = await response.json();
      res.status(200).json(data);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Proxy quote error:", errorMessage);
    res.status(500).json({ error: "Failed to fetch quote", details: errorMessage });
  }
}
