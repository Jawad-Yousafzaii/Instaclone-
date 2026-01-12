import {create} from "zustand";

export const useMediaStore = create((set) => ({
	media: [],
	currentMedia: null,
	filters: {
		search: "",
		location: "",
		dateRange: null,
		sortBy: "newest",
	},
	loading: false,
	error: null,

	setMedia: (media) => set({media}),

	setCurrentMedia: (media) => set({currentMedia: media}),

	addMedia: (mediaItem) =>
		set((state) => ({
			media: [mediaItem, ...state.media],
		})),

	updateMedia: (id, updates) =>
		set((state) => ({
			media: state.media.map((item) =>
				item.id === id ? {...item, ...updates} : item,
			),
		})),

	deleteMedia: (id) =>
		set((state) => ({
			media: state.media.filter((item) => item.id !== id),
		})),

	setFilters: (filters) =>
		set((state) => ({
			filters: {...state.filters, ...filters},
		})),

	resetFilters: () =>
		set({
			filters: {
				search: "",
				location: "",
				dateRange: null,
				sortBy: "newest",
			},
		}),

	setLoading: (loading) => set({loading}),

	setError: (error) => set({error}),

	clearError: () => set({error: null}),
}));
