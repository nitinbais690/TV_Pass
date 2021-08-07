import { ResourceVm } from 'components/qp-discovery-ui';
import { createContext, useContext } from 'react';

export interface ModalState {
    isModalVisible: boolean;
    onboardToggleModal: (toggle?: string) => void;
    onboardNavigation: (sName?: string) => void;
    onboardSkip: () => void;
    onboardingResource?: ResourceVm;
    finishedOnboarding: boolean;
}

const initilValues: ModalState = {
    isModalVisible: false,
    onboardToggleModal: () => {},
    onboardNavigation: () => {},
    onboardSkip: () => {},
    onboardingResource: undefined,
    finishedOnboarding: false,
};

export const OnboardingContext = createContext(initilValues);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within a OnboardingContext');
    }
    return context;
};
