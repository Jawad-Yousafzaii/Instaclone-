import {config} from "@/lib/config/config";

const AI_KEY = config.azureAI.key;
const AI_ENDPOINT = config.azureAI.endpoint;

export const aiService = {
	async analyzeImage(file) {
		if (!AI_KEY || !AI_ENDPOINT) {
			throw new Error("Azure AI not configured");
		}

		const endpoint = `${AI_ENDPOINT.replace(/\/$/, "")}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=caption,tags`;

		const arrayBuffer = await file.arrayBuffer();

		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Ocp-Apim-Subscription-Key": AI_KEY,
				"Content-Type": "application/octet-stream",
			},
			body: arrayBuffer,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`AI Analysis failed: ${response.status} - ${errorText}`);
		}

		const result = await response.json();

		return {
			caption: result.captionResult?.text || "",
			captionConfidence: result.captionResult?.confidence || 0,
			tags: (result.tagsResult?.values || []).map((tag) => ({
				name: tag.name,
				confidence: tag.confidence,
			})),
		};
	},
};
