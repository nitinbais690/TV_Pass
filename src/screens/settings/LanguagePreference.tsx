import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, FlatList, SafeAreaView, Platform } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts, appPadding } from '../../../AppStyles';
import FastImage from 'react-native-fast-image';
import { useProfiles } from '../../contexts/ProfilesContextProvider';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { useLocalization } from 'contexts/LocalizationContext';
import { percentage } from 'qp-common-ui';
import { useAuth } from 'contexts/AuthContextProvider';
interface LanguageItemProps {
    [key: string]: any;
}
export const LanguagePreferenceScreen = ({ navigation }: { navigation: any }) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { updateActiveAppLanguage, preferredLang, activeProfile } = useProfiles();
    const { accessToken } = useAuth();
    const styles = StyleSheet.create({
        root: {
            flex: 1,
            marginTop: appPadding.xxxl(),
            marginHorizontal: appPadding.sm(),
            alignItems: 'center',
        },
        buttonContainer: {
            width: Platform.isTV ? percentage(20, true) : percentage(46, true),
            aspectRatio: 6 / 2,
            elevation: 2,
            marginVertical: appPadding.xxs(),
            justifyContent: 'center',
        },
        activeButton: {
            borderColor: appColors.brandTint,
            borderWidth: 1,
        },
        cardStyle: {
            height: Platform.isTV ? percentage(5, true) : percentage(13, true),
            width: Platform.isTV ? percentage(19, true) : percentage(44, true),
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.4,
            backgroundColor: appColors.backgroundInactive,
            borderRadius: 4,
            paddingLeft: appPadding.sm(),
            paddingRight: appPadding.sm(),
            borderWidth: 1,
        },
        textStyle: {
            color: appColors.secondary,
            fontSize: appFonts.md,
            fontFamily: appFonts.primary,
        },
        LanguageMenuContainer: {
            justifyContent: 'center',
            flexDirection: 'column',
        },
        selectedImage: {
            top: 0,
            width: 15,
            height: 15,
            position: 'absolute',
            alignSelf: 'flex-end',
            elevation: 2,
        },
        saveButton: {
            width: Platform.isTV ? percentage(40, true) : percentage(100, true),
            aspectRatio: 14 / 2,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            bottom: appPadding.xl(),
            alignSelf: 'center',
        },
    });
    const LanguageMenu: Array<LanguageItemProps> = [
        { title: 'Tamil', key: 'tam' },
        { title: 'Telugu', key: 'tel' },
    ];
    const [selectedLanguage, setSelectedLanguage] = useState<string>();
    const [isSelectedLanguageDefault, setIsSelectedLanguageDefault] = useState<boolean>(true);
    const { strings } = useLocalization();

    useEffect(() => {
        preferredLang && setSelectedLanguage(preferredLang);
    }, [preferredLang]);

    useEffect(() => {
        !accessToken && updateActiveAppLanguage();
    }, [accessToken, updateActiveAppLanguage]);

    const defaultRenderResource = ({ item }: { item: LanguageItemProps }): JSX.Element => {
        const isActive = item.key === selectedLanguage;

        return (
            <TouchableHighlight
                style={styles.buttonContainer}
                onPress={() => {
                    setSelectedLanguage(item.key);
                    setIsSelectedLanguageDefault(preferredLang === item.key);
                }}>
                <>
                    <View style={[styles.cardStyle, isActive ? styles.activeButton : undefined]}>
                        <Text style={styles.textStyle}>{item.title}</Text>
                    </View>
                    {isActive && (
                        <FastImage
                            source={require('../../../assets/images/selected.png')}
                            style={styles.selectedImage}
                        />
                    )}
                </>
            </TouchableHighlight>
        );
    };
    const [isFocused, setIsFocused] = useState(false);
    //Workaround to fix https://github.com/react-native-tvos/react-native-tvos/issues/114
    useEffect(
        () =>
            navigation.addListener('focus', () => {
                setIsFocused(true);
            }),
        [navigation],
    );
    useEffect(
        () =>
            navigation.addListener('blur', () => {
                setIsFocused(false);
            }),
        [navigation],
    );
    return (
        <BackgroundGradient insetTabBar={true}>
            <SafeAreaView style={styles.root}>
                <FlatList<LanguageItemProps>
                    data={LanguageMenu}
                    renderItem={defaultRenderResource}
                    numColumns={1}
                    contentContainerStyle={styles.LanguageMenuContainer}
                />
                <TouchableHighlight
                    style={[
                        styles.saveButton,
                        {
                            backgroundColor: isSelectedLanguageDefault
                                ? appColors.tertiary
                                : accessToken
                                ? appColors.brandTint
                                : appColors.tertiary,
                        },
                    ]}
                    accessibilityLabel={'Card View'}
                    underlayColor={accessToken ? appColors.brandTint : appColors.tertiary}
                    onPress={() => {
                        if (isFocused) {
                            selectedLanguage &&
                                activeProfile &&
                                updateActiveAppLanguage(activeProfile, selectedLanguage);
                            accessToken && navigation.goBack();
                        }
                    }}>
                    <Text style={styles.textStyle}>{strings['global.okay']}</Text>
                </TouchableHighlight>
            </SafeAreaView>
        </BackgroundGradient>
    );
};
