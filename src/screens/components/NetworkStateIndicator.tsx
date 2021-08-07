import React, { useEffect, useState, useRef } from 'react';
import { View, Text, LayoutAnimation, StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../../contexts/NetworkContextProvider';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts, appPadding } from '../../../AppStyles';

const CONNECTED_HIDE_TIMEOUT = 3 * 1000; //3s

const NetworkStateIndicator = () => {
    const isMounted = useRef(true);
    const insets = useSafeArea();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const { isInternetReachable } = useNetworkStatus();
    const [showNetworkState, setShowNetworkState] = useState(false);
    const wasOffline = useRef(isInternetReachable === false);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: isInternetReachable ? appColors.success : appColors.primaryVariant3,
            alignItems: 'center',
            justifyContent: 'center',
        },
        label: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            marginVertical: appPadding.xxs(true),
            paddingBottom: insets.bottom,
        },
    });

    useEffect(() => {
        isMounted.current = true;

        const showView = (show: boolean) => {
            if (isMounted.current) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setShowNetworkState(show);
            }
        };

        if (isInternetReachable === false) {
            // show message when not connected to network
            wasOffline.current = true;
            showView(true);
        } else if (wasOffline.current === true) {
            // show message breifly when back online
            showView(true);
            wasOffline.current = false;

            // hide the connected back message after a timeout
            setTimeout(() => {
                showView(false);
            }, CONNECTED_HIDE_TIMEOUT);
        }

        return () => {
            isMounted.current = false;
        };
    }, [wasOffline, isInternetReachable]);

    if (!showNetworkState) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {isInternetReachable ? strings['global.back_online'] : strings['global.no_network']}
            </Text>
        </View>
    );
};

export default NetworkStateIndicator;
