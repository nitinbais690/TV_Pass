import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    TVEventHandler,
    TouchableHighlight,
    findNodeHandle,
    BackHandler,
    Platform,
} from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, appPadding, tvPixelSizeForLayout } from '../../../AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import { NAVIGATION_TYPE } from '../../screens/Navigation/NavigationConstants';
import { useAppPreview } from '../../contexts/AppPreviewContextProvider';
import { useNavigation } from '@react-navigation/native';
import { useAppState } from '../../utils/AppContextProvider';
import { CreditsButton } from '../../screens/components/CreditsButton';
import { useFetchRootContainerQuery } from 'qp-discovery-ui';

import MenuItem from './MenuItem';

import IconSearchOff from '../../../assets/images/tv-icons/search_off.svg';
import IconSearchOn from '../../../assets/images/tv-icons/search_on.svg';
import IconSearchHover from '../../../assets/images/tv-icons/search_hover.svg';
import IconBrowseOff from '../../../assets/images/tv-icons/browse_off.svg';
import IconBrowseOn from '../../../assets/images/tv-icons/browse_on.svg';
import IconBrowseHover from '../../../assets/images/tv-icons/browse_hover.svg';
import IconMoviesOff from '../../../assets/images/tv-icons/movies_off.svg';
import IconMoviesOn from '../../../assets/images/tv-icons/movies_on.svg';
import IconMoviesHover from '../../../assets/images/tv-icons/movies_hover.svg';
import IconTvOff from '../../../assets/images/tv-icons/tv_off.svg';
import IconTvOn from '../../../assets/images/tv-icons/tv_on.svg';
import IconTvHover from '../../../assets/images/tv-icons/tv_hover.svg';
import IconShortsOff from '../../../assets/images/tv-icons/shorts_off.svg';
import IconShortsOn from '../../../assets/images/tv-icons/shorts_on.svg';
import IconShortsHover from '../../../assets/images/tv-icons/shorts_hover.svg';
import IconMyContentOff from '../../../assets/images/tv-icons/my_content_off.svg';
import IconMyContentOn from '../../../assets/images/tv-icons/my_content_on.svg';
import IconMyContentHover from '../../../assets/images/tv-icons/my_content_hover.svg';
import IconChannelsOff from '../../../assets/images/tv-icons/channels_off.svg';
import IconChannelsOn from '../../../assets/images/tv-icons/channels_on.svg';
import IconChannelsHover from '../../../assets/images/tv-icons/channels_hover.svg';
import IconSettingsOff from '../../../assets/images/tv-icons/settings_off.svg';
import IconSettingsOn from '../../../assets/images/tv-icons/settings_on.svg';
import IconSettingsHover from '../../../assets/images/tv-icons/settings_hover.svg';
import { useLocalization } from 'contexts/LocalizationContext';

const menuIconHeightWidth = tvPixelSizeForLayout(50);
const MenuTabIcon = [
    {
        name: 'search',
        on: <IconSearchOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconSearchOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconSearchHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.SEARCH,
    },
    {
        name: 'all',
        on: <IconBrowseOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconBrowseOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconBrowseHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.BROWSE,
    },
    {
        name: 'movies',
        on: <IconMoviesOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconMoviesOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconMoviesHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.BROWSE,
    },
    {
        name: 'tv',
        on: <IconTvOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconTvOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconTvHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.BROWSE,
    },
    {
        name: 'shorts',
        on: <IconShortsOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconShortsOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconShortsHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.BROWSE,
    },
    {
        name: 'my content',
        on: <IconMyContentOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconMyContentOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconMyContentHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.MY_CONTENT,
    },
    {
        name: 'channels',
        on: <IconChannelsOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconChannelsOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconChannelsHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.CHANNEL,
    },
    {
        name: 'settings',
        on: <IconSettingsOn width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        off: <IconSettingsOff width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        hover: <IconSettingsHover width={menuIconHeightWidth} height={menuIconHeightWidth} />,
        nav: NAVIGATION_TYPE.SETTINGS,
    },
];

