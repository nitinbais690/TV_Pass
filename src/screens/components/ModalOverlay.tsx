import React from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { EdgeInsets, useSafeArea } from 'react-native-safe-area-context';
import { useDimensions } from '@react-native-community/hooks';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { HeaderContextProvider } from 'contexts/HeaderContextProvider';
import Header from './Header';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

export const ModalOverlay = ({
    headerTitle,
    hideHeader,
    headerTransparent,
    narrow,
    children,
}: React.PropsWithChildren<{
    headerTitle?: string | (() => React.ReactNode);
    hideHeader?: boolean;
    headerTransparent?: boolean;
    narrow?: boolean;
}>): JSX.Element => {
    const insets = useSafeArea();
    const { width: w, height: h } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appDimensions } = appTheme!(prefs);
    const isHandset = DeviceInfo.getDeviceType() === 'Handset';

    const isPortrait = h > w;

    const styles = StyleSheet.create({
        containerStyle: {
            flex: 1,
            backgroundColor: appColors.primary,
            ...(narrow && {
                width: '80%',
                alignSelf: 'center',
            }),
            ...(!narrow && {
                marginHorizontal: selectDeviceType({ Tablet: isPortrait ? 40 : '15%' }, '0%'),
                marginVertical: selectDeviceType({ Tablet: 40 }, 0),
            }),
            marginVertical: selectDeviceType({ Handset: 0, Tablet: isPortrait ? (narrow ? 140 : 40) : 40 }, 0),
            borderRadius: selectDeviceType({ Tablet: appDimensions.cardRadius }, 0),
            paddingTop: 0,
            shadowOffset: { width: 2, height: 2 },
            shadowColor: '#000',
            shadowOpacity: 0.7,
            shadowRadius: 30,
            elevation: 0,
            overflow: 'hidden',
        },
        headerContainer: {
            position: 'absolute',
            top: 0,
            zIndex: 100,
            height: 46 + (isHandset ? insets.top : 0),
            width: '100%',
        },
    });

    return (
        <HeaderContextProvider>
            <BackgroundGradient style={styles.containerStyle}>
                {children}
                <View style={styles.headerContainer}>
                    {!hideHeader && <Header headerTransparent={headerTransparent} headerTitle={headerTitle} />}
                </View>
            </BackgroundGradient>
        </HeaderContextProvider>
    );
};

export default React.memo(ModalOverlay);

export const modalHeaderHeight = (insets: EdgeInsets) => {
    let type = DeviceInfo.getDeviceType();
    const isHandset = type === 'Handset';
    return 46 + (isHandset ? insets.top : 0);
};
