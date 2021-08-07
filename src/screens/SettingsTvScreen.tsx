import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableHighlight,
    findNodeHandle,
    TouchableWithoutFeedback,
    useTVEventHandler,
} from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appPadding, appFonts, tvPixelSizeForLayout } from '../../AppStyles';
import { useLocalization } from '../contexts/LocalizationContext';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { ProfileScreen } from './settings/Profile';
import SignOut from './settings/SignOut';
import Account from './settings/Account';
import Menu from '../TV/components/Menu';
import AppContant from 'utils/AppContant';
import LegalIcon from '../../assets/images/legal.svg';
import HelpIcon from '../../assets/images/help_tv.svg';
import CreditsIcon from '../../assets/images/credit_tv.svg';
import Button from './components/Button';
import { useUserData } from 'contexts/UserDataContextProvider';

interface SettingsItemProps {
    type: any;
    key: string;
    [key: string]: any;
}
interface ButtonOptions {
    data: SettingsItemProps;
    blockFocusDown: boolean;
    onPress: (str: string) => void;
    isFocusedFlag: boolean;
    onFocus: () => void;
    index: number;
    selectedIndex: number;
}

/**
 * A component to display the settings/preference screen.
 *
 * @param props The app preference props
 */
const SettingsTVScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const { settingValue, updateSettingValue } = useUserData();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const [childComponent, setChildComponent] = useState(NAVIGATION_TYPE.ACCOUNT);
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { height } = useDimensions().window;

    const defaultStyles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            marginTop: tvPixelSizeForLayout(140),
            marginLeft: tvPixelSizeForLayout(160),
            flex: 1,
        },
        settingItemList: {
            alignSelf: 'flex-start',
            flex: 1,
        },
        settingItemContainer: {
            flex: 2.6,
            alignSelf: 'flex-start',
        },
        innerContainer: {
            marginLeft: tvPixelSizeForLayout(173),
            marginRight: tvPixelSizeForLayout(163),
        },
        webviewStyle: {
            width: '100%',
            height: height,
        },
        creditIcon: { paddingVertical: 10 },
        heading: {
            paddingTop: tvPixelSizeForLayout(40),
            color: appColors.secondary,
            fontSize: tvPixelSizeForLayout(75),
            fontFamily: appFonts.primary,
            fontWeight: '600',
        },
        description: {
            paddingTop: tvPixelSizeForLayout(40),
            color: appColors.tertiary,
            fontSize: tvPixelSizeForLayout(32),
            fontFamily: appFonts.primary,
        },
        buttonStyle: {
            marginTop: tvPixelSizeForLayout(50),
            width: tvPixelSizeForLayout(296),
        },
    });

    const settingOptions: Array<SettingsItemProps> = [
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Account']}`,
            screen: NAVIGATION_TYPE.ACCOUNT,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Profile']}`,
            screen: NAVIGATION_TYPE.PROFILE,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Legal']}`,
            screen: NAVIGATION_TYPE.LEGAL,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Help']}`,
            screen: NAVIGATION_TYPE.HELP,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.CreditsWalkthrough']}`,
            screen: NAVIGATION_TYPE.CREDITS_WALKTHROUGH,
        },
        {
            type: 'ACTION_BUTTON',
            key: `${strings['settingsScreenKey.Logout']}`,
            screen: NAVIGATION_TYPE.LOGOUT,
        },
    ];

    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(0);

    const myTVEventHandler = (evt: { eventType: string }) => {
        if (evt.eventType === AppContant.left) {
            setSelectedIndex(selectedIndex);
        }
        if (evt.eventType === AppContant.down) {
            updateSettingValue(false);
        }
        if (evt.eventType === AppContant.up) {
            updateSettingValue(false);
        }
    };

    useTVEventHandler(myTVEventHandler);

    // useEffect(() => {
    //     let unsubscribe = navigation.addListener('focus', () => {
    //         setSelectedIndex(0);
    //         setChildComponent(NAVIGATION_TYPE.ACCOUNT);
    //     });
    //     unsubscribe = navigation.addListener('blur', () => {
    //         setSelectedIndex(undefined);
    //         setChildComponent(NAVIGATION_TYPE.ACCOUNT);
    //     });
    //     return unsubscribe;
    // }, [navigation]);

    useEffect(() => {
        if (settingValue) {
            setChildComponent(NAVIGATION_TYPE.CREDITS_WALKTHROUGH);
            setSelectedIndex(4);
        }
    }, [settingValue, updateSettingValue]);

    return (
        <BackgroundGradient insetTabBar={false}>
            <View style={[defaultStyles.container]}>
                <ScrollView style={defaultStyles.settingItemList}>
                    <TouchableWithoutFeedback hasTVPreferredFocus={true}>
                        <>
                            {settingOptions.map((item, i) =>
                                !item.hide ? (
                                    <HighlightButton
                                        data={item}
                                        blockFocusDown={i === settingOptions.length - 1}
                                        onPress={(newValue: string) => {
                                            // setSelectedIndex(i);
                                            setChildComponent(newValue);
                                        }}
                                        onFocus={index => {
                                            setSelectedIndex(settingValue ? 4 : index);
                                        }}
                                        isFocusedFlag={selectedIndex === i}
                                        selectedIndex={selectedIndex}
                                        index={i}
                                    />
                                ) : (
                                    undefined
                                ),
                            )}
                        </>
                    </TouchableWithoutFeedback>
                </ScrollView>
                <View style={defaultStyles.settingItemContainer}>
                    <ScrollView style={defaultStyles.innerContainer}>
                        {childComponent === NAVIGATION_TYPE.ACCOUNT && <Account />}
                        {childComponent === NAVIGATION_TYPE.PROFILE && <ProfileScreen />}
                        {childComponent === NAVIGATION_TYPE.LEGAL && (
                            <>
                                <LegalIcon width={tvPixelSizeForLayout(76)} height={tvPixelSizeForLayout(100)} />
                                <Text style={defaultStyles.heading}>{strings['settingsScreenKey.Legal']}</Text>
                                <Text style={defaultStyles.description}>{strings['legal.privacy_tv']}</Text>
                                <Text style={defaultStyles.description}>{strings['legal.terms_tv']}</Text>
                            </>
                        )}
                        {childComponent === NAVIGATION_TYPE.HELP && (
                            <>
                                <HelpIcon width={tvPixelSizeForLayout(100)} height={tvPixelSizeForLayout(100)} />
                                <Text style={defaultStyles.heading}>{strings['settingsScreenKey.Help']}</Text>
                                <Text style={defaultStyles.description}>{strings['help.link_label']}</Text>
                            </>
                        )}
                        {childComponent === NAVIGATION_TYPE.CREDITS_WALKTHROUGH && (
                            <>
                                <CreditsIcon width={tvPixelSizeForLayout(99)} height={tvPixelSizeForLayout(99)} />
                                <Text style={defaultStyles.heading}>
                                    {strings['settingsScreenKey.CreditsWalkthrough']}
                                </Text>
                                <Text style={defaultStyles.description}>{strings['creditWalkthrough.label']}</Text>
                                <Button
                                    raised={true}
                                    title={strings['creditWalkthrough.ViewBtn_tv']}
                                    heightTv={tvPixelSizeForLayout(80)}
                                    containerStyle={defaultStyles.buttonStyle}
                                    onPress={() => {
                                        navigation.navigate(NAVIGATION_TYPE.CREDITS_WALKTHROUGH, { setting: true });
                                    }}
                                />
                            </>
                        )}
                        {childComponent === NAVIGATION_TYPE.LOGOUT && <SignOut />}
                    </ScrollView>
                </View>
            </View>
            <Menu isTransparentGradient={true} hasMenuFocus={false} />
        </BackgroundGradient>
    );
};

