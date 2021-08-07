import React, { useEffect } from 'react';
import { View, StyleSheet, Text, LayoutAnimation } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
//import { useAppState } from 'utils/AppContextProvider';
//import { useAppPreview } from 'contexts/AppPreviewContextProvider';
// import { useHeader } from 'contexts/HeaderContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import HeaderGradient from 'screens/components/HeaderGradient';
import CloseIcon from '../../../assets/images/close.svg';
import { appFonts } from '../../../AppStyles';

const Header = ({
    headerTransparent,
    headerTitle,
}: {
    headerTransparent?: boolean;
    headerTitle?: string | (() => React.ReactNode);
}) => {
    const insets = useSafeArea();
    // const { toggleModal } = useAppPreview();
    //  const { appNavigationState } = useAppState();
    const navigation = useNavigation();
    // const { headerInset } = useHeader();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const isHandset = DeviceInfo.getDeviceType() === 'Handset';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: headerTransparent ? 'transparent' : appColors.primary, //'transparent', //'rgba(256, 0, 0, 0.1)', //headerTransparent ? 'transparent' : appColors.primary,
            paddingTop: isHandset ? insets.top : 0,
        },
        headerLeftContainerStyle: {
            left: 0,
            alignItems: 'flex-start',
            paddingVertical: 13,
            flex: 1.2,
            zIndex: 2,
        },
        headerTitleContainerStyle: {
            flexGrow: 3,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerRightContainerStyle: {
            justifyContent: 'flex-end',
            right: 0,
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
            zIndex: 2,
        },
        titleStyle: {
            fontSize: appFonts.xlg,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 15,
        },
        castIcon: { width: 24, height: 24, tintColor: appColors.brandTint },
        doneButton: { marginHorizontal: 20, justifyContent: 'center', alignItems: 'center' },
    });

    useEffect(() => {
        return () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        };
    }, [headerTransparent]);

    return (
        <View style={styles.container}>
            <HeaderGradient style={{ ...StyleSheet.absoluteFillObject }} />
            <View style={styles.headerLeftContainerStyle} />
            <View style={styles.headerTitleContainerStyle}>
                {headerTitle &&
                    (typeof headerTitle === 'string' ? (
                        <Text numberOfLines={1} style={styles.titleStyle}>
                            {headerTitle}
                        </Text>
                    ) : (
                        <View style={styles.headerTitleContainerStyle}>{headerTitle()}</View>
                    ))}
            </View>
            <View style={styles.headerRightContainerStyle}>
                <BorderlessButton onPress={() => navigation.goBack()} style={styles.doneButton}>
                    <CloseIcon />
                </BorderlessButton>
            </View>
        </View>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return (
        prevProps.headerTransparent === nextProps.headerTransparent && prevProps.headerTitle === nextProps.headerTitle
    );
};

export default React.memo(Header, propsAreEqual);
