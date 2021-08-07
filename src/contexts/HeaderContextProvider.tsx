import React, { Context, useState, useCallback, useContext } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface HeaderTabBarState {
    headerInset: boolean;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const initialState: HeaderTabBarState = {
    headerInset: false,
    onScroll: () => {},
};

const HeaderContext: Context<HeaderTabBarState> = React.createContext(initialState);

export const HeaderContextProvider = ({ offset = 0, children }: { offset?: number; children: React.ReactNode }) => {
    const [headerInset, setHeaderInset] = useState(false);
    const onScroll = useCallback(
        event => {
            if (event.nativeEvent.contentOffset.y > offset) {
                setHeaderInset(true);
            } else if (event.nativeEvent.contentOffset.y < offset) {
                setHeaderInset(false);
            }
        },
        [offset],
    );

    return (
        <HeaderContext.Provider
            value={{
                headerInset,
                onScroll,
            }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within a AppContext');
    }
    return context;
};
