import {
  TextAnalysisClient,
  AzureKeyCredential,
  type AnalyzeActionName,
} from "@azure/ai-language-text";

// Set up the Azure credentials from environment variables
const key = import.meta.env.VITE_LANGUAGE_SERVICE_API_KEY;
const endpoint = import.meta.env.VITE_LANGUAGE_SERVICE_API_URL;

export async function AnalyseInput(text: string, actionNames: AnalyzeActionName) {
  try {
    if (!key || !endpoint) {
      throw new Error("Missing Azure Text Analytics credentials.");
    }
    const client = new TextAnalysisClient(
      endpoint,
      new AzureKeyCredential(key)
    );

    const results = await client.analyze(actionNames, [text]);
    return results;
  } catch (error) {
    console.error("Error during language detection:", error);
    throw error;
  }
}
