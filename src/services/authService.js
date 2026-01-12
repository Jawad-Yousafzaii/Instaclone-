import {USER_ROLES} from "@/lib/constants/constants";
import {supabase} from "@/lib/supabase";

export const authService = {
	/**
	 * Login with email and password
	 * @param {string} email
	 * @param {string} password
	 * @param {string} role - Expected user role
	 * @returns {Promise<Object>} User object with profile data
	 */
	async login(email, password, role) {
		// Sign in with Supabase Auth
		const {data: authData, error: authError} =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (authError) {
			throw new Error(authError.message);
		}

		// Fetch user profile from users table
		const {data: profile, error: profileError} = await supabase
			.from("users")
			.select("*")
			.eq("id", authData.user.id)
			.single();

		if (profileError) {
			throw new Error("Failed to fetch user profile");
		}

		// Verify role matches
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

	/**
	 * Sign up new user (consumer or creator)
	 * @param {Object} userData - {name, email, password, role, bio}
	 * @returns {Promise<Object>} New user object
	 */
	async signup(userData) {
		// Create auth user
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

		// Wait a moment for the auth user to be fully created
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Create user profile in users table
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
			// Note: We can't delete the auth user from frontend (requires service role)
			// The user account exists but without profile - they can contact support
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

	/**
	 * Logout current user
	 * @returns {Promise<{success: boolean}>}
	 */
	async logout() {
		const {error} = await supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		}

		return {success: true};
	},

	/**
	 * Get current authenticated user
	 * @returns {Promise<Object|null>} User object or null
	 */
	async getCurrentUser() {
		const {
			data: {user},
		} = await supabase.auth.getUser();

		if (!user) {
			return null;
		}

		// Fetch profile
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

	/**
	 * Get current session
	 * @returns {Promise<Object|null>}
	 */
	async getSession() {
		const {
			data: {session},
		} = await supabase.auth.getSession();
		return session;
	},
};
