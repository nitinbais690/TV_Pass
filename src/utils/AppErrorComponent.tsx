import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useNetworkStatus } from 'contexts/NetworkContextProvider';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../AppStyles';
import Button from 'screens/components/Button';
import { selectDeviceType } from 'qp-common-ui';
import { useDimensions } from '@react-native-community/hooks';
import BorderButton from 'screens/components/BorderButton';

const AppErrorComponent = ({ errorMessage, reload }: { errorMessage?: string; reload?: () => void }): JSX.Element => {
    const { width, height } = useDimensions().window;
    const { strings } = useLocalization();
    const { isInternetReachable, retry } = useNetworkStatus();
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const isPortrait = height > width;
    let errorString;

    const defaultErrorComponentStyle = React.useMemo(
        () =>
            StyleSheet.create({
                erroContainer: {
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: !Platform.isTV ? '100%' : '40%',
                    alignSelf: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    paddingHorizontal: selectDeviceType({ Tablet: isPortrait ? '25%' : '32%' }, appPadding.sm()),
                },
                errorContainerTv: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginHorizontal: Platform.isTV
                        ? 0
                        : selectDeviceType({ Tablet: isPortrait ? '20%' : '30%' }, isPortrait ? '0%' : '25%'),
                    padding: selectDeviceType({ Tv: appPadding.md(true) }, 40),
                },
                icon: {
                    marginBottom: 20,
                },
                title: {
                    fontSize: Platform.isTV ? appFonts.xxlg : appFonts.md,
                    fontFamily: appFonts.semibold,
                    color: appColors.secondary,
                    marginVertical: 25,
                },
                titleAlign: {
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
                textContainer: {
                    width: '40%',
                },
            }),
        [appColors.brandTint, appColors.secondary, appColors.tertiary, appPadding, isPortrait],
    );

    if (isInternetReachable === false) {
        errorString = strings['global.no_network_error_msg'];
        reload = retry;
    } else {
        errorString = errorMessage ? errorMessage : strings['global.general_error_msg'];
    }

    return Platform.isTV ? (
        <View style={defaultErrorComponentStyle.errorContainerTv}>
            <View style={defaultErrorComponentStyle.textContainer}>
                {errorString && <Text style={defaultErrorComponentStyle.title}>{errorString}</Text>}
                {reload && <BorderButton title={strings['global.error.tab_retry_btn']} onPress={reload} />}
            </View>
        </View>
    ) : (
        <View style={defaultErrorComponentStyle.erroContainer}>
            {errorString && (
                <Text style={[defaultErrorComponentStyle.title, defaultErrorComponentStyle.titleAlign]}>
                    {errorString}
                </Text>
            )}
            {reload && <Button title={strings['global.error.tab_retry_btn']} onPress={reload} />}
        </View>
    );
};

export default AppErrorComponent;
