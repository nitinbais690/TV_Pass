import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Keyboard,
    TextInput,
    Platform,
    useTVEventHandler,
} from 'react-native';
import moment from 'moment';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAuth } from 'contexts/AuthContextProvider';
import { useAlert } from 'contexts/AlertContext';
import { AccountProfile } from 'utils/EvergentAPIUtil';
import { userProfileStyle } from 'styles/UserProfile.style';
import { formStyle } from 'styles/Common.style';
import { settingStyle } from 'styles/Settings.Style';
import { appFonts, appPadding, tvPixelSizeForLayout } from '../../../AppStyles';
// import Button from '../components/Button';
import useForm from 'helper/useForm';
import { EvergentEndpoints, requestBody, isSuccess, errorCode, responsePayload } from 'utils/EvergentAPIUtil';
import { authAction } from 'contexts/AuthContextProvider';
import { ClientContext } from 'react-fetching-library';
import { profileValidate } from 'helper/validateRules';
import { selectDeviceType } from 'qp-common-ui';
import { useSwrve } from 'contexts/SwrveContextProvider';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import FloatingLabelInput from '../components/FloatingLabelInput';
import DateTimePickerModal from 'react-native-month-year-picker';
import useFunction from 'helper/useFunction';
import { AppEvents } from 'utils/ReportingUtils';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import AppContant from 'utils/AppContant';
import { defaultSignupTVStyle } from 'styles/Signup.style';

const initialValues = {
    name: '',
    dob: '',
};

