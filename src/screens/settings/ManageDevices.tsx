import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ClientContext } from 'react-fetching-library';
import { useDimensions } from '@react-native-community/hooks';
import moment from 'moment';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { authAction } from 'contexts/AuthContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAlert } from 'contexts/AlertContext';
import { EvergentEndpoints, requestBody, isSuccess } from 'utils/EvergentAPIUtil';
import Button from 'screens/components/Button';
import AppErrorComponent from 'utils/AppErrorComponent';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import { settingStyle } from '../../styles/Settings.Style';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import BackgroundGradient from 'screens/components/BackgroundGradient';

export const ManageDevices = () => {
    const { Alert } = useAlert();
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { strings } = useLocalization();
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const { accessToken, logout } = useAuth();
    const GetAccountDevicesEndpoint = EvergentEndpoints.GetAccountDevices;
    const RemoveDevicesEndpoint = EvergentEndpoints.RemoveDevices;
    const [loading, setLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [error, setError] = useState(false);
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);
    const [activeDevices, setActiveDevices] = useState([]);
    const { recordEvent } = useAnalytics();

    useEffect(() => {
        manageDevicesListing();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function manageDevicesListing() {
        setLoading(true);
        const body = requestBody(GetAccountDevicesEndpoint, appConfig, {});
        let action = authAction({
            method: 'POST',
            body: body,
            endpoint: GetAccountDevicesEndpoint,
            accessToken,
        });
        const { payload } = await query(action);
        setLoading(false);
        if (isSuccess(GetAccountDevicesEndpoint, payload)) {
            let resData = payload.GetAccountDevicesResponseMessage.AccountDeviceDetails;
            resData = resData.filter((data: any) => {
                return data.status === 'Active';
            });
            setActiveDevices(resData);
        } else {
            setError(true);
        }
    }

    async function manageDevicesRemove() {
        setIsSubmitLoading(true);

        const body = requestBody(RemoveDevicesEndpoint, appConfig, { isExemptCurrentDevice: true });
        let action = authAction({
            method: 'POST',
            body: body,
            endpoint: RemoveDevicesEndpoint,
            accessToken,
        });

        const { payload } = await query(action);
        setIsSubmitLoading(false);

        if (isSuccess(RemoveDevicesEndpoint, payload)) {
            recordEvent(AppEvents.REMOVE_DEVICE);
            await logout();
        } else {
            Alert.alert(
                strings['global.general_error_msg'],
                undefined,
                [
                    {
                        text: strings['global.okay'],
                    },
                ],
                { cancelable: false },
            );
        }
    }

    const devicesRemoveConfirmation = () => {
        Alert.alert(strings['manageDevices.alert_title'], strings['manageDevices.alert_message'], [
            {
                text: strings['manageDevices.alert_confirm'],
                onPress: () => manageDevicesRemove(),
            },
            {
                text: strings['manageDevices.alert_cancel'],
                onPress: () => {},
                style: 'cancel',
            },
        ]);
    };
    const removeDevice = async (serialNo: string) => {
        const body = requestBody(RemoveDevicesEndpoint, appConfig, {
            isExemptCurrentDevice: false,
            deviceDetails: [{ serialNo }],
        });
        let action = authAction({
            method: 'POST',
            body: body,
            endpoint: RemoveDevicesEndpoint,
            accessToken,
        });
        const { payload } = await query(action);
        if (isSuccess(RemoveDevicesEndpoint, payload)) {
            const filteredData = activeDevices.filter(item => item.serialNo !== serialNo);
            setActiveDevices(filteredData);
            if (filteredData.length === 0) {
                await logout();
            }
        }
    };

    return (
        <BackgroundGradient insetTabBar={true}>
            {/* Loading State */}
            {loading && <AppLoadingIndicator />}

            {/* Error State */}
            {error && <AppErrorComponent />}

            {/* List devices State */}
            {!loading && !error && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={settStyle.mainContainer_mh}>
                        {activeDevices &&
                            activeDevices.map((devices, i) => (
                                <View
                                    key={i}
                                    style={[
                                        settStyle.borderBottom,
                                        settStyle.manageContainer,
                                        { flexDirection: 'row', justifyContent: 'space-between' },
                                    ]}>
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                        <Text style={[settStyle.text_manageD]}>{devices.deviceName}</Text>
                                        <Text style={[settStyle.text_manage_light]}>
                                            {strings.formatString(
                                                strings['manageDevices.Added'],
                                                moment(devices.startDate).format('LL'),
                                            )}
                                        </Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginRight: 10 }}>
                                        {/* <RNEButton icon={CloseIcon} titleStyle={{ }} type="clear" onPress={() => removeDevice(devices.serialNo)} /> */}
                                        <Text
                                            style={[settStyle.text_manageD, { color: appColors.brandTint }]}
                                            onPress={() => removeDevice(devices.serialNo)}>
                                            {'Remove'}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        <View style={[settStyle.row_between, settStyle.borderBottom, settStyle.containerHeight]}>
                            <View>
                                <Text style={[settStyle.buttonCover]}>{strings['manageDevices.remove']}</Text>
                            </View>
                            <View style={settStyle.removeButtonContainer}>
                                <Button
                                    buttonStyle={settStyle.removeButton}
                                    disabled={isSubmitLoading || (activeDevices && activeDevices.length <= 1)}
                                    title={strings['manageDevices.clear']}
                                    onPress={devicesRemoveConfirmation}
                                    loading={isSubmitLoading}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </BackgroundGradient>
    );
};