const Menu = (props: {
    isTabOn: string;
    hasMenuFocus: boolean;
    hasOpen?: (isOpen: boolean) => void;
    isTransparentGradient?: boolean;
    isOnboarding?: boolean;
}): JSX.Element => {
    const { isTabOn, hasMenuFocus, hasOpen, isTransparentGradient, isOnboarding } = props;
    const prefs = useAppPreferencesState();
    const { toggleModal } = useAppPreview();
    const navigation = useNavigation();
    const { appNavigationState } = useAppState();
    const { appTheme } = prefs;
    let { appColors } = appTheme(prefs);
    const { height } = Dimensions.get('window');
    const { appConfig } = prefs;
    const storefrontId = (appConfig && appConfig.storefrontId) || '';
    const { containers: tabContainers } = useFetchRootContainerQuery(storefrontId);
    const [menuFocus, setMenuFocus] = useState(false);
    const tvEventHandler = new TVEventHandler();
    const { strings } = useLocalization();

    useEffect(() => {
        tvEventHandler.enable(this, function(cmp, evt) {
            if (evt && (evt.eventType === 'right' || evt.eventType === 'swipeRight')) {
                setMenuFocus(false);
            }
        });
    }, [setMenuFocus, tvEventHandler]);

    useEffect(() => {
        const handleBackButtonPressAndroid = () => {
            if (!menuFocus) {
                setMenuFocus(true);
                // We have handled the back button
                // Return `true` to prevent react-navigation from handling it
                return true;
            } else {
                return false;
            }
        };

        const isAndroidTV = Platform.isTV && Platform.OS === 'android';
        if (isAndroidTV) {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressAndroid);
        }

        return () => {
            if (isAndroidTV) {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid);
            }
        };
    }, [menuFocus, setMenuFocus]);

    useEffect(() => {
        return () => {
            tvEventHandler.disable();
        };
    }, [tvEventHandler]);

    useEffect(() => {
        if (hasMenuFocus) {
            setMenuFocus(true);
        }
    }, [hasMenuFocus]);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    height: height,
                    flexDirection: 'column',
                    position: 'absolute',
                    left: -200,
                    transform: [{ translateX: 200 }],
                    flex: 1,
                    zIndex: 1,
                },
                iconsContainer: {
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    width: '100%',
                },
                iconsContainerFocused: {
                    width: '100%',
                },
                icon: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40,
                    marginVertical: appPadding.lg(),
                },
                creditsText: {
                    color: appColors.tertiary,
                    fontSize: tvPixelSizeForLayout(28),
                    fontFamily: appFonts.primary,
                    position: 'absolute',
                    marginLeft: tvPixelSizeForLayout(160),
                    marginTop: tvPixelSizeForLayout(56),
                },
                creditsTextFocus: {
                    color: appColors.primary,
                    fontSize: tvPixelSizeForLayout(28),
                    fontFamily: appFonts.primary,
                },
                headerLeftContainerStyle: {
                    paddingVertical: tvPixelSizeForLayout(30),
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    height: tvPixelSizeForLayout(140),
                    left: 0,
                },
                headerLeftContainerStyleFocus: {
                    backgroundColor: appColors.secondary,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const onCreditsPress = React.useCallback(() => {
        {
            if (appNavigationState !== 'PREVIEW_APP') {
                navigation.navigate(NAVIGATION_TYPE.CREDITS);
            } else {
                toggleModal();
            }
        }
    }, [appNavigationState, navigation, toggleModal]);
    const touchableFeedbacktRef = useRef(null);

    const onRef = useCallback(ref => {
        if (ref) {
            touchableFeedbacktRef.current = ref;
        }
    }, []);

    const colors = menuFocus
        ? [appColors.primary, appColors.primaryEnd]
        : isTransparentGradient
        ? ['transparent', 'transparent']
        : [appColors.primary, 'rgba(12, 16, 33, 0.8)', 'rgba(12, 16, 33, 0.5)', 'rgba(12, 16, 33, 0)'];

    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
    return (
        <TouchableWithoutFeedback
            ref={onRef}
            onFocus={() => {
                setMenuFocus(true);
                // setSearchInitailFocus(true);
            }}
            onBlur={() => {
                setMenuFocus(false);
                // setSearchInitailFocus(false);
            }}>
            <>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={colors}
                    style={[styles.container, { width: tvPixelSizeForLayout(480) }]}
                />
                <View
                    style={[
                        styles.container,
                        { width: menuFocus ? tvPixelSizeForLayout(480) : tvPixelSizeForLayout(160) },
                    ]}>
                    <TouchableHighlight
                        ref={onRef}
                        hasTVPreferredFocus={menuFocus && selectedIndex === 0}
                        underlayColor={menuFocus ? appColors.primaryVariant2 : 'transparent'}
                        nextFocusUp={findNodeHandle(touchableFeedbacktRef.current)}
                        onPress={() => onCreditsPress()}
                        onFocus={() => {
                            setSelectedIndex(0);
                        }}
                        isTVSelectable={menuFocus}>
                        <View
                            style={[
                                styles.headerLeftContainerStyle,
                                menuFocus && selectedIndex === 0 && styles.headerLeftContainerStyleFocus,
                            ]}>
                            {appNavigationState !== 'PREVIEW_APP' && !isOnboarding && (
                                <CreditsButton onPress={onCreditsPress} />
                            )}
                            {menuFocus && (
                                <Text style={[styles.creditsText, selectedIndex === 0 && styles.creditsTextFocus]}>
                                    {strings['tv.menu.add_credit']}
                                </Text>
                            )}
                        </View>
                    </TouchableHighlight>
                    <View style={[styles.iconsContainer, menuFocus && styles.iconsContainerFocused]}>
                        {tabContainers &&
                            tabContainers.length > 0 &&
                            MenuTabIcon.length > 0 &&
                            MenuTabIcon.map((item, index, { length }) => {
                                let tabData = item;
                                let tab = tabContainers.filter(
                                    t => t.name.toLocaleLowerCase() === item.name.toLocaleLowerCase(),
                                );
                                return (
                                    <MenuItem
                                        hasTVPreferredFocusSearch={menuFocus && index === 0}
                                        key={item.name}
                                        isTabOn={isTabOn}
                                        tabInfo={tab.length > 0 ? { ...tabData, ...tab[0] } : tabData}
                                        tabContainers={tabContainers}
                                        menuFocus={menuFocus}
                                        setMenuFocus={setMenuFocus}
                                        blockFocusDown={index === length - 1}
                                        onFocus={() => {
                                            setSelectedIndex(index + 1);
                                            hasOpen && hasOpen(true);
                                        }}
                                        onBlur={() => {
                                            hasOpen && hasOpen(false);
                                        }}
                                        isFocusedFlag={selectedIndex === index + 1}
                                    />
                                );
                            })}
                    </View>
                </View>
            </>
        </TouchableWithoutFeedback>
    );
};

export default Menu;
