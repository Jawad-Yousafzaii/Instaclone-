import {supabase} from "@/lib/supabase";

export const commentService = {
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

	async addRating(mediaId, rating, userId) {
		const {data: existing} = await supabase
			.from("ratings")
			.select("id")
			.eq("media_id", mediaId)
			.eq("user_id", userId)
			.maybeSingle();

		if (existing) {
			const {error} = await supabase
				.from("ratings")
				.update({rating})
				.eq("id", existing.id);

			if (error) {
				throw new Error(error.message);
			}
		} else {
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

		const {data: allRatings} = await supabase
			.from("ratings")
			.select("rating")
			.eq("media_id", mediaId);

		const totalRatings = allRatings ? allRatings.length : 0;
		const averageRating = totalRatings > 0 
			? allRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
			: 0;

		await supabase
			.from("media")
			.update({
				average_rating: averageRating,
				ratings_count: totalRatings
			})
			.eq("id", mediaId);

		return {
			averageRating,
			totalRatings,
		};
	},

	async getUserRating(mediaId, userId) {
		const {data} = await supabase
			.from("ratings")
			.select("rating")
			.eq("media_id", mediaId)
			.eq("user_id", userId)
			.maybeSingle();

		return data ? data.rating : 0;
	},
};
