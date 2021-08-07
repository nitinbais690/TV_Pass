import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import DateTimePickerModal from 'react-native-month-year-picker';
import { ClientContext } from 'react-fetching-library';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import useForm from 'helper/useForm';
import { selectDeviceType } from 'qp-common-ui';
import { authAction } from 'contexts/AuthContextProvider';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAppState } from 'utils/AppContextProvider';
import { EvergentEndpoints, requestBody, isSuccess, errorCode, responsePayload } from 'utils/EvergentAPIUtil';
import Button from '../components/Button';
import { profileValidate } from 'helper/validateRules';
// import { settingStyle } from 'styles/Settings.Style';
import { userProfileStyle } from 'styles/UserProfile.style';
import { formStyle } from 'styles/Common.style';
import { appFonts, appPadding } from '../../../AppStyles';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import FloatingLabelInput from 'screens/components/FloatingLabelInput';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import useFunction from 'helper/useFunction';

const initialValues = {
    name: '',
    dob: '',
};

export const UserProfile = ({ navigation: {} }: { navigation: any }) => {
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, profileValidate);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    let { appColors } = appTheme && appTheme(prefs);
    const { strings } = useLocalization();
    const formStyles = formStyle({ appColors, appPadding });
    const userStyle = userProfileStyle({ appColors });
    const { appConfig } = useAppPreferencesState();
    const { query } = useContext(ClientContext);
    const { isName } = useFunction();
    const { accessToken, updatedAccountProfile } = useAuth();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { triggerSubscribedFlow } = useAppState();
    //const [pickerSelection, setPickerSelection] = useState('');
    // const [pickerDisplayed, setPickerDisplayed] = useState(false);
    const updateProfileEndpoint = EvergentEndpoints.UpdateProfile;
    const isPortrait = height > width;
    // const settStyle = settingStyle({ appColors, isPortrait });
    const auth = useAuth();
    const { recordEvent } = useAnalytics();
    const defaultStyles = StyleSheet.create({
        listBottomPadding: {
            marginTop: selectDeviceType({ Handset: 30 }, isPortrait ? 60 : 0),
        },
        mainContainer_mh: {
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '25%' : '32%' }, appPadding.sm()),
            justifyContent: !isPortrait ? 'center' : undefined,
            flex: 1,
        },
        modalOverlay: {
            paddingHorizontal: selectDeviceType({ Tablet: isPortrait ? '15%' : '30%' }, '5%'),
            justifyContent: 'flex-end',
        },
        viewContainer: {
            borderWidth: 2,
            borderColor: 'transparent',
            height: 55,
            alignItems: 'flex-end',
        },
        inputs: {
            flex: 1,
            padding: 5,
            marginHorizontal: 16,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            height: 50,
            opacity: values.dob ? 1 : 0.6,
        },
    });

    async function userProfile({ firstName, dateOfBirth }: { firstName: string; dateOfBirth: string | null }) {
        const body = requestBody(updateProfileEndpoint, appConfig, { firstName, dateOfBirth });

        let action = authAction({
            method: 'POST',
            endpoint: updateProfileEndpoint,
            body: body,
            accessToken,
        });
        const { payload } = await query(action);
        if (isSuccess(updateProfileEndpoint, payload)) {
            return responsePayload(updateProfileEndpoint, payload);
        } else {
            throw errorCode(updateProfileEndpoint, payload);
        }
    }

    useEffect(() => {
        if (auth.signedUpInSession) {
            recordEvent(AppEvents.CREATE_PROFILE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        userProfile({
            firstName: values.name,
            dateOfBirth: values.dob !== '' ? moment(values.dob, 'MM-DD').format('MM/DD') : null,
        })
            .then(async () => {
                try {
                    await updatedAccountProfile();
                    triggerSubscribedFlow();
                } catch (e) {
                    setIsSubmitLoading(false);
                    console.error('[UserProfile] error updating user profile', e);
                }
            })
            .catch(() => {
                setIsSubmitLoading(false);
            });
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const onValueChange = useCallback(
        (event, newDate) => {
            if (event == 'dateSetAction') {
                handleChange({ name: 'dob', value: newDate });
                hideDatePicker();
            } else {
                hideDatePicker();
            }
        },
        [handleChange],
    );

    return (
        <BackgroundGradient insetHeader={false}>
            <ScrollView style={[defaultStyles.listBottomPadding]} contentContainerStyle={{ flex: 1 }}>
                <View style={[defaultStyles.mainContainer_mh]}>
                    <Text style={userStyle.text_xlg_header}>{strings['profile.welcome']}</Text>
                    <Text style={[userStyle.text_xlg, { marginTop: appPadding.sm(true) }]}>
                        {strings['profile.nameDetails']}
                    </Text>
                    <View style={formStyles.userProfileGroup}>
                        <KeyboardAvoidingView style={formStyles.userProfileInputContainer}>
                            <FloatingLabelInput
                                isValid={isName(values.name)}
                                label={strings['profile.name']}
                                value={values.name}
                                onChangeText={value => handleChange({ name: 'name', value })}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss();
                                    showDatePicker();
                                }}
                                onBlur={() => {
                                    Keyboard.dismiss();
                                }}
                            />
                        </KeyboardAvoidingView>
                        <Text style={userStyle.text_xxs}>{strings['profile.character']}</Text>
                    </View>
                    <Text style={[userStyle.text_xlg, { marginTop: 10 }]}>{strings['profile.old']}</Text>
                    <View style={formStyles.userProfileGroup}>
                        <View>
                            <TouchableHighlight onPress={showDatePicker} underlayColor={'transparent'}>
                                <View style={[formStyles.userProfileInputContainer, defaultStyles.viewContainer]}>
                                    <TextInput
                                        maxLength={15}
                                        style={defaultStyles.inputs}
                                        placeholder={strings['profile.birthday']}
                                        placeholderTextColor={appColors.tertiary}
                                        returnKeyType="next"
                                        autoCorrect={false}
                                        editable={false}
                                        value={values.dob !== '' ? moment(values.dob).format('MM-DD') : undefined}
                                        onChangeText={value => handleChange({ name: 'dob', value })}
                                        clearButtonMode={'while-editing'}
                                        blurOnSubmit={false}
                                        onTouchStart={showDatePicker}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            onChange={onValueChange}
                            maxWidth={selectDeviceType({ Tablet: isPortrait ? width * 0.85 : width * 0.9 }, width)}
                            value={values.dob !== '' ? values.dob : new Date()}
                            locale="en"
                            mode="full"
                            autoTheme={true}
                            theme={'light'}
                        />
                        <Text style={userStyle.text_xxs}>{strings['profile.Optional']}</Text>
                    </View>
                    <Button
                        disabled={!values.name || values.name.length > 15 || !isName(values.name) || isSubmitLoading}
                        title={strings['global.continue_btn']}
                        containerStyle={userStyle.button}
                        onPress={() => {
                            handleSubmit();
                        }}
                        loading={isSubmitLoading}
                    />
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};
