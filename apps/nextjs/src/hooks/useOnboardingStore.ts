import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { OnboardingState } from "./store-types";

const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingStep: 0,
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
      onboardingCompleted: false,
      setOnboardingCompleted: (onboardingCompleted) =>
        set({ onboardingCompleted }),
      currentRole: "",
      setCurrentRole: (currentRole) => set({ currentRole }),
      eduHistory: "",
      setEduHistory: (eduHistory) => set({ eduHistory }),
      workHistory: "",
      setWorkHistory: (workHistory) => set({ workHistory }),
    }),
    {
      name: "onboarding-state-storage", // unique name for this storage item
      storage: createJSONStorage(() => localStorage), // using localStorage for persistence
    },
  ),
);

export default useOnboardingStore;
