import React, { useState, useCallback, useRef, RefObject } from 'react';
import {
    StyleSheet,
    Platform,
    TouchableHighlight,
    TouchableHighlightProps,
    Text,
    findNodeHandle,
    ActivityIndicator,
} from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';

interface FocusButtonProps extends TouchableHighlightProps {
    title?: string;
    blockFocusDown?: boolean;
    blockFocusUp?: boolean;
    blockFocusRight?: boolean;
    blockFocusLeft?: boolean;
    unFocusedColor?: string;
    height?: number;
    hasTVPreferredFocus?: boolean;
    disabled?: boolean;
    loading?: boolean;
    color?: string;
    isHasFocused?: boolean;
    widthTv?: number;
    containerStyle?: TouchableHighlightProps;
    unFocuseTitleColor?: string;
    focusRef: React.RefObject<TouchableHighlight>;
}

const FocusButton = (props: FocusButtonProps) => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    const {
        height,
        unFocusedColor,
        onBlur,
        onFocus,
        blockFocusDown,
        blockFocusUp,
        blockFocusRight,
        blockFocusLeft,
        title,
        tvParallaxProperties,
        hasTVPreferredFocus,
        onPress,
        disabled,
        loading,
        color,
        focusRef,
    } = props;
    let { containerStyle, unFocuseTitleColor } = props;
    let focusedFlag = props.isHasFocused ? props.isHasFocused : isFocussed;

    let unFocuseTitleTextColor: string = unFocuseTitleColor ? unFocuseTitleColor : appColors.tertiary;
    const styles = StyleSheet.create({
        containerStyle: {
            width: '100%',
            height: Platform.isTV ? tvPixelSizeForLayout(height ? height : 80) : 54,
            borderRadius: Platform.isTV ? tvPixelSizeForLayout(400) : 27,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: unFocusedColor ? unFocusedColor : appColors.primaryVariant1,
            borderColor: isFocussed && Platform.isTV ? 'white' : undefined,
            borderWidth: isFocussed && Platform.isTV ? tvPixelSizeForLayout(4) : undefined,
        },
        titleStyle: {
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.md,
            fontWeight: '500',
            color: focusedFlag && Platform.isTV ? 'white' : unFocuseTitleTextColor,
        },
    });

    const onButtonFocus = (): void => {
        setIsFocussed(true);
    };
    const onButtonBlur = (): void => {
        setIsFocussed(false);
    };
    const touchableHighlightRef = useRef(null);
    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    return (
        <TouchableHighlight
            {...props}
            style={[styles.containerStyle, containerStyle && containerStyle]}
            underlayColor={appColors.brandTint}
            activeOpacity={1.0}
            onPress={onPress}
            disabled={disabled}
            hasTVPreferredFocus={hasTVPreferredFocus}
            tvParallaxProperties={tvParallaxProperties}
            ref={focusRef ? focusRef : onRef}
            nextFocusUp={
                blockFocusUp
                    ? focusRef
                        ? findNodeHandle(focusRef.current)
                        : findNodeHandle(touchableHighlightRef.current)
                    : null
            }
            nextFocusDown={
                blockFocusDown
                    ? focusRef
                        ? findNodeHandle(focusRef.current)
                        : findNodeHandle(touchableHighlightRef.current)
                    : null
            }
            nextFocusLeft={
                blockFocusLeft
                    ? focusRef
                        ? findNodeHandle(focusRef.current)
                        : findNodeHandle(touchableHighlightRef.current)
                    : null
            }
            nextFocusRight={
                blockFocusRight
                    ? focusRef
                        ? findNodeHandle(focusRef.current)
                        : findNodeHandle(touchableHighlightRef.current)
                    : null
            }
            onFocus={
                Platform.isTV
                    ? e => {
                          onButtonFocus();
                          if (onFocus) {
                              onFocus(e);
                          }
                      }
                    : undefined
            }
            onBlur={
                Platform.isTV
                    ? e => {
                          onButtonBlur();
                          if (onBlur) {
                              onBlur(e);
                          }
                      }
                    : undefined
            }
            accessibilityLabel={'Card View'}>
            {loading ? (
                <ActivityIndicator size={'small'} color={color ? color : appColors.secondary} />
            ) : (
                <Text style={styles.titleStyle}>{title}</Text>
            )}
        </TouchableHighlight>
    );
};

export default FocusButton;
