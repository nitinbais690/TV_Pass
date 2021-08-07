import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../AppStyles';
import NoNetworkSvg from '../../assets/images/no_network.svg';

const AppErrorComponent = ({
    errorMessage,
    errorIcon = 'warning-outline',
    reload,
}: {
    errorMessage?: string;
    errorIcon?: string;
    reload?: () => void;
}): JSX.Element => {
    const { strings } = useLocalization();
    const { isInternetReachable, retry } = useNetworkStatus();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    let errorString;

    const defaultErrorComponentStyle = React.useMemo(
        () =>
            StyleSheet.create({
                erroContainer: {
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                    // backgroundColor: appColors.primary,
                },
                icon: {
                    marginBottom: 20,
                },
                title: {
                    fontSize: appFonts.md,
                    fontFamily: appFonts.semibold,
                    color: appColors.secondary,
                    justifyContent: 'center',
                    alignSelf: 'center',
                },
                text: {
                    fontSize: appFonts.sm,
                    fontFamily: appFonts.primary,
                    color: appColors.tertiary,
                    marginHorizontal: appPadding.lg(true),
                    marginVertical: 20,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    textAlign: 'center',
                },
                retryButton: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 20,
                    backgroundColor: appColors.brandTint,
                    borderRadius: 2,
                },
                retryButtonText: {
                    fontSize: appFonts.xs,
                    fontFamily: appFonts.medium,
                    color: appColors.secondary,
                    marginHorizontal: 20,
                    marginVertical: 10,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    textTransform: 'uppercase',
                },
            }),
        [appColors.brandTint, appColors.secondary, appColors.tertiary, appPadding],
    );

    if (isInternetReachable === false) {
        errorIcon = 'md-cloud-offline-outline';
        errorString = strings['global.no_network_error_msg'];
        reload = retry;
    } else {
        errorString = errorMessage ? errorMessage : strings['global.general_error_msg'];
    }

    return (
        <View style={defaultErrorComponentStyle.erroContainer}>
            {isInternetReachable === false ? (
                <NoNetworkSvg width="80" height="120" />
            ) : (
                <Icon
                    type="ionicon"
                    style={defaultErrorComponentStyle.icon}
                    color={appColors.brandTintTranslucent}
                    name={errorIcon}
                    size={100}
                />
            )}
            <Text style={defaultErrorComponentStyle.title}>{strings['global.general_error_title']}</Text>
            {errorString && <Text style={defaultErrorComponentStyle.text}>{errorString}</Text>}
            {reload && (
                <TouchableHighlight
                    activeOpacity={0.5}
                    underlayColor={appColors.primaryVariant4}
                    style={defaultErrorComponentStyle.retryButton}
                    onPress={reload}>
                    <Text style={defaultErrorComponentStyle.retryButtonText}>
                        {strings['global.error.tab_retry_btn']}
                    </Text>
                </TouchableHighlight>
            )}
        </View>
    );
};

export default AppErrorComponent;
