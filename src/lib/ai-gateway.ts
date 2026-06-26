import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const createLovableAiGatewayProvider = (lovableApiKey: string) =>
  createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    // Gemini on the gateway requires native structured-output mode for
    // JSON schema responses; without this, Output.object / generateObject
    // fail with "response did not match schema".
    supportsStructuredOutputs: true,
  });
