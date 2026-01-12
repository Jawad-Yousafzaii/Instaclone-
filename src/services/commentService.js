import {supabase} from "@/lib/supabase";

export const commentService = {
	/**
	 * Get comments for media
	 * @param {string} mediaId
	 * @returns {Promise<Array>}
	 */
	async getComments(mediaId) {
		const {data, error} = await supabase
			.from("comments")
			.select(
				`
				*,
				user:users!user_id (
					id,
					name,
					avatar_url
				)
			`,
			)
			.eq("media_id", mediaId)
			.order("created_at", {ascending: false});

		if (error) {
			throw new Error(error.message);
		}

		return data.map((c) => ({
			id: c.id,
			content: c.content,
			userId: c.user_id,
			userName: c.user.name,
			userAvatar: c.user.avatar_url,
			createdAt: c.created_at,
		}));
	},

	/**
	 * Add comment to media
	 * @param {string} mediaId
	 * @param {Object} commentData - {content, userId, userName, userAvatar}
	 * @returns {Promise<Object>}
	 */
	async addComment(mediaId, commentData) {
		const {data, error} = await supabase
			.from("comments")
			.insert([
				{
					media_id: mediaId,
					user_id: commentData.userId,
					content: commentData.content,
				},
			])
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return {
			id: data.id,
			content: data.content,
			userId: data.user_id,
			userName: commentData.userName,
			userAvatar: commentData.userAvatar,
			createdAt: data.created_at,
		};
	},

	/**
	 * Delete comment
	 * @param {string} commentId
	 * @returns {Promise<{success: boolean}>}
	 */
	async deleteComment(commentId) {
		const {error} = await supabase
			.from("comments")
			.delete()
			.eq("id", commentId);

		if (error) {
			throw new Error(error.message);
		}

		return {success: true};
	},

	/**
	 * Add or update rating
	 * @param {string} mediaId
	 * @param {number} rating
	 * @param {string} userId
	 * @returns {Promise<{averageRating: number, totalRatings: number}>}
	 */
	async addRating(mediaId, rating, userId) {
		// Check if rating exists
		const {data: existing} = await supabase
			.from("ratings")
			.select("id")
			.eq("media_id", mediaId)
			.eq("user_id", userId)
			.single();

		if (existing) {
			// Update existing rating
			const {error} = await supabase
				.from("ratings")
				.update({rating})
				.eq("id", existing.id);

			if (error) {
				throw new Error(error.message);
			}
		} else {
			// Insert new rating
			const {error} = await supabase.from("ratings").insert([
				{
					media_id: mediaId,
					user_id: userId,
					rating,
				},
			]);

			if (error) {
				throw new Error(error.message);
			}
		}

		// Get updated stats from media table (automatically updated by trigger)
		const {data: media} = await supabase
			.from("media")
			.select("average_rating, ratings_count")
			.eq("id", mediaId)
			.single();

		return {
			averageRating: parseFloat(media.average_rating) || 0,
			totalRatings: media.ratings_count,
		};
	},

	/**
	 * Get user's rating for media
	 * @param {string} mediaId
	 * @param {string} userId
	 * @returns {Promise<number>}
	 */
	async getUserRating(mediaId, userId) {
		const {data} = await supabase
			.from("ratings")
			.select("rating")
			.eq("media_id", mediaId)
			.eq("user_id", userId)
			.single();

		return data ? data.rating : 0;
	},
};
