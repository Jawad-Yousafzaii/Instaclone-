import {supabase} from "@/lib/supabase";
import {storageService} from "./storageService";

export const mediaService = {
	async analyzeImageWithAI(file) {
		const endpoint = import.meta.env.VITE_AZURE_AI_ENDPOINT;
		const apiKey = import.meta.env.VITE_AZURE_AI_KEY;

		if (!endpoint || !apiKey) {
			throw new Error("Azure AI configuration missing");
		}

		console.log("AI Call Started...");

		const cleanEndpoint = endpoint.replace(/\/$/, "");
		const url = `${cleanEndpoint}/vision/v3.2/analyze?visualFeatures=Description,Tags`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Ocp-Apim-Subscription-Key": apiKey,
				"Content-Type": "application/octet-stream",
			},
			body: file,
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error("AI Error Response:", errText);
			throw new Error("Failed to analyze image with Azure AI");
		}

		const data = await response.json();
		console.log("AI Response:", data);

		return {
			description: data.description?.captions?.[0]?.text || "",
			tags: (data.tags || []).map((t) => t.name).join(", "),
		};
	},

	async getAllMedia(filters = {}) {
		let query = supabase
			.from("media")
			.select("*, ratings(*)")
			.order("created_at", {ascending: false});

		if (filters.search) {
			query = query.or(
				`title.ilike.%${filters.search}%,caption.ilike.%${filters.search}%`,
			);
		}

		if (filters.location) {
			query = query.ilike("location", `%${filters.location}%`);
		}

		if (filters.type) {
			query = query.eq("type", filters.type);
		}

		const {data, error} = await query;

		if (error) {
			throw new Error(error.message);
		}

		const mediaWithCreators = await Promise.all(
			data.map(async (m) => {
				const {data: creator} = await supabase
					.from("users")
					.select("id, name, email, avatar_url")
					.eq("id", m.creator_id)
					.single();

				return {
					id: m.id,
					title: m.title,
					caption: m.caption,
					type: m.type,
					url: storageService.getFileUrl(m.url),
					thumbnail: m.thumbnail_url
						? storageService.getFileUrl(m.thumbnail_url)
						: storageService.getFileUrl(m.url),
					location: m.location,
					people: m.people || [],
					views: m.views_count || 0,
					averageRating: m.ratings && m.ratings.length > 0
						? m.ratings.reduce((sum, r) => sum + r.rating, 0) / m.ratings.length
						: 0,
					totalRatings: m.ratings ? m.ratings.length : 0,
					comments: [],
					ratings: (m.ratings || []).map((r) => ({
						userId: r.user_id,
						rating: r.rating,
						createdAt: r.created_at,
					})),
					creatorId: m.creator_id,
					creatorName: creator?.name || "Unknown",
					creatorEmail: creator?.email || "",
					creatorAvatar: creator?.avatar_url || null,
					createdAt: m.created_at,
					updatedAt: m.updated_at,
				};
			}),
		);

		let media = mediaWithCreators;

		if (filters.sortBy === "oldest") {
			media.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		} else if (filters.sortBy === "popular") {
			media.sort((a, b) => b.views - a.views);
		} else if (filters.sortBy === "highest-rated") {
			media.sort((a, b) => b.averageRating - a.averageRating);
		}

		return media;
	},

	async getMediaById(id) {
		const {data: mediaData, error: mediaError} = await supabase
			.from("media")
			.select(
				`
				*,
				creator:users!creator_id (
					id,
					name,
					email,
					avatar_url
				)
			`,
			)
			.eq("id", id)
			.single();

		if (mediaError || !mediaData) {
			throw new Error("Media not found");
		}

		const {data: comments} = await supabase
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
			.eq("media_id", id)
			.order("created_at", {ascending: false});

		const {data: ratings} = await supabase
			.from("ratings")
			.select("*")
			.eq("media_id", id);

		await this.incrementViews(id);

		return {
			id: mediaData.id,
			title: mediaData.title,
			caption: mediaData.caption,
			type: mediaData.type,
			url: storageService.getFileUrl(mediaData.url),
			thumbnail: mediaData.thumbnail_url
				? storageService.getFileUrl(mediaData.thumbnail_url)
				: storageService.getFileUrl(mediaData.url),
			location: mediaData.location,
			people: mediaData.people || [],
			views: mediaData.views_count + 1,
			averageRating: parseFloat(mediaData.average_rating) || 0,
			totalRatings: mediaData.ratings_count,
			comments: (comments || []).map((c) => ({
				id: c.id,
				content: c.content,
				userId: c.user_id,
				userName: c.user.name,
				userAvatar: c.user.avatar_url,
				createdAt: c.created_at,
			})),
			ratings: (ratings || []).map((r) => ({
				userId: r.user_id,
				rating: r.rating,
				createdAt: r.created_at,
			})),
			creatorId: mediaData.creator_id,
			creatorName: mediaData.creator.name,
			creatorEmail: mediaData.creator.email,
			creatorAvatar: mediaData.creator.avatar_url,
			createdAt: mediaData.created_at,
			updatedAt: mediaData.updated_at,
		};
	},

	async getMediaByCreator(creatorId) {
		const {data, error} = await supabase
			.from("media")
			.select("*, ratings(*)")
			.eq("creator_id", creatorId)
			.order("created_at", {ascending: false});

		if (error) {
			throw new Error(error.message);
		}

		return data.map((m) => ({
			id: m.id,
			title: m.title,
			caption: m.caption,
			type: m.type,
			url: storageService.getFileUrl(m.url),
			thumbnail: m.thumbnail_url
				? storageService.getFileUrl(m.thumbnail_url)
				: storageService.getFileUrl(m.url),
			location: m.location,
			people: m.people || [],
			views: m.views_count || 0,
			averageRating: m.ratings && m.ratings.length > 0
				? m.ratings.reduce((sum, r) => sum + r.rating, 0) / m.ratings.length
				: 0,
			totalRatings: m.ratings ? m.ratings.length : 0,
			ratings: (m.ratings || []).map((r) => ({
				userId: r.user_id,
				rating: r.rating,
				createdAt: r.created_at,
			})),
			createdAt: m.created_at,
			updatedAt: m.updated_at,
		}));
	},

	async createMedia(mediaData) {
		const {data, error} = await supabase
			.from("media")
			.insert([
				{
					creator_id: mediaData.creatorId,
					title: mediaData.title,
					caption: mediaData.caption,
					type: mediaData.type,
					url: mediaData.url,
					thumbnail_url: mediaData.thumbnail || mediaData.url,
					location: mediaData.location,
					people: mediaData.people || [],
				},
			])
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return {
			id: data.id,
			...mediaData,
			createdAt: data.created_at,
		};
	},

	async updateMedia(id, updates) {
		const updateData = {
			...(updates.title && {title: updates.title}),
			...(updates.caption && {caption: updates.caption}),
			...(updates.location && {location: updates.location}),
			...(updates.people && {people: updates.people}),
		};

		const {data, error} = await supabase
			.from("media")
			.update(updateData)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			throw new Error(error.message);
		}

		return data;
	},

	async deleteMedia(id) {
		const {data: media} = await supabase
			.from("media")
			.select("url")
			.eq("id", id)
			.single();

		if (media && media.url) {
			const urlParts = media.url.split("/");
			const containerIndex = urlParts.indexOf("media-uploads");
			if (containerIndex !== -1) {
				const blobName = urlParts.slice(containerIndex + 1).join("/");
				try {
					await storageService.deleteFile(blobName);
				} catch (e) {
					console.error("Failed to delete blob:", e);
				}
			}
		}

		const {error} = await supabase.from("media").delete().eq("id", id);

		if (error) {
			throw new Error(error.message);
		}

		return {success: true};
	},

	async incrementViews(id) {
		const {error} = await supabase.rpc("increment_media_views", {
			media_uuid: id,
		});

		if (error) {
			console.error("Failed to increment views:", error);
		}
	},
};
