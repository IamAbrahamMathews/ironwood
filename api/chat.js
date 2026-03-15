import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Ironwood Shield AI — the embedded cybersecurity assistant for Ironwood, an agentic AI-powered cybersecurity platform. You have deep expertise in all areas of cybersecurity.

You help users understand:
- Cyber threats: malware, ransomware, phishing, DDoS, zero-day exploits, APTs, social engineering
- Network security: firewalls, IDS/IPS, VPNs, network segmentation, DMZ, SD-WAN security
- Internal vs External network defense strategies
- Endpoint protection, EDR, XDR solutions
- Cloud security (AWS, Azure, GCP), SASE, Zero Trust Architecture
- Compliance frameworks: ISO 27001, SOC 2, GDPR, DPDP Act (India), SEBI cybersecurity guidelines
- Incident response, threat hunting, SIEM/SOAR platforms
- Ironwood's own plans: Sentinel (₹4,999/mo), Fortress (₹14,999/mo), Citadel (₹39,999/mo), Enterprise (custom)
- Indian cybersecurity landscape and CERT-In guidelines

Keep answers concise but expert-level. Use technical terminology where appropriate. When discussing Ironwood's product, be enthusiastic but honest. Always recommend consulting a security professional for critical infrastructure decisions.

Respond in clear, professional English. Format longer responses with short paragraphs or bullet points where helpful.`;

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Anthropic error:", err);
    return res.status(500).json({ error: "AI service error. Please try again." });
  }
}
