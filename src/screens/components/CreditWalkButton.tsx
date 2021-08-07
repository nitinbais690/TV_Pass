import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, Platform, TouchableHighlight, TouchableHighlightProps, Text, findNodeHandle } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';

interface CreditWalkThroughButtonProps extends TouchableHighlightProps {
    title?: string;
    blockFocusDown?: boolean;
    blockFocusUp?: boolean;
    blockFocusRight?: boolean;
    blockFocusLeft?: boolean;
    isHasFocused?: boolean;
    selected?: boolean;
}

const CreditWalkThroughButton = (props: CreditWalkThroughButtonProps) => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const [isFocussed, setIsFocussed] = useState<boolean>(props.selected ? props.selected : false);
    let focusedFlag = props.isHasFocused ? props.isHasFocused : isFocussed;

    const styles = StyleSheet.create({
        containerStyle: {
            width: '100%',
            height: Platform.isTV ? tvPixelSizeForLayout(80) : 54,
            borderRadius: Platform.isTV ? tvPixelSizeForLayout(400) : 27,
            // marginBottom: Platform.isTV ? tvPixelSizeForLayout(20) : 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: props.isHasFocused && Platform.isTV ? appColors.brandTint : appColors.primaryVariant1,
            borderColor: focusedFlag && Platform.isTV ? 'white' : undefined,
            borderWidth: focusedFlag && Platform.isTV ? tvPixelSizeForLayout(4) : undefined,
        },
        titleStyle: {
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.md,
            fontWeight: '500',
            color: focusedFlag && Platform.isTV ? 'white' : appColors.tertiary,
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

    useEffect(() => {
        if (props.selected) {
            findNodeHandle(touchableHighlightRef.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TouchableHighlight
            {...props}
            style={[styles.containerStyle]}
            underlayColor={appColors.brandTint}
            activeOpacity={1.0}
            onPress={props.onPress}
            tvParallaxProperties={props.tvParallaxProperties}
            ref={onRef}
            nextFocusUp={props.blockFocusUp ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusDown={props.blockFocusDown ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusLeft={props.blockFocusLeft ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusRight={props.blockFocusRight ? findNodeHandle(touchableHighlightRef.current) : null}
            onFocus={
                Platform.isTV
                    ? e => {
                          onButtonFocus();
                          if (props.onFocus) {
                              props.onFocus(e);
                          }
                      }
                    : undefined
            }
            onBlur={
                Platform.isTV
                    ? e => {
                          onButtonBlur();
                          if (props.onBlur) {
                              props.onBlur(e);
                          }
                      }
                    : undefined
            }
            accessibilityLabel={'Card View'}>
            <Text style={styles.titleStyle}>{props.title}</Text>
        </TouchableHighlight>
    );
};

export default CreditWalkThroughButton;
