export const APP_NAME = "LuminaCloud";
export const APP_DESCRIPTION = "Cloud-native media sharing platform";
export const APP_VERSION = "1.0.0";
export const SUPPORT_EMAIL = "support@luminacloud.com";

export const USER_ROLES = {
	CREATOR: "creator",
	CONSUMER: "consumer",
};

export const ROUTES = {
	AUTH: {
		LOGIN: "/login",
		CONSUMER_SIGNUP: "/signup",
	},
	CREATOR: {
		DASHBOARD: "/creator/dashboard",
		UPLOAD: "/creator/upload",
		MANAGE: "/creator/manage",
		EDIT: "/creator/edit/:id",
	},
	CONSUMER: {
		FEED: "/consumer/feed",
		REELS: "/consumer/reels",
		MEDIA_DETAIL: "/consumer/media/:id",
	},
	NOT_FOUND: "*",
};

export const MEDIA_TYPES = {
	IMAGE: "image",
	VIDEO: "video",
};

export const RATING_MAX = 5;

export const PAGINATION = {
	DEFAULT_PAGE_SIZE: 12,
	LOAD_MORE_SIZE: 12,
};
