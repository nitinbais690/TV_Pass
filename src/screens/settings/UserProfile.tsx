import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ActionSheet from 'react-native-actionsheet';
import { ClientContext } from 'react-fetching-library';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import useForm from 'helper/useForm';
import { Lang } from 'qp-discovery-ui';
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
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

const initialValues = {
    name: '',
    dob: '',
    gender: '',
};

export const UserProfile = ({ navigation: {} }: { navigation: any }) => {
    const actionSheetRef = useRef<ActionSheet>(null);
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
    const { accessToken, updatedAccountProfile } = useAuth();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { triggerSubscribedFlow } = useAppState();
    const [pickerSelection, setPickerSelection] = useState('');
    // const [pickerDisplayed, setPickerDisplayed] = useState(false);
    const updateProfileEndpoint = EvergentEndpoints.UpdateProfile;
    const isPortrait = height > width;
    // const settStyle = settingStyle({ appColors, isPortrait });
    const minimumDate = moment()
        .subtract(100, 'years')
        .toDate();
    const auth = useAuth();
    const { recordEvent } = useAnalytics();
    const defaultStyles = StyleSheet.create({
        listBottomPadding: {
            margin: appPadding.md(true),
        },
        mainContainer_mh: {
            marginHorizontal: selectDeviceType({ Tablet: isPortrait ? '15%' : '25%' }, appPadding.sm()),
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
        pickerTextStyle: {
            height: 50,
            marginTop: 11,
            opacity: pickerSelection ? 1 : 0.6,
            color: pickerSelection ? appColors.secondary : appColors.tertiary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
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

    async function userProfile({
        firstName,
        dateOfBirth,
        gender,
    }: {
        firstName: string;
        dateOfBirth: Lang;
        gender: string;
    }) {
        const body = requestBody(updateProfileEndpoint, appConfig, { firstName, dateOfBirth, gender });

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
        } else {
            recordEvent(AppEvents.UPDATE_PROFILE);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSubmitCB() {
        setIsSubmitLoading(true);
        userProfile({
            firstName: values.name,
            dateOfBirth: values.dob,
            gender: pickerSelection,
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

    const handleConfirm = (date: any) => {
        handleChange({ name: 'dob', value: new Date(date).getTime() });
        hideDatePicker();
    };

    // const setPickerValue = (newValue: any) => {
    //     setPickerSelection(newValue);
    //     togglePicker();
    // };

    // const togglePicker = () => {
    //     setPickerDisplayed(!pickerDisplayed);
    // };

    const pickerValues = [
        {
            key: 0,
            label: strings['global.cancel'],
            value: '',
        },
        {
            key: 1,
            label: strings['profile.male'],
            value: 'Male',
        },
        {
            key: 2,
            label: strings['profile.female'],
            value: 'Female',
        },
        {
            key: 3,
            label: strings['profile.other'],
            value: 'Others',
        },
    ];

    const showActionSheet = () => {
        if (actionSheetRef.current) {
            actionSheetRef.current.show();
        }
    };

    return (
        <BackgroundGradient insetHeader={false}>
            <ScrollView style={[defaultStyles.listBottomPadding, defaultStyles.mainContainer_mh]}>
                <Text style={userStyle.text_xlg_header}>{strings['profile.welcome']}</Text>
                <Text style={[userStyle.text_xlg, { marginTop: appPadding.md(true) }]}>
                    {strings['profile.nameDetails']}
                </Text>
                <View style={formStyles.userProfileGroup}>
                    <KeyboardAvoidingView style={formStyles.userProfileInputContainer}>
                        <FloatingLabelInput
                            isValid
                            label={strings['profile.name']}
                            value={values.name}
                            onChangeText={value => handleChange({ name: 'name', value })}
                            onSubmitEditing={() => {
                                Keyboard.dismiss();
                                showDatePicker();
                            }}
                            onBlur={() => {
                                Keyboard.dismiss();
                                showDatePicker();
                            }}
                        />
                    </KeyboardAvoidingView>
                    <Text style={userStyle.text_xxs}>{strings['profile.character']}</Text>
                </View>
                <Text style={[userStyle.text_xlg, { marginTop: appPadding.xs(true) }]}>{strings['profile.old']}</Text>
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
                                    value={values.dob !== '' ? moment(values.dob).format('LL') : undefined}
                                    onChangeText={value => handleChange({ name: 'dob', value })}
                                    clearButtonMode={'while-editing'}
                                    blurOnSubmit={false}
                                />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            minimumDate={minimumDate}
                            maximumDate={new Date()}
                        />
                    </View>
                    <Text style={userStyle.text_xxs}>{strings['profile.Optional']}</Text>
                </View>
                <Text style={userStyle.text_xlg}>{strings['profile.genderDetails']}</Text>
                <View style={formStyles.userProfileGroup}>
                    <TouchableHighlight onPress={() => showActionSheet()} underlayColor={'transparent'}>
                        <View style={[formStyles.userProfileInputContainer, defaultStyles.viewContainer]}>
                            <View style={[formStyles.inputs]}>
                                <Text style={defaultStyles.pickerTextStyle}>
                                    {pickerSelection
                                        ? pickerValues
                                              .filter(obj => obj.value === pickerSelection)
                                              .map(filteredObj => filteredObj.label)
                                        : strings['profile.notSpecified']}
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <Text style={userStyle.text_xxs}>{strings['profile.Optional']}</Text>
                </View>
                <Button
                    disabled={!values.name || values.name.length > 15 || isSubmitLoading}
                    title={strings['global.continue_btn']}
                    containerStyle={userStyle.button}
                    onPress={() => {
                        handleSubmit();
                    }}
                    loading={isSubmitLoading}
                />
                <ActionSheet
                    ref={actionSheetRef}
                    options={pickerValues.map(q => q.label)}
                    cancelButtonIndex={0}
                    onPress={index => {
                        if (index > 0) {
                            setPickerSelection(pickerValues[index].value);
                        }
                    }}
                />
            </ScrollView>
        </BackgroundGradient>
    );
};
