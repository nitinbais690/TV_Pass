import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView, Keyboard } from 'react-native';
import moment from 'moment';
import { useDimensions } from '@react-native-community/hooks';
import ActionSheet from 'react-native-actionsheet';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAlert } from 'contexts/AlertContext';
import { AccountProfile } from 'utils/EvergentAPIUtil';
import { userProfileStyle } from 'styles/UserProfile.style';
import { formStyle } from 'styles/Common.style';
import { settingStyle } from 'styles/Settings.Style';
import { appPadding } from '../../../AppStyles';
// import Button from '../components/Button';
import useForm from 'helper/useForm';
import { EvergentEndpoints, requestBody, isSuccess, errorCode, responsePayload } from 'utils/EvergentAPIUtil';
import { authAction } from 'contexts/AuthContextProvider';
import { ClientContext } from 'react-fetching-library';
import { profileValidate } from 'helper/validateRules';
import { selectDeviceType } from 'qp-common-ui';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import FloatingLabelInput from '../components/FloatingLabelInput';

const initialValues = {
    name: '',
    dob: '',
    gender: '',
};

export const ProfileScreen = ({ navigation: {} }: { navigation: any }) => {
    const { Alert } = useAlert();
    const actionSheetRef = useRef<ActionSheet>(null);
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { strings }: any = useLocalization();
    const formStyles = formStyle({ appColors, appPadding });
    const userStyle = userProfileStyle({ appColors });
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const userAction = useAuth();
    const { accountProfile } = userAction;
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, profileValidate);
    const { appConfig } = useAppPreferencesState();
    const updateProfileEndpoint = EvergentEndpoints.UpdateProfile;
    const { accessToken, updatedAccountProfile } = useAuth();
    const { query } = useContext(ClientContext);

    async function userProfile({
        firstName,
        dateOfBirth,
        gender,
    }: {
        firstName: string;
        dateOfBirth: number;
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
        if (accountProfile && accountProfile.contactMessage.length > 0) {
            const nameData = accountProfile.contactMessage[0].firstName;
            const genderData = accountProfile.contactMessage[0].gender;
            handleChange({ name: 'name', value: nameData });
            if (genderData) {
                handleChange({ name: 'gender', value: genderData });
            }
        }
    }, [accountProfile, handleChange]);

    async function handleSubmitCB() {
        userProfile({
            firstName: values.name,
            dateOfBirth: values.dob,
            gender: values.gender,
        })
            .then(async () => {
                await updatedAccountProfile();
            })
            .catch(err => {
                let msg;
                if (err) {
                    msg = strings.formatString(strings['global.error_code'], err) as string;
                }
                Alert.alert(strings['profile.error.' + err] || strings['global.error.message'], msg, [
                    { text: strings['global.okay'] },
                ]);
            });
    }

    const defaultStyles = StyleSheet.create({
        listBottomPadding: {
            margin: appPadding.md(true),
        },
        modalOverlay: {
            paddingHorizontal: selectDeviceType({ Tablet: isPortrait ? '15%' : '25%' }, '5%'),
            justifyContent: 'flex-end',
        },
    });

    const displayNamFromAccount = (profile?: AccountProfile) => {
        if (profile && profile.contactMessage && profile.contactMessage.length) {
            return profile.contactMessage[0].firstName;
        }
        return '';
    };

    const getInitials = (name: string) => {
        let words = name && name.split(' ');
        let singleLetterData = words && words.map(X => X[0]);
        return singleLetterData && singleLetterData.join('').toUpperCase();
    };

    const displayName = displayNamFromAccount(accountProfile);
    const initials = getInitials(displayName);
    const subscribeSince = accountProfile && moment(accountProfile.subscriberSince).format('YYYY');
    const pickerValues = [
        {
            key: 1,
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
        <BackgroundGradient insetTabBar={true}>
            <View style={settStyle.profileContainer_mh}>
                <ScrollView>
                    <View style={defaultStyles.listBottomPadding}>
                        <View style={[settStyle.profile_header, settStyle.formSpacing]}>
                            <View style={settStyle.image}>
                                <Text style={settStyle.center}>{initials}</Text>
                            </View>
                            <View style={settStyle.image_banner}>
                                <Text style={userStyle.text_xxlg}>
                                    {strings['profile.subscribe']} {subscribeSince}
                                </Text>
                            </View>
                        </View>
                        <View style={[formStyles.inputContainer, settStyle.formSpacing]}>
                            <FloatingLabelInput
                                label={strings['profile.name']}
                                value={values.name}
                                onChangeText={value => handleChange({ name: 'name', value })}
                                onBlur={() => {
                                    handleSubmitCB();
                                }}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss();
                                    handleSubmitCB();
                                }}
                            />
                        </View>
                        <View>
                            <TouchableHighlight underlayColor={'transparent'}>
                                <View style={[formStyles.inputContainer, settStyle.formSpacing]}>
                                    <FloatingLabelInput
                                        label={strings['profile.date']}
                                        disabled
                                        value={
                                            (accountProfile &&
                                                accountProfile.contactMessage.length > 0 &&
                                                accountProfile.contactMessage[0].dateOfBirth != undefined &&
                                                moment(accountProfile.contactMessage[0].dateOfBirth).format('LL')) ||
                                            undefined
                                        }
                                        onChangeText={value => handleChange({ name: 'dob', value })}
                                    />
                                </View>
                            </TouchableHighlight>
                        </View>
                        <TouchableHighlight
                            style={formStyles.inputContainer}
                            onPress={() => showActionSheet()}
                            underlayColor={'transparent'}>
                            <FloatingLabelInput
                                showLabel
                                useActionSheet
                                label={strings['profile.gender']}
                                disabled
                                value={values.gender ? values.gender : strings['profile.gender']}
                                onChangeText={value => handleChange({ name: 'gender', value })}
                            />
                        </TouchableHighlight>
                        {/* <Button
                            disabled={
                                accountProfile &&
                                accountProfile.contactMessage.length > 0 &&
                                values.name === accountProfile.contactMessage[0].firstName &&
                                values.gender === accountProfile.contactMessage[0].gender
                            }
                            title={strings['profile.update']}
                            containerStyle={userStyle.button}
                            onPress={() => {
                                handleSubmit();
                            }}
                            loading={isSubmitLoading}
                        /> */}
                    </View>
                </ScrollView>
                <ActionSheet
                    ref={actionSheetRef}
                    options={pickerValues.map(q => q.label)}
                    cancelButtonIndex={0}
                    onPress={index => {
                        if (index > 0) {
                            handleChange({ name: 'gender', value: pickerValues[index].value });
                            handleSubmit();
                        }
                    }}
                />
            </View>
        </BackgroundGradient>
    );
};
