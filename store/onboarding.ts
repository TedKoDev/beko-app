// 온보딩 스토어
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (value) => {
        console.log('Setting hasSeenOnboarding to:', value);
        set({ hasSeenOnboarding: value });
        console.log('Current state after set:', get().hasSeenOnboarding);
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrated state in onboarding store:', state);
        if (state?.hasSeenOnboarding) {
          console.log('Onboarding state rehydrated as true');
        }
      },
    }
  )
);

export const resetOnboarding = () => {
  useOnboardingStore.persist.clearStorage();
};
