import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableHighlight, View, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import CreditsIcon from '../../../assets/images/credits.svg';
import Ticker from 'react-native-ticker';

export interface BorderButtonOptions {
    title: string;
    onPress?: () => void;
    type?: string;
    hasTVPreferredFocus?: boolean;
    cancelFlag?: boolean;
}

const BorderButton = (props: BorderButtonOptions): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    const onCardFocus = (): void => {
        setIsFocussed(true);
    };
    const onCardBlur = (): void => {
        setIsFocussed(false);
    };
    const styles = StyleSheet.create({
        onFocusStyle: {
            backgroundColor: appColors.brandTint,
            borderColor: appColors.secondary,
            borderWidth: tvPixelSizeForLayout(4),
        },
        onFocuscancelBtnStyle: {
            backgroundColor: appColors.primaryVariant1,
            borderColor: appColors.secondary,
            borderWidth: tvPixelSizeForLayout(4),
        },
        button: {
            backgroundColor: appColors.primaryVariant1,
            borderColor: 'transparent',
            borderWidth: tvPixelSizeForLayout(4),
            marginTop: tvPixelSizeForLayout(70),
            borderRadius: tvPixelSizeForLayout(400),
            justifyContent: 'center',
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            height: Platform.isTV ? tvPixelSizeForLayout(80) : 55,
            marginRight: tvPixelSizeForLayout(40),
            overflow: 'hidden',
        },
        textWrapperStyle: {
            flexDirection: 'row',
            flex: 1,
            borderRadius: tvPixelSizeForLayout(400),
            alignItems: 'center',
        },
        textStyle: {
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: props.type === 'purchase' ? tvPixelSizeForLayout(10) : undefined,
        },
        textCreditsWrapperStyle: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 0,
            marginHorizontal: tvPixelSizeForLayout(100),
        },
        pillWrapper: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tickerWrapper: { marginHorizontal: 5 },
        tickerText: {
            textAlign: 'center',
            fontSize: tvPixelSizeForLayout(28),
            color: appColors.secondary,
            fontWeight: '500',
        },
        creditButton: {
            backgroundColor: appColors.brandTint,
            marginTop: tvPixelSizeForLayout(30),
            justifyContent: 'center',
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            height: tvPixelSizeForLayout(80),
            borderTopRightRadius: tvPixelSizeForLayout(110),
            borderBottomRightRadius: tvPixelSizeForLayout(110),
            paddingHorizontal: tvPixelSizeForLayout(26),
        },
        textWrapper: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            paddingHorizontal: 12,
        },
        tvButtunWidth: {
            width: tvPixelSizeForLayout(452),
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <>
            {props.type === 'credit' ? (
                <TouchableHighlight
                    hasTVPreferredFocus={props.hasTVPreferredFocus}
                    style={styles.creditButton}
                    underlayColor={appColors.brandTint}
                    {...props}>
                    <View style={styles.textWrapper}>
                        <View style={styles.pillWrapper}>
                            <CreditsIcon width={tvPixelSizeForLayout(24)} height={tvPixelSizeForLayout(24)} />
                            <View style={styles.tickerWrapper}>
                                <Ticker textStyle={styles.tickerText}>{props.title}</Ticker>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            ) : (
                <TouchableHighlight
                    underlayColor={props.cancelFlag ? appColors.primaryVariant1 : appColors.brandTint}
                    hasTVPreferredFocus={props.hasTVPreferredFocus ? props.hasTVPreferredFocus : true}
                    style={[
                        styles.button,
                        Platform.isTV && styles.tvButtunWidth,
                        isFocussed
                            ? props.cancelFlag
                                ? styles.onFocuscancelBtnStyle
                                : styles.onFocusStyle
                            : undefined,
                    ]}
                    onFocus={Platform.isTV ? onCardFocus : undefined}
                    onBlur={Platform.isTV ? onCardBlur : undefined}
                    {...props}>
                    {props.type === 'purchase' ? (
                        <View style={styles.textCreditsWrapperStyle}>
                            <CreditsIcon width={tvPixelSizeForLayout(35)} height={tvPixelSizeForLayout(35)} />
                            <Text style={styles.textStyle}>{props.title}</Text>
                        </View>
                    ) : (
                        <View style={[styles.textWrapperStyle]}>
                            <Text style={styles.textStyle}>{props.title}</Text>
                        </View>
                    )}
                </TouchableHighlight>
            )}
        </>
    );
};

export default BorderButton;