const HighlightButton = (props: ButtonOptions) => {
    const { data, blockFocusDown, onPress, isFocusedFlag, onFocus, index, selectedIndex } = props;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const touchableHighlightRef = useRef(null);

    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    const defaultStyles = StyleSheet.create({
        rowWrapperStyle: {
            height: tvPixelSizeForLayout(100),
            backgroundColor: appColors.backgroundInactive,
            borderColor: 'transparent',
            paddingHorizontal: appPadding.sm(true),
        },
        rowWrapperStyleActive: {
            backgroundColor: appColors.secondary,
        },
        rowWrapperStyleInActive: {
            backgroundColor: appColors.backgroundInactive,
        },
        mainText: {
            color: appColors.tertiary,
            fontFamily: appFonts.medium,
            fontSize: tvPixelSizeForLayout(28),
        },
        mainHighlightText: {
            color: appColors.primaryEnd,
            fontFamily: appFonts.medium,
            fontSize: tvPixelSizeForLayout(28),
        },
        textContainer: {
            justifyContent: 'center',
            alignSelf: 'center',
            paddingHorizontal: tvPixelSizeForLayout(65),
        },
    });
    return (
        <TouchableHighlight
            ref={onRef}
            hasTVPreferredFocus={isFocusedFlag && index === selectedIndex}
            style={[defaultStyles.rowWrapperStyle]}
            key={data.key}
            underlayColor={isFocusedFlag ? appColors.secondary : 'transparent'}
            onFocus={() => onFocus(index)}
            onPress={() => onPress(data.screen)}
            nextFocusDown={blockFocusDown ? findNodeHandle(touchableHighlightRef.current) : null}>
            <View
                style={[
                    StyleSheet.absoluteFillObject,
                    defaultStyles.textContainer,
                    isFocusedFlag ? defaultStyles.rowWrapperStyleActive : undefined,
                ]}>
                <Text style={isFocusedFlag ? defaultStyles.mainHighlightText : defaultStyles.mainText}>{data.key}</Text>
            </View>
        </TouchableHighlight>
    );
};

export default SettingsTVScreen;
