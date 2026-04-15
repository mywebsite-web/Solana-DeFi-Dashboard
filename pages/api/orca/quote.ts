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
    const { inputMint, outputMint, amount } = req.query;

    if (!inputMint || !outputMint || !amount) {
      return res
        .status(400)
        .json({ error: "Missing required parameters: inputMint, outputMint, amount" });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Orca API endpoint for price quotes
      const orcaUrl = new URL("https://api.orca.so/v1/quote");
      orcaUrl.searchParams.set("inputMint", inputMint as string);
      orcaUrl.searchParams.set("outputMint", outputMint as string);
      orcaUrl.searchParams.set("amount", amount as string);
      orcaUrl.searchParams.set("slippageTolerance", "0.005"); // 0.5% default

      let response = await fetch(orcaUrl.toString(), {
        signal: controller.signal,
      }).catch(async () => {
        // If Orca fails, try through CORS proxy
        console.warn("Direct Orca call failed, trying CORS proxy...");
        const corsProxy = "https://corsproxy.io/?";
        return fetch(corsProxy + orcaUrl.toString(), { signal: controller.signal });
      });

      if (!response.ok) {
        const error = await response.text();
        return res
          .status(response.status)
          .json({ error: `Orca quote error: ${response.status}`, details: error });
      }

      const data = await response.json();
      res.status(200).json(data);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Orca quote error:", errorMessage);
    res.status(500).json({ error: "Failed to fetch Orca quote", details: errorMessage });
  }
}
