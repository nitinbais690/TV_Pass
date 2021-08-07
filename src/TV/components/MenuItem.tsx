import React, { useRef, useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, findNodeHandle, TVEventHandler, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import { useLocalization } from '../../contexts/LocalizationContext';
interface TabMenuProps {
    name?: string;
    id?: string;
    on: any;
    off: any;
    hover: any;
    nav?: string;
    localizedName?: {
        en: string;
    };
}

const MenuItem = ({
    menuFocus,
    setMenuFocus,
    tabInfo,
    isTabOn,
    hasTVPreferredFocusSearch,
    blockFocusDown,
    isFocusedFlag,
    onFocus,
    onBlur,
}: {
    type: String;
    menuFocus: Boolean;
    setMenuFocus: any;
    tabInfo: TabMenuProps;
    tabContainers: Array<TabMenuProps>;
    isTabOn: string;
    hasTVPreferredFocusSearch: boolean;
    blockFocusDown: boolean;
    isFocusedFlag?: boolean;
    onFocus?(): void;
    onBlur?(): void;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    const route = useRoute();
    const navigation = useNavigation();
    const { appTheme } = prefs;
    let { appColors } = appTheme(prefs);
    const { strings } = useLocalization();

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                icon: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: tvPixelSizeForLayout(100),
                    paddingLeft: tvPixelSizeForLayout(55),
                },
                iconFocused: {
                    backgroundColor: appColors.secondary,
                },
                iconText: {
                    color: appColors.tertiary,
                    marginLeft: tvPixelSizeForLayout(55),
                    fontSize: tvPixelSizeForLayout(28),
                    fontFamily: appFonts.primary,
                },
                iconTextFocused: {
                    color: appColors.primary,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    // const myTVEventHandler = evt => {
    //     setLastEventType(evt.eventType);
    // };
    // const tvEventHandler = new TVEventHandler();

    //useTVEventHandler(myTVEventHandler);

    // useEffect(() => {
    //     tvEventHandler.enable(this, function(cmp, evt) {
    //         if (evt && (evt.eventType === 'right' || evt.eventType === 'swipeRight')) {
    //             setMenuFocus(false);
    //             setIsFocused(false);
    //         }
    //     });
    // }, [setMenuFocus, tvEventHandler]);

    // useEffect(() => {
    //     return () => {
    //         tvEventHandler.disable();
    //     };
    // }, [tvEventHandler]);

    const touchableHighlightRef = useRef(null);
    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    const [focusColor, setFocusColor] = useState(false);
    const tvEventHandler = new TVEventHandler();

    useEffect(() => {
        tvEventHandler.enable(this, function(cmp, evt) {
            if (evt && (evt.eventType === 'right' || evt.eventType === 'swipeRight')) {
                setFocusColor(false);
            }
        });
    }, [setMenuFocus, tvEventHandler]);

    useEffect(() => {
        let focusTimer: any = null;
        clearTimeout(focusTimer);
        focusTimer = setTimeout(
            () => {
                setFocusColor(true);
            },
            Platform.OS === 'ios' ? 1 : 400,
        );
        setFocusColor(false);
    }, [isFocusedFlag]);

    useEffect(() => {
        if (!menuFocus) {
            setFocusColor(false);
        }
    }, [menuFocus]);

    return (
        <TouchableHighlight
            ref={onRef}
            activeOpacity={1.0}
            hasTVPreferredFocus={hasTVPreferredFocusSearch}
            underlayColor={isFocusedFlag && focusColor ? appColors.primaryVariant2 : 'transparent'}
            nextFocusDown={blockFocusDown ? findNodeHandle(touchableHighlightRef.current) : null}
            onPress={() => {
                menuFocus = false;
                setMenuFocus(false);
                tabInfo.nav && tabInfo.id
                    ? navigation.navigate(tabInfo.nav, { tabId: tabInfo.id, tabName: tabInfo.name })
                    : navigation.navigate(tabInfo.nav);
            }}
            onFocus={() => {
                onFocus();
                setMenuFocus(true);
            }}
            onBlur={() => {
                onBlur();
            }}>
            <View style={[styles.icon, menuFocus && isFocusedFlag && focusColor ? styles.iconFocused : undefined]}>
                {isFocusedFlag && focusColor
                    ? tabInfo.hover
                    : route.name.toLowerCase() === tabInfo.name && !isFocusedFlag
                    ? tabInfo.on
                    : isTabOn === tabInfo.name
                    ? tabInfo.on
                    : tabInfo.off}
                {menuFocus && (
                    <Text style={[styles.iconText, isFocusedFlag && focusColor && styles.iconTextFocused]}>
                        {strings[`tv.menu.${tabInfo.name ? tabInfo.name.toLowerCase() : ''}`]}
                    </Text>
                )}
            </View>
        </TouchableHighlight>
    );
};

export default MenuItem;
