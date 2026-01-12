import React, {lazy} from "react";
import {ROUTES, USER_ROLES} from "./constants";

export const routes = [
	{
		path: ROUTES.AUTH.LOGIN,
		element: React.createElement(lazy(() => import("@/pages/auth/Login"))),
		isPrivate: false,
		layout: "auth",
	},
	{
		path: ROUTES.AUTH.CONSUMER_SIGNUP,
		element: React.createElement(
			lazy(() => import("@/pages/auth/ConsumerSignup")),
		),
		isPrivate: false,
		layout: "auth",
	},
	{
		path: ROUTES.CREATOR.DASHBOARD,
		element: React.createElement(
			lazy(() => import("@/pages/creator/Dashboard")),
		),
		isPrivate: true,
		allowedRoles: [USER_ROLES.CREATOR],
		layout: "creator",
	},
	{
		path: ROUTES.CONSUMER.FEED,
		element: React.createElement(lazy(() => import("@/pages/consumer/Feed"))),
		isPrivate: true,
		allowedRoles: [USER_ROLES.CONSUMER],
		layout: "consumer",
	},
	{
		path: ROUTES.CONSUMER.MEDIA_DETAIL,
		element: React.createElement(
			lazy(() => import("@/pages/consumer/MediaDetail")),
		),
		isPrivate: true,
		allowedRoles: [USER_ROLES.CONSUMER, USER_ROLES.CREATOR],
		// No layout - MediaDetail will render standalone to allow both creators and consumers
	},
];