// export const ProfileScreen = ({ navigation }: { navigation?: any }) => {
export const ProfileScreen = () => {
    const { Alert } = useAlert();
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { strings }: any = useLocalization();
    const formStyles = formStyle({ appColors, appPadding });
    const userStyle = userProfileStyle({ appColors });
    const signUpstyles = defaultSignupTVStyle({ appColors, appPadding, isPortrait });
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const userAction = useAuth();
    const { accountProfile } = userAction;
    const { values, handleSubmit, handleChange } = useForm(initialValues, handleSubmitCB, profileValidate);
    const { appConfig } = useAppPreferencesState();
    const updateProfileEndpoint = EvergentEndpoints.UpdateProfile;
    const { accessToken, updatedAccountProfile } = useAuth();
    const { query } = useContext(ClientContext);
    const { swrveUserUpdate } = useSwrve();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const { isName } = useFunction();
    const { recordEvent } = useAnalytics();

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
        if (accountProfile && accountProfile.contactMessage.length > 0) {
            const nameData = accountProfile.contactMessage[0].firstName;
            //const genderData = accountProfile.contactMessage[0].gender;
            handleChange({ name: 'name', value: nameData });
            // if (genderData) {
            //     handleChange({ name: 'gender', value: genderData });
            // }
        }
    }, [accountProfile, handleChange]);

    async function handleSubmitCB() {
        userProfile({
            firstName: values.name,
            dateOfBirth: values.dob !== '' ? moment(values.dob, 'MM-DD').format('MM/DD') : null,
        })
            .then(async () => {
                try {
                    await updatedAccountProfile();
                    swrveUserUpdate({
                        profileUpdate: 1,
                    });
                    recordEvent(AppEvents.UPDATE_PROFILE);
                } catch (e) {
                    console.error('[UserProfile] error updating user profile', e);
                }
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
            margin: Platform.isTV ? 0 : appPadding.md(true),
        },
        modalOverlay: {
            paddingHorizontal: selectDeviceType({ Tablet: isPortrait ? '15%' : '25%' }, '5%'),
            justifyContent: 'flex-end',
        },
        textBirthday: {
            color: appColors.caption,
            position: 'absolute',
            left: 12,
            fontFamily: appFonts.primary,
            backgroundColor: 'transparent',
        },
        labelContainer: {
            marginBottom: selectDeviceType({ Tablet: appPadding.xs(true) }, appPadding.md(true)),
        },
        inputs: {
            padding: 5,
            marginHorizontal: 12,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            height: 50,
        },
        dateInputs: {
            padding: 5,
            marginHorizontal: 16,
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.sm,
            height: 50,
        },
        textEmail: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            marginVertical: appPadding.xs(true),
            textTransform: 'lowercase',
        },
        viewContainer: {
            borderWidth: 2,
            borderColor: 'transparent',
            height: 55,
            alignItems: 'flex-end',
        },
        roundImage: {
            height: tvPixelSizeForLayout(109),
            width: tvPixelSizeForLayout(109),
        },
        subscribeHeading: {
            marginTop: tvPixelSizeForLayout(35),
        },
        textName: {
            color: appColors.tertiary,
            fontFamily: appFonts.medium,
            fontSize: tvPixelSizeForLayout(32),
            fontWeight: '500',
        },
        textValue: {
            color: appColors.secondary,
            fontFamily: appFonts.medium,
            fontSize: tvPixelSizeForLayout(32),
            fontWeight: '500',
        },
        subContainer: {
            marginTop: tvPixelSizeForLayout(80),
        },
        rowProfileContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            marginTop: tvPixelSizeForLayout(40),
        },
        profileLblTv: {
            fontSize: tvPixelSizeForLayout(32),
            color: appColors.tertiary,
            fontWeight: '500',
            fontStyle: 'normal',
            marginBottom: tvPixelSizeForLayout(26),
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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const displayName = displayNamFromAccount(accountProfile);
    const initials = getInitials(displayName);
    const subscribeSince = accountProfile && moment(accountProfile.subscriberSince).format('YYYY');

    const onValueChange = useCallback(
        (event, newDate) => {
            if (event === 'dateSetAction') {
                handleChange({ name: 'dob', value: newDate });
                hideDatePicker();
                handleSubmit();
            } else {
                hideDatePicker();
            }
        },
        [handleChange, handleSubmit],
    );

    let nameRef = useRef();
    let inputRefMonth = useRef();
    let inputRefDay = useRef();

    const [isFocused, setFocused] = React.useState<boolean>(false);
    const [isFocusableMonth, setFocusableIMonthnput] = useState(false);
    const [isFocusableDay, setFocusableDayInput] = useState(false);
    const [lastRemoteKeyEvent, setLastRemoteKeyEvent] = useState();

    useEffect(() => {
        if (lastRemoteKeyEvent === AppContant.left && isFocused) {
            (values.name === undefined || values.name === '') && setFocused(false);
            (values.name === undefined || values.name === '') && nameRef.current.onBlur && nameRef.current.onBlur();
        }

        if (
            accountProfile &&
            accountProfile.contactMessage.length > 0 &&
            accountProfile.contactMessage[0].dateOfBirth === undefined
        ) {
            if (lastRemoteKeyEvent === AppContant.down && isFocused) {
                (values.name === undefined || values.name === '') && setFocused(false);
                setFocusableDayInput(false);
                setFocusableIMonthnput(true);
                inputRefMonth && inputRefMonth.current.onFocus && inputRefMonth.current.onFocus();
                inputRefDay.current.onBlur && inputRefDay.current.onBlur();
                (values.name === undefined || values.name === '') && nameRef.current.onBlur && nameRef.current.onBlur();
            }

            if (lastRemoteKeyEvent === AppContant.right && isFocusableMonth) {
                setFocusableIMonthnput(false);
                setFocusableDayInput(true);
                inputRefMonth.current.onBlur && inputRefMonth.current.onBlur();
                inputRefDay.current.onFocus && inputRefDay.current.onFocus();
            }
            if (lastRemoteKeyEvent === AppContant.left && isFocusableDay) {
                setFocusableDayInput(false);
                setFocusableIMonthnput(true);
                inputRefMonth.current.onFocus && inputRefMonth.current.onFocus();
                inputRefDay.current.onBlur && inputRefDay.current.onBlur();
            }
            if (lastRemoteKeyEvent === AppContant.up && isFocusableDay) {
                setFocusableDayInput(false);
                (values.name === undefined || values.name === '') && setFocused(true);
                inputRefDay.current.onBlur && inputRefDay.current.onBlur();
                (values.name === undefined || values.name === '') &&
                    nameRef.current.onFocus &&
                    nameRef.current.onFocus();
            }
            if (lastRemoteKeyEvent === AppContant.up && isFocusableMonth) {
                setFocusableIMonthnput(false);
                (values.name === undefined || values.name === '') && setFocused(true);
                inputRefMonth.current.onBlur && inputRefMonth.current.onBlur();
                (values.name === undefined || values.name === '') &&
                    nameRef.current.onFocus &&
                    nameRef.current.onFocus();
            }
        }
    }, [isFocusableMonth, isFocusableDay, lastRemoteKeyEvent, isFocused, accountProfile, values.name]);

    const profileTVEventHandler = (evt: { eventType: string }) => {
        setLastRemoteKeyEvent(evt.eventType);
    };

    useTVEventHandler(profileTVEventHandler);

    return (
        <BackgroundGradient insetTabBar={true} transparent={true}>
            <View style={settStyle.profileContainer_mh}>
                <View style={defaultStyles.listBottomPadding}>
                    <View style={[settStyle.profile_header, settStyle.formSpacing]}>
                        {/* <View style={[settStyle.image, Platform.isTV && defaultStyles.roundImage]}>
                            <Text style={settStyle.center}>{initials}</Text>
                        </View>
                         */}

                        {Platform.isTV ? (
                            <TouchableHighlight
                                style={[settStyle.image, defaultStyles.roundImage]}
                                onFocus={() => {
                                    if (values.name === undefined || values.name === '') {
                                        !isFocused && setFocused(true);
                                    } else if (
                                        accountProfile &&
                                        accountProfile.contactMessage.length > 0 &&
                                        accountProfile.contactMessage[0].dateOfBirth === undefined
                                    ) {
                                        setFocusableIMonthnput(true);
                                        setFocusableDayInput(false);
                                    }
                                }}>
                                <Text style={settStyle.center}>{initials}</Text>
                            </TouchableHighlight>
                        ) : (
                            <View style={[settStyle.image]}>
                                <Text style={settStyle.center}>{initials}</Text>
                            </View>
                        )}
                        <View style={settStyle.image_banner}>
                            <Text
                                style={[
                                    userStyle.text_xxlg,
                                    Platform.isTV ? defaultStyles.subscribeHeading : undefined,
                                ]}>
                                {strings['profile.subscribe']} {subscribeSince}
                            </Text>
                            {!Platform.isTV && (
                                <Text style={defaultStyles.textEmail}>
                                    {accountProfile &&
                                        accountProfile.contactMessage.length > 0 &&
                                        accountProfile.contactMessage[0].email}
                                </Text>
                            )}
                        </View>
                    </View>

                    {Platform.isTV ? (
                        <>
                            {values.name !== undefined || values.name !== '' ? (
                                <>
                                    <Text style={defaultStyles.textName}>{strings['profile.name']}</Text>
                                    <Text style={defaultStyles.textValue}>{values.name}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={defaultStyles.profileLblTv}>{strings['profile.name']}</Text>
                                    <FloatingLabelInput
                                        ref={nameRef}
                                        isFocusable={isFocused}
                                        hasTVPreferredFocus={isFocused}
                                        maxLength={15}
                                        label={strings['profile.name']}
                                        value={values.name}
                                        onChangeText={value => {
                                            handleChange({ name: 'name', value });
                                        }}
                                        onFocus={() => {
                                            setFocused(true);
                                        }}
                                        onBlur={() => {
                                            console.log('call name focus');
                                            setFocused(false);
                                            isName(values.name) && handleSubmitCB();
                                        }}
                                        onSubmitEditing={() => {
                                            console.log('call onSubmitEditing');
                                            setFocused(false);
                                            Keyboard.dismiss();
                                            isName(values.name) && handleSubmitCB();
                                        }}
                                    />
                                </>
                            )}

                            {accountProfile &&
                            accountProfile.contactMessage.length > 0 &&
                            accountProfile.contactMessage[0].dateOfBirth !== undefined ? (
                                <View style={defaultStyles.subContainer}>
                                    <Text style={defaultStyles.textName}>{strings['profile.birthday']}</Text>
                                    <Text style={defaultStyles.textValue}>
                                        {moment(accountProfile.contactMessage[0].dateOfBirth, 'MM/DD').format('MM/DD')}
                                    </Text>
                                </View>
                            ) : (
                                <View style={defaultStyles.rowProfileContainer}>
                                    <View style={signUpstyles.inputContainer}>
                                        <Text style={defaultStyles.profileLblTv}>{strings['signup.month']}</Text>
                                        <FloatingLabelInput
                                            ref={inputRefMonth}
                                            value={values.month}
                                            isFocusable={isFocusableMonth}
                                            hasTVPreferredFocus={isFocusableMonth}
                                            maxLength={2}
                                            onChangeText={value => {
                                                if (parseInt(value) > 0 && parseInt(value) <= 12) {
                                                    handleChange({ name: 'month', value: value.trim() });
                                                }
                                            }}
                                            onBlur={() => {
                                                if (values.month) {
                                                    handleChange({
                                                        name: 'dob',
                                                        value: values.month + '-' + values.day,
                                                    });
                                                    handleSubmit();
                                                }
                                            }}
                                            onSubmitEditing={() => {
                                                Keyboard.dismiss();
                                                if (values.month) {
                                                    handleChange({
                                                        name: 'dob',
                                                        value: values.month + '-' + values.day,
                                                    });
                                                    handleSubmit();
                                                }
                                            }}
                                        />
                                    </View>
                                    <View style={signUpstyles.inputContainer}>
                                        <Text style={defaultStyles.profileLblTv}>{strings['signup.day']}</Text>
                                        <FloatingLabelInput
                                            value={values.day}
                                            ref={inputRefDay}
                                            isFocusable={isFocusableDay}
                                            hasTVPreferredFocus={isFocusableDay}
                                            maxLength={2}
                                            onFocus={() => {
                                                setFocusableDayInput(true);
                                                setFocusableIMonthnput(false);
                                            }}
                                            onChangeText={value => {
                                                if (parseInt(value) > 0 && parseInt(value) <= 31) {
                                                    handleChange({ name: 'day', value: value.trim() });
                                                }
                                            }}
                                            onBlur={() => {
                                                if (values.month) {
                                                    handleChange({
                                                        name: 'dob',
                                                        value: values.month + '-' + values.day,
                                                    });
                                                    handleSubmit();
                                                }
                                            }}
                                            onSubmitEditing={() => {
                                                Keyboard.dismiss();
                                                if (values.month) {
                                                    handleChange({
                                                        name: 'dob',
                                                        value: values.month + '-' + values.day,
                                                    });
                                                    handleSubmit();
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <View style={[formStyles.inputContainer, settStyle.formSpacing]}>
                                <FloatingLabelInput
                                    maxLength={15}
                                    label={strings['profile.name']}
                                    value={values.name}
                                    onChangeText={value => handleChange({ name: 'name', value })}
                                    onBlur={() => {
                                        isName(values.name) && handleSubmitCB();
                                    }}
                                    onSubmitEditing={() => {
                                        Keyboard.dismiss();
                                        isName(values.name) && handleSubmitCB();
                                    }}
                                />
                            </View>
                            {accountProfile &&
                            accountProfile.contactMessage.length > 0 &&
                            accountProfile.contactMessage[0].dateOfBirth !== undefined ? (
                                <View>
                                    <View style={defaultStyles.labelContainer}>
                                        <Text style={defaultStyles.textBirthday}> {strings['profile.birthday']} </Text>
                                    </View>
                                    <Text style={defaultStyles.inputs}>
                                        {moment(accountProfile.contactMessage[0].dateOfBirth, 'MM/DD').format('MM-DD')}
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    <TouchableHighlight
                                        style={[formStyles.userProfileInputContainer, defaultStyles.viewContainer]}
                                        onPress={showDatePicker}
                                        underlayColor={'transparent'}>
                                        <TextInput
                                            maxLength={15}
                                            style={defaultStyles.dateInputs}
                                            placeholder={strings['profile.birthday']}
                                            placeholderTextColor={appColors.caption}
                                            returnKeyType="next"
                                            autoCorrect={false}
                                            editable={false}
                                            value={values.dob !== '' ? moment(values.dob).format('MM-DD') : undefined}
                                            onChangeText={value => handleChange({ name: 'dob', value })}
                                            clearButtonMode={'while-editing'}
                                            blurOnSubmit={false}
                                            onTouchStart={showDatePicker}
                                        />
                                    </TouchableHighlight>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        onChange={onValueChange}
                                        maxWidth={selectDeviceType(
                                            { Tablet: isPortrait ? width * 0.85 : width * 0.9 },
                                            width,
                                        )}
                                        value={values.dob !== '' ? values.dob : new Date()}
                                        locale="en"
                                        mode="full"
                                        autoTheme={true}
                                        theme={'light'}
                                    />
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>
        </BackgroundGradient>
    );
};
