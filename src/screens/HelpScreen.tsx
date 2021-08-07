import React from 'react';
import { View, StyleSheet, Platform, ScrollView, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useDimensions } from '@react-native-community/hooks';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appPadding, appFonts } from '../../AppStyles';
import RightArrow from '../../assets/images/RightArrow.svg';
import { useLocalization } from '../contexts/LocalizationContext';
import { settingStyle } from '../styles/Settings.Style';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { authHomeStyle } from 'styles/AuthHome.style';
import Button from './components/Button';

interface SettingsItemProps {
    type: any;
    key: string;
    [key: string]: any;
}

const HelpScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { width, height } = useDimensions().window;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    const { strings } = useLocalization();
    let { appColors } = appTheme && appTheme(prefs);
    const isPortrait = height > width;
    const settStyle = settingStyle({ appColors, isPortrait });
    const formStyles = authHomeStyle({ appColors, isPortrait });
    type BROWSE_TYPE = 'faq' | 'privacyPolicy' | 'termsCondition' | 'contentAvailability' | 'contact';

    const defaultStyles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        rowWrapperStyle: {
            height: selectDeviceType({ Handset: 70 }, 100),
            backgroundColor: appColors.backgroundInactive,
            borderColor: appColors.border,
            paddingHorizontal: appPadding.sm(true),
        },
        mainText: {
            color: appColors.secondary,
            fontFamily: appFonts.medium,
            fontSize: appFonts.xs,
        },
        listBottomPadding: {
            width: Platform.isTV ? '40%' : '100%',
            alignSelf: 'center',
        },
        contentContainer: {
            marginHorizontal: selectDeviceType({ Tablet: '25%' }, appPadding.sm(true)),
            marginVertical: appPadding.sm(true),
        },
        disclaimerContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: selectDeviceType({ Tablet: 20 }, 20),
        },
        disclaimerText: {
            color: appColors.caption,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
        },
        linkColor: {
            color: appColors.brandTint,
        },
    });

    const helpList: Array<SettingsItemProps> = [
        {
            type: 'ACTION_BUTTON',
            key: `${strings['title.faq']}`,
            screen: NAVIGATION_TYPE.FAQ,
        },
        // {
        //     type: 'ACTION_BUTTON',
        //     key: `${strings['title.contentAvailability']}`,
        //     screen: NAVIGATION_TYPE.CONTENT_AVAILABILITY,
        // },
    ];

    const openBrowser = async (type: BROWSE_TYPE) => {
        try {
            navigation.navigate(NAVIGATION_TYPE.BROWSE_WEBVIEW, {
                type: type,
            });
        } catch (error) {
            console.log(`[InAppBrowser] Error loading url: ${type}`, error);
        }
    };

    const handlePress = (screen: string) => {
        if (screen === NAVIGATION_TYPE.FAQ) {
            openBrowser('faq');
        } else if (screen === NAVIGATION_TYPE.CONTENT_AVAILABILITY) {
            openBrowser('contentAvailability');
        } else if (screen === NAVIGATION_TYPE.CONTACT) {
            openBrowser('contact');
        } else if (screen === NAVIGATION_TYPE.PRIVACY_POLICY) {
            openBrowser('privacyPolicy');
        }
    };

    const ListSection = ({ settings }: { sectionTitle: string; settings: Array<SettingsItemProps> }) => {
        return (
            <View>
                {settings.map((item, i) =>
                    !item.hide ? (
                        <ListItem
                            topDivider={true}
                            bottomDivider={i !== 1}
                            key={i}
                            underlayColor={appColors.primaryVariant1}
                            containerStyle={defaultStyles.rowWrapperStyle}
                            title={item.key}
                            titleStyle={defaultStyles.mainText}
                            rightIcon={item.key !== 'Sign out' ? <RightArrow /> : undefined}
                            onPress={() => handlePress(item.screen)}
                            switch={
                                item.type === 'SWITCH'
                                    ? {
                                          value: item.value,
                                          onValueChange: () => item.toggle && item.toggle(),
                                      }
                                    : undefined
                            }
                        />
                    ) : (
                        undefined
                    ),
                )}
            </View>
        );
    };

    return (
        <BackgroundGradient insetTabBar={true}>
            <View style={[defaultStyles.container, settStyle.mainContainer_mh, settStyle.mainContainer_mv]}>
                <ScrollView style={defaultStyles.listBottomPadding}>
                    <ListSection sectionTitle={'HelpList'} settings={helpList} />
                    <View style={defaultStyles.contentContainer}>
                        <View style={defaultStyles.disclaimerContainer}>
                            <Text style={defaultStyles.disclaimerText}>
                                {strings['helpScreenKey.disclaimer.prefix']}
                                <Text
                                    style={defaultStyles.linkColor}
                                    onPress={() => handlePress(NAVIGATION_TYPE.PRIVACY_POLICY)}>
                                    {strings['helpScreenKey.disclaimer_privacy_policy']}
                                </Text>
                                {strings['helpScreenKey.disclaimer.suffix']}
                            </Text>
                        </View>
                        <View style={formStyles.buttonWrapper}>
                            <Button
                                title={strings['helpScreenKey.contact']}
                                onPress={() => handlePress(NAVIGATION_TYPE.CONTACT)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </BackgroundGradient>
    );
};

export default HelpScreen;
