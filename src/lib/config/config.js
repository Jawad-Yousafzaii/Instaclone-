const env = import.meta.env;

export const config = {
	app: {
		name: "LuminaCloud",
		description: "Cloud-native media sharing platform",
		version: "1.0.0",
	},

	supabase: {
		url: env.VITE_SUPABASE_URL || "",
		anonKey: env.VITE_SUPABASE_ANON_KEY || "",
	},

	azure: {
		accountName: env.VITE_AZURE_STORAGE_ACCOUNT_NAME || "",
		containerName: env.VITE_AZURE_STORAGE_CONTAINER_NAME || "media-uploads",
		sasToken: env.VITE_AZURE_STORAGE_SAS_TOKEN || "",
	},

	azureAI: {
		key: env.VITE_AZURE_AI_KEY || "",
		endpoint: env.VITE_AZURE_AI_ENDPOINT || "",
	},

	api: {
		timeout: 30000,
		retryAttempts: 3,
		retryDelay: 1000,
	},

	upload: {
		maxFileSize: 50 * 1024 * 1024,
		allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
		allowedVideoTypes: ["video/mp4", "video/webm", "video/quicktime"],
	},

	features: {
		mockAuth: false,
		mockData: false,
		enableComments: true,
		enableRatings: true,
	},
};
