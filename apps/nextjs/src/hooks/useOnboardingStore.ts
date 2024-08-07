import { create } from "zustand";

import type { OnboardingState } from "./store-types";

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<OnboardingState>((set, get) => ({
  onboardingStep: 0,
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  onboardingCompleted: false,
  setOnboardingCompleted: (onboardingCompleted) => set({ onboardingCompleted }),
}));

export default useStore;
