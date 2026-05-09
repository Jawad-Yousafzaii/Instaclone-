import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const uiStates = create(
    persist(
        (set) => ({
            locale: "en",
            setLocale: (newValue) => set({ locale: newValue }),

        }),
        {
            name: "ui-states",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);

export default uiStates;
