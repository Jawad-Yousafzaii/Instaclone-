import {USER_ROLES} from "@/lib/constants/constants";
import {supabase} from "@/lib/supabase";

export const authService = {
	async login(email, password, role) {
		const {data: authData, error: authError} =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (authError) {
			throw new Error(authError.message);
		}

		const {data: profile, error: profileError} = await supabase
			.from("users")
			.select("*")
			.eq("id", authData.user.id)
			.single();

		if (profileError) {
			throw new Error("Failed to fetch user profile");
		}

		if (profile.role !== role) {
			await supabase.auth.signOut();
			throw new Error(`Invalid credentials. Please login as ${profile.role}.`);
		}

		return {
			id: profile.id,
			email: profile.email,
			name: profile.name,
			role: profile.role,
			avatar: profile.avatar_url,
			bio: profile.bio,
			createdAt: profile.created_at,
		};
	},

	async signup(userData) {
		const {data: authData, error: authError} = await supabase.auth.signUp({
			email: userData.email,
			password: userData.password,
		});

		if (authError) {
			throw new Error(authError.message);
		}

		if (!authData.user) {
			throw new Error("Failed to create user");
		}

		await new Promise((resolve) => setTimeout(resolve, 500));

		const {data: profile, error: profileError} = await supabase
			.from("users")
			.insert([
				{
					id: authData.user.id,
					email: userData.email,
					name: userData.name,
					role: userData.role || USER_ROLES.CONSUMER,
					avatar_url: userData.avatar || null,
					bio: userData.bio || null,
				},
			])
			.select()
			.single();

		if (profileError) {
			throw new Error(
				`Profile creation failed: ${profileError.message}. Please contact support.`,
			);
		}

		return {
			id: profile.id,
			email: profile.email,
			name: profile.name,
			role: profile.role,
			avatar: profile.avatar_url,
			bio: profile.bio,
			createdAt: profile.created_at,
		};
	},

	async logout() {
		const {error} = await supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		}

		return {success: true};
	},

	async getCurrentUser() {
		const {
			data: {user},
		} = await supabase.auth.getUser();

		if (!user) {
			return null;
		}

		const {data: profile} = await supabase
			.from("users")
			.select("*")
			.eq("id", user.id)
			.single();

		if (!profile) {
			return null;
		}

		return {
			id: profile.id,
			email: profile.email,
			name: profile.name,
			role: profile.role,
			avatar: profile.avatar_url,
			bio: profile.bio,
			createdAt: profile.created_at,
		};
	},

	async getSession() {
		const {
			data: {session},
		} = await supabase.auth.getSession();
		return session;
	},
};
