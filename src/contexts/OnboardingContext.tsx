import { createContext, useContext } from 'react';

export interface ModalState {
    isModalVisible: boolean;
    onboardToggleModal: (toggle?: string) => void;
    onboardNavigation: (sName?: string) => void;
    onboardSkip: () => void;
}
const initilValues: ModalState = {
    isModalVisible: false,
    onboardToggleModal: () => {},
    onboardNavigation: () => {},
    onboardSkip: () => {},
};
export const OnboardingContext = createContext(initilValues);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within a OnboardingContext');
    }
    return context;
};
