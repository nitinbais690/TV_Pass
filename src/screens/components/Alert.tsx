import React from 'react';
import { View, StyleSheet, Text, AlertButton, AlertOptions, Platform } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { selectDeviceType } from 'qp-common-ui';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import Button, { ButtonType } from 'screens/components/Button';
import BackgroundGradient from './BackgroundGradient';
import BorderButton from './BorderButton';
import { RedeemButtonProps } from './RedeemButton';

export interface AlertProps {
    title: string;
    message?: string;
    buttons?: AlertButton[];
    options?: AlertOptions;
    onClose?: () => void;
    subTitle?: string;
    type?: RedeemButtonProps;
}

const Alert = ({ title, message, buttons, onClose, subTitle, type }: AlertProps) => {
    const prefs = useAppPreferencesState();
    const { width, height } = useDimensions().window;
    let { appColors } = prefs.appTheme!(prefs);
    const isPortrait = height > width;

    const styles = StyleSheet.create({
        content: {
            flex: Platform.isTV ? 1 : undefined,
            borderRadius: Platform.isTV ? 0 : 22,
            opacity: Platform.isTV && type ? 0.9 : 1,
        },
        innerContent: {
            justifyContent: 'center',
            borderRadius: Platform.isTV ? 0 : 22,
            marginHorizontal: Platform.isTV
                ? 0
                : selectDeviceType({ Tablet: isPortrait ? '20%' : '30%' }, isPortrait ? '0%' : '25%'),
            padding: selectDeviceType({ Tv: tvPixelSizeForLayout(160) }, 40),
            paddingTop: Platform.isTV ? 0 : undefined,
        },
        title: {
            color: appColors.secondary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(75) : appFonts.md,
            fontFamily: appFonts.primary,
            fontWeight: '600',
            lineHeight: Platform.isTV ? tvPixelSizeForLayout(95) : undefined,
        },
        subTitle: {
            color: appColors.secondary,
            fontSize: Platform.isTV ? (type ? tvPixelSizeForLayout(45) : tvPixelSizeForLayout(32)) : appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            paddingTop: selectDeviceType({ Tv: tvPixelSizeForLayout(40) }, 20),
            lineHeight: Platform.isTV ? tvPixelSizeForLayout(40) : undefined,
        },
        message: {
            color: Platform.isTV ? appColors.secondary : appColors.caption,
            fontSize: Platform.isTV ? (type ? tvPixelSizeForLayout(45) : tvPixelSizeForLayout(32)) : appFonts.xs,
            fontFamily: Platform.isTV ? appFonts.light : appFonts.primary,
            fontWeight: '500',
            marginTop: Platform.isTV ? tvPixelSizeForLayout(12) : 20,
            lineHeight: Platform.isTV ? tvPixelSizeForLayout(40) : undefined,
        },
        ctaContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        button: {
            marginTop: 20,
            width: '100%',
        },
        textContainer: {
            width: tvPixelSizeForLayout(782),
        },
        subContainer: {
            justifyContent: 'space-evenly',
            height: height,
        },
        redeemContainer: {
            width: '20%',
            marginTop: 25,
        },
    });

    let showMessage = false;
    if (message && message.length > 0) {
        showMessage = true;
    }

    const onPress = (button: AlertButton) => {
        if (button.onPress) {
            button.onPress();
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <BackgroundGradient style={styles.content} childContainerStyle={{ width: '100%' }}>
            {Platform.isTV && type && <BorderButton title={type.credits} type="credit" onPress={type.onPress} />}

            <View style={[Platform.isTV ? styles.subContainer : undefined]}>
                <View style={[styles.innerContent]}>
                    <View style={[Platform.isTV ? styles.textContainer : undefined]}>
                        {title.length > 0 && <Text style={styles.title}>{title}</Text>}
                        {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
                        {showMessage && <Text style={styles.message}>{message}</Text>}
                    </View>
                    <View style={[Platform.isTV ? styles.ctaContainer : undefined]}>
                        {buttons &&
                            buttons.map((button, i) => {
                                return Platform.isTV ? (
                                    <BorderButton
                                        title={button.text}
                                        hasTVPreferredFocus={i === 0 ? true : false}
                                        type={button.type ? 'purchase' : undefined}
                                        cancelFlag={button.style}
                                        onPress={() => onPress(button)}
                                    />
                                ) : (
                                    <Button
                                        key={i}
                                        title={button.text}
                                        raised={false}
                                        containerStyle={[styles.button]}
                                        buttonType={
                                            button.style === 'cancel'
                                                ? ButtonType.CancelButton
                                                : ButtonType.RegularButton
                                        }
                                        onPress={() => onPress(button)}
                                    />
                                );
                            })}
                    </View>
                </View>
            </View>
        </BackgroundGradient>
    );
};

export default Alert;
