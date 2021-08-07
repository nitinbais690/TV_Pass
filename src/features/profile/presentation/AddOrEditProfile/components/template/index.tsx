import React, { useState } from 'react';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { View } from 'react-native';
import { editProfileStyle } from './styles';
import BackNavigation from 'core/presentation/components/atoms/BackNavigation';
import { useLocalization } from 'contexts/LocalizationContext';
import FlexButtons from 'core/presentation/components/atoms/FlexButtons';
import { TextinputBoxWithLabel } from '../molecules/TextInputBoxWithLabel';
import { LanguageSelection } from '../molecules/LanguageSelection';
import { APP_LANGUAGE_CONSTANTS } from 'features/language-selection/utils/app-language-constants';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import { useAddOrUpdateContact } from 'features/profile/presentation/hooks/useAddOrUpdateContact';
import { useDeleteContact } from 'features/profile/presentation/hooks/useDeleteContact';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import PopupLanguageSelection from './PopupLanguageSelection';
import { AUTOMATION_TEST_ID } from 'features/profile/presentation/automation-ids';
import { useProfiles } from 'contexts/ProfilesContextProvider';
import AlertPopUp from 'core/presentation/components/molecules/AlertPopUp';
import { Profile } from 'features/profile/domain/entities/profile';

const AddOrEditProfileTemplate = ({ navigation, isEditProfile, resource }: AddOrEditProfileTemplateProps) => {
    const style = editProfileStyle();
    const [isLanguageSelectionOpen, setIsLanguageSelectionOpen] = useState(false);
    const [scrrenType, setScreenType] = useState(APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN);
    const { strings } = useLocalization();
    const { onProfileUpdated } = useProfiles();
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const { addOrUpdateContact } = useAddOrUpdateContact();
    const { deleteContact } = useDeleteContact();

    const [state, setState] = useState({
        firstName: resource ? resource.firstName : '',
        contentLanguage:
            resource && resource.contentLanguage ? resource.contentLanguage : APP_LANGUAGE_CONSTANTS.TELUGU,
        language: resource && resource.language ? resource.language : APP_LANGUAGE_CONSTANTS.ENGLISH,
        isError: false,
    });

    const noError = {
        code: '',
        message: '',
        retry: () => {},
        visible: false,
    };

    const [error, setError] = useState(noError);

    const updateLanguage = (language: string) => {
        if (scrrenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN) {
            setState(prevState => ({
                ...prevState,
                contentLanguage: language,
                language: state.language,
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                contentLanguage: state.contentLanguage,
                language: language,
            }));
        }
    };

    const updateProfileName = (name: string) => {
        setState(prevState => ({
            ...prevState,
            firstName: name,
        }));
        if (state.isError && name.length > 0) {
            setState(prevState => ({
                ...prevState,
                isError: false,
            }));
        }
    };

    const getInitiallanguage = (): string => {
        return scrrenType === APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN ? state.contentLanguage : state.language;
    };

    const saveProfile = async () => {
        if (!state.firstName || state.firstName.length === 0) {
            setState(prevState => ({
                ...prevState,
                isError: true,
            }));
        } else {
            setIsSubmitLoading(true);
            hideError();
            const resState = await addOrUpdateContact({
                firstName: state.firstName,
                language: state.language,
                contentLanguage: state.contentLanguage,
                contactID: resource ? resource.contactID : null,
            });
            setIsSubmitLoading(false);
            if (resState.success) {
                onProfileUpdated();
                navigation.goBack();
            } else {
                const message = resState.error ? resState.error.message : strings['global.error.message'];
                setError(prevState => ({
                    ...prevState,
                    message: message,
                    retry: saveProfile,
                    visible: true,
                }));
            }
        }
    };

    const deleteProfile = async () => {
        setIsSubmitLoading(true);
        hideError();
        const resState = await deleteContact(resource ? resource.contactID : '');
        setIsSubmitLoading(false);
        if (resState.accountDeleted) {
            onProfileUpdated();
            navigation.goBack();
        } else {
            const message = resState.error ? resState.error.message : strings['global.error.message'];
            setError(prevState => ({
                ...prevState,
                message: message,
                retry: deleteProfile,
                visible: true,
            }));
        }
    };

    const hideError = () => {
        setError(noError);
    };

    return (
        <BackgroundGradient style={style.container}>
            <BackNavigation
                isFullScreen={true}
                navigationTitle={isEditProfile ? strings.editProfile : strings.addProfile}
                onPress={() => {
                    navigation.goBack();
                }}
            />

            <View style={style.contentContainer}>
                <View style={style.content}>
                    <TextinputBoxWithLabel
                        onChangeText={text => {
                            updateProfileName(text);
                        }}
                        value={state.firstName}
                        maxLength={100}
                        label={strings.profileName}
                        isError={state.isError}
                        validationError={strings.profileValidationError}
                        textInputBoxTestID={AUTOMATION_TEST_ID.TEXT_BOX_PROFILE_NAME}
                        textInputBoxAccessibilityLabel={AUTOMATION_TEST_ID.TEXT_BOX_PROFILE_NAME}
                    />

                    <LanguageSelection
                        onPress={() => {
                            setScreenType(APP_LANGUAGE_CONSTANTS.CONTENT_LANGUAGE_SCREEN);
                            setIsLanguageSelectionOpen(true);
                        }}
                        style={style.contentLanguage}
                        value={state.contentLanguage}
                        label={strings.contentLanguage}
                        dropDownTestID={AUTOMATION_TEST_ID.CONTENT_LANGUAGE + state.contentLanguage}
                        dropDownaccessibilityLabel={AUTOMATION_TEST_ID.CONTENT_LANGUAGE + state.contentLanguage}
                    />

                    <View style={style.borderbottom} />

                    <LanguageSelection
                        onPress={() => {
                            setScreenType(APP_LANGUAGE_CONSTANTS.APP_LANGUAGE_SCREEN);
                            setIsLanguageSelectionOpen(true);
                        }}
                        style={style.appLanguage}
                        value={state.language}
                        label={strings.appLanguage}
                        dropDownTestID={AUTOMATION_TEST_ID.APP_LANGUAGE + state.appLanguage}
                        dropDownaccessibilityLabel={AUTOMATION_TEST_ID.APP_LANGUAGE + state.appLanguage}
                    />
                </View>

                {isEditProfile && (
                    <FlexButtons
                        containerStyle={style.buttonContainer}
                        onPressPrimary={() => {
                            saveProfile();
                        }}
                        onPressSecondary={() => {
                            deleteProfile();
                        }}
                        primryButtonText={strings.save}
                        secondaryButtonText={strings.removeProfile}
                        primaryTestID={AUTOMATION_TEST_ID.SAVE_BUTTON}
                        primaryAccessibilityLabel={AUTOMATION_TEST_ID.SAVE_BUTTON}
                        secondaryTestID={AUTOMATION_TEST_ID.REMOVE_PROFILE_BUTTON}
                        secondaryAccessibilityLabel={AUTOMATION_TEST_ID.REMOVE_PROFILE_BUTTON}
                    />
                )}

                {!isEditProfile && (
                    <PrimaryButton
                        containerStyle={style.singleButton}
                        title={strings.proceed}
                        onPress={() => {
                            saveProfile();
                        }}
                        primaryTestID={AUTOMATION_TEST_ID.PROCEED_BUTTON}
                        primaryAccessibilityLabel={AUTOMATION_TEST_ID.PROCEED_BUTTON}
                    />
                )}
            </View>
            {isLanguageSelectionOpen && (
                <PopupLanguageSelection
                    onPrimaryAction={(language: string) => {
                        setIsLanguageSelectionOpen(false);
                        updateLanguage(language);
                    }}
                    isVisible={isLanguageSelectionOpen}
                    onModelClose={() => {
                        setIsLanguageSelectionOpen(false);
                    }}
                    currentLanguage={getInitiallanguage()}
                    languages={state}
                    screenType={scrrenType}
                />
            )}

            {error.visible && (
                <AlertPopUp
                    alertMessage={error.message}
                    isVisible={true}
                    onModelClosed={() => {
                        hideError();
                    }}
                    primryButtonText={strings['global.retry_btn']}
                    secondaryButtonText={strings['global.cancel']}
                    onPressPrimary={() => {
                        error.retry();
                    }}
                    onPressSecondary={() => {
                        hideError();
                    }}
                />
            )}

            {isSubmitLoading && <AppLoadingIndicator style={style.loaderStyle} />}
        </BackgroundGradient>
    );
};

interface AddOrEditProfileTemplateProps {
    navigation: any;
    isEditProfile: boolean;
    resource: Profile;
}

export default AddOrEditProfileTemplate;
