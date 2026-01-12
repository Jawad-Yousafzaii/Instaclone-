import {USER_ROLES} from "@/lib/constants/constants";

export const mockUsers = [
	{
		id: "creator-1",
		email: "creator@test.com",
		name: "Alex Morgan",
		role: USER_ROLES.CREATOR,
		avatar: "https://i.pravatar.cc/150?img=33",
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		id: "creator-2",
		email: "jane@test.com",
		name: "Jane Smith",
		role: USER_ROLES.CREATOR,
		avatar: "https://i.pravatar.cc/150?img=45",
		createdAt: "2024-02-20T10:00:00Z",
	},
	{
		id: "consumer-1",
		email: "consumer@test.com",
		name: "John Doe",
		role: USER_ROLES.CONSUMER,
		avatar: "https://i.pravatar.cc/150?img=12",
		createdAt: "2024-03-10T10:00:00Z",
	},
	{
		id: "consumer-2",
		email: "sarah@test.com",
		name: "Sarah Johnson",
		role: USER_ROLES.CONSUMER,
		avatar: "https://i.pravatar.cc/150?img=25",
		createdAt: "2024-03-15T10:00:00Z",
	},
];
