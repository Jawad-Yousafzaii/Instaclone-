import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useAuthStore = create(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,

			setUser: (user) => set({user, isAuthenticated: true}),

			login: (userData) => {
				set({
					user: userData,
					isAuthenticated: true,
				});
			},

			logout: () => {
				set({
					user: null,
					isAuthenticated: false,
				});
			},

			updateProfile: (updates) =>
				set((state) => ({
					user: state.user ? {...state.user, ...updates} : null,
				})),
		}),
		{
			name: "auth-storage",
		},
	),
);
