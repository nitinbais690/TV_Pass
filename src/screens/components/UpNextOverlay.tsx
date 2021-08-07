import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDimensions } from '@react-native-community/hooks';
import { BorderlessButton } from 'react-native-gesture-handler';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import StorefrontCardView from './StorefrontCardView';
import CloseIcon from '../../../assets/images/close.svg';
import { appFonts } from '../../../AppStyles';
import { CreditsButton } from './CreditsButton';
import { NAVIGATION_TYPE } from '../Navigation/NavigationConstants';
import { useTVODEntitlement } from 'screens/hooks/useTVODEntitlement';
import { PlayerProps } from 'screens/hooks/usePlayerConfig';
import { useUpNextRecommendations } from 'screens/hooks/useUpNextRecommendations';
import { ResourceVm } from 'qp-discovery-ui';
import AppLoadingIndicator from './AppLoadingIndicator';
import { useCredits } from 'utils/CreditsContextProvider';

export interface UpNextOverlayProps {
    resource: ResourceVm;
    onUpNextSelected: (props: PlayerProps) => void;
    onOverlayClose: () => void;
}

export type UpNextOverlayActions = {
    show: () => void;
    hide: () => void;
};

const UpNextOverlay = React.forwardRef<UpNextOverlayActions, UpNextOverlayProps>(
    ({ resource, onUpNextSelected, onOverlayClose }, ref) => {
        const navigation = useNavigation();
        const { credits, fetchCredits } = useCredits();
        const currentCredits = useRef<number | null>(credits);
        const prefs = useAppPreferencesState();
        const insets = useSafeArea();
        const { Alert } = useAlert();
        const { strings } = useLocalization();
        const [shown, setShown] = useState<boolean>(false);
        const selectedItem = useRef<ResourceVm | undefined>(undefined);
        const { width, height } = useDimensions().window;
        const { upNext, somethingNew } = useUpNextRecommendations(resource);
        const top = useRef(new Animated.Value(shown ? 0 : height)).current;
        const opacity = useRef(new Animated.Value(shown ? 1 : 0)).current;
        let { appColors } = prefs.appTheme!(prefs);
        const isPortrait = height > width;

        const showOverlay = () => {
            console.debug('[UpNextOverlay] show overlay');
            Animated.parallel([
                Animated.timing(top, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                    easing: Easing.inOut(Easing.quad),
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                    easing: Easing.inOut(Easing.quad),
                }),
            ]).start(() => setShown(true));
        };

        const hideOverlay = () => {
            console.debug('[UpNextOverlay] hide overlay');
            Animated.parallel([
                Animated.timing(top, {
                    toValue: height,
                    duration: 300,
                    useNativeDriver: false,
                    easing: Easing.inOut(Easing.quad),
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                    easing: Easing.inOut(Easing.quad),
                }),
            ]).start(() => setShown(true));
        };

        const viewRef = useRef<View>(null);
        useImperativeHandle(ref, () => ({
            show: () => {
                showOverlay();
            },
            hide: () => {
                hideOverlay();
            },
        }));

        const { loading: isRedeeming, redeem, error: redeemError, tvodToken } = useTVODEntitlement();

        const styles = StyleSheet.create({
            content: {
                width: '100%',
                height: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            cardWrapper: {
                alignItems: 'center',
                justifyContent: 'center',
            },
            close: {
                position: 'absolute',
                top: insets.top + 20,
                right: insets.right ? insets.right : 20,
            },
            creditsButton: {
                position: 'absolute',
                top: 22,
                left: 0,
            },
            title: {
                color: appColors.secondary,
                fontSize: appFonts.md,
                fontFamily: appFonts.primary,
                fontWeight: '600',
                marginBottom: 10,
            },
            loader: {
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                alignItems: 'center',
                justifyContent: 'center',
            },
        });

        useEffect(() => {
            if (selectedItem.current && tvodToken) {
                onUpNextSelected({
                    resource: selectedItem.current,
                    tvodToken: tvodToken,
                });
                // selectedItem.current = undefined;
            } else if (redeemError) {
                const title = strings['redeem.error.' + redeemError.errorCode];
                const fallbackTitle = strings['global.general_error_msg'];
                let msg;
                if (redeemError.errorCode) {
                    msg = strings.formatString(strings['global.error_code'], redeemError.errorCode) as string;
                }
                Alert.alert(title ? title : fallbackTitle, msg, [
                    {
                        text: strings['redeem.okay_btn'],
                        onPress: () => {},
                    },
                ]);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [tvodToken, redeemError]);

        useEffect(() => {
            fetchCredits().then(() => {
                currentCredits.current = credits;
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [credits]);

        const onResourcePress = (res: ResourceVm) => {
            // if user has no remaining credits or not enough credits, open credits screen
            if (
                res.credits &&
                currentCredits.current !== null &&
                res.credits > currentCredits.current &&
                res.expiresIn === undefined
            ) {
                navigation.navigate(NAVIGATION_TYPE.CREDITS);
                return;
            }

            if (res.expiresIn === undefined) {
                selectedItem.current = res;
                redeem(res);
            } else {
                onUpNextSelected({
                    resource: res,
                    tvodToken: '',
                });
            }
        };

        const onClose = () => {
            hideOverlay();
            onOverlayClose();
        };

        const cardsPreview = selectDeviceType({ Tablet: isPortrait ? 4.2 : 4 }, 3.2);

        return (
            <Animated.View style={[StyleSheet.absoluteFillObject, styles.content, { top }]} ref={viewRef}>
                <BorderlessButton style={StyleSheet.absoluteFillObject} onPress={onClose} />
                <View style={styles.creditsButton}>
                    <CreditsButton onPress={() => navigation.navigate(NAVIGATION_TYPE.CREDITS)} />
                </View>
                {upNext && (
                    <View style={styles.cardWrapper}>
                        <Text style={styles.title}>{strings['recommendations.up_next']}</Text>
                        <StorefrontCardView
                            resource={upNext}
                            onResourcePress={onResourcePress}
                            isPortrait={isPortrait}
                            cardsPreview={cardsPreview}
                        />
                    </View>
                )}
                {somethingNew && (
                    <View style={styles.cardWrapper}>
                        <Text style={styles.title}>{strings['recommendations.something_new']}</Text>
                        <StorefrontCardView
                            resource={somethingNew}
                            onResourcePress={onResourcePress}
                            isPortrait={isPortrait}
                            cardsPreview={cardsPreview}
                        />
                    </View>
                )}
                {isRedeeming && (
                    <View style={styles.loader}>
                        <AppLoadingIndicator />
                    </View>
                )}
                <View style={styles.close}>
                    <BorderlessButton onPress={onClose}>
                        <CloseIcon accessible accessibilityLabel={'Close'} />
                    </BorderlessButton>
                </View>
            </Animated.View>
        );
    },
);

export default UpNextOverlay;
