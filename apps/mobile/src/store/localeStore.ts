import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AppLocale = "en" | "vn";

type LocaleState = {
  locale: AppLocale;
  hasHydrated: boolean;
  setLocale: (locale: AppLocale) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const localeStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      hasHydrated: false,
      setLocale: (locale) => set({ locale }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "petai-mobile-locale",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
