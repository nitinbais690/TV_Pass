import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Text, Animated, Easing, Dimensions, Platform } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDimensions } from '@react-native-community/hooks';
import { BorderlessButton } from 'react-native-gesture-handler';
import { AspectRatio, ImageType, selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import CloseIcon from '../../../assets/images/close.svg';
import { appFonts, appPadding, tvPixelSizeForLayout } from '../../../AppStyles';
import { CreditsButton } from '../../screens/components/CreditsButton';
import { NAVIGATION_TYPE } from '../../screens/Navigation/NavigationConstants';
import { useTVODEntitlement } from 'screens/hooks/useTVODEntitlement';
import { PlayerProps } from 'screens/hooks/usePlayerConfig';
import { useUpNextRecommendations } from 'screens/hooks/useUpNextRecommendations';
import { ResizableImage, ResourceVm } from 'qp-discovery-ui';
import AppLoadingIndicator from '../../screens/components/AppLoadingIndicator';
import { useCredits } from 'utils/CreditsContextProvider';
import {defaultContentDetailsStyle, imageAspectRatio} from '../../styles/ContentDetails.style';
import RadialGradient from 'react-native-radial-gradient';
import { resourceMetadata } from '../../screens/DetailsScreen';
import { PlayButton } from '../../screens/components/PlayButton';
import { RedeemButton, RedeemState } from '../../screens/components/RedeemButton';

export interface UpNextOverlayProps {
    resource: ResourceVm;
    onUpNextSelected: (props: PlayerProps) => void;
    onOverlayClose: () => void;
}

export type UpNextOverlayActions = {
    show: () => void;
    hide: () => void;
};

const UpNextTV = React.forwardRef<UpNextOverlayActions, UpNextOverlayProps>(
    ({ resource, onUpNextSelected, onOverlayClose, setResource, setTvodToken }, ref) => {
        const navigation = useNavigation();
        const { credits } = useCredits();
        const prefs = useAppPreferencesState();
        const insets = useSafeArea();
        const { Alert } = useAlert();
        const { strings, appLanguage } = useLocalization();
        const [shown, setShown] = useState<boolean>(false);
        const selectedItem = useRef<ResourceVm | undefined>(undefined);
        const { width, height } = useDimensions().window;
        const { upNext } = useUpNextRecommendations(resource);
        const top = useRef(new Animated.Value(shown ? 0 : height)).current;
        const opacity = useRef(new Animated.Value(shown ? 1 : 0)).current;
        let { appColors } = prefs.appTheme!(prefs);
        const caption1String = resourceMetadata(appLanguage, upNext);
        const isMounted = useRef(true);
        const [isFocusTopButton, setFocusTopButton] = useState(true);

        useEffect(() => {
            isMounted.current = true;
            setFocusTopButton(true);
            return () => {
                isMounted.current = false;
                setFocusTopButton(false);
            };
        }, []);

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

        const {
            loading: entitlementLoading,
            entitlement,
            redeem,
            error: redeemError,
            tvodToken,
        } = useTVODEntitlement();

        const stylesPlayButton = defaultContentDetailsStyle({ appColors, appPadding, false, insets, entitlement, false });

        const styles = StyleSheet.create({
            content: {
                width: '100%',
                height: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            infoContainer: {
                height: '100%',
                width: '100%',
                zIndex: 20,
                backgroundColor: 'rgba(0,0,0,0.4)',
            },
            infoTextContainer: {
                padding: appPadding.md(),
                width: '50%',
                height: '100%',
                justifyContent: 'center',
            },
            bottomContainer: {
                overflow: 'hidden',
                width: '100%',
                height: '60%',
                zIndex: 10,
                alignSelf: 'flex-end',
            },
            imageStyle: {
                flex: 1,
                position: 'absolute',
                height: '100%',
                width: '100%',
                aspectRatio: AspectRatio._16by9,
                zIndex: -1,
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
            gradient: {
                position: 'absolute',
            },
            infoContainerStyle: {
                flex: 0.8,
                flexDirection: 'column',
                flexWrap: 'wrap',
                marginTop: 5,
                marginBottom: appPadding.xs(),
            },
            titleContainerStyle: {
                marginVertical: tvPixelSizeForLayout(10),
            },
            headerLogoContainerStyle: {
                marginTop: appPadding.xs(true),
            },
            seriesTitleStyle: {
                fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
                fontFamily: appFonts.primary,
                color: appColors.brandTint,
                marginVertical: Platform.isTV ? tvPixelSizeForLayout(15) : 5,
                marginBottom: 0,
            },
            titleStyle: {
                fontSize: Platform.isTV ? tvPixelSizeForLayout(75) : appFonts.xxxlg,
                fontFamily: appFonts.bold,
                color: appColors.secondary,
                marginBottom: -5,
            },
            infoTextStyle: {
                fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.xs,
                fontFamily: appFonts.primary,
                color: appColors.secondary,
            },
            caption1: {
                fontSize: Platform.isTV ? tvPixelSizeForLayout(24) : appFonts.xxs,
                fontFamily: appFonts.primary,
                color: Platform.isTV ? appColors.tertiary : appColors.caption,
                textTransform: 'none',
            },
            playButton: {
                justifyContent: 'center',
                alignItems: 'center',
                ...StyleSheet.absoluteFillObject,
            },
            playButtonLoading: {
                position: 'absolute',
                backgroundColor: appColors.brandTint,
                width: 45,
                aspectRatio: 1,
                borderRadius: 50,
            },
            subscribeButton: {
                marginVertical: appPadding.xs(true),
            },
            redeemButtonContainer: {
                marginTop: tvPixelSizeForLayout(50),
                flexDirection: 'row',
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

        const onResourcePress = (res: ResourceVm) => {
            // if user has no remaining credits or not enough credits, open credits screen
            if (res.credits && credits && res.credits > credits && res.expiresIn === undefined) {
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

        return (
            <Animated.View style={[StyleSheet.absoluteFillObject, styles.content, { top }]} ref={viewRef}>
                <BorderlessButton style={StyleSheet.absoluteFillObject} onPress={onClose} />
                <View style={styles.creditsButton}>
                    <CreditsButton onPress={() => navigation.navigate(NAVIGATION_TYPE.CREDITS)} />
                </View>
                <View style={styles.bottomContainer}>
                    {upNext && (
                        <View style={styles.infoContainer}>
                            <View style={styles.infoTextContainer}>
                                <Text style={[styles.seriesTitleStyle]}>{strings['tv.up_next.watch']}</Text>
                                <Text style={[styles.titleStyle]}>{upNext && upNext.title}</Text>
                                <View style={styles.titleContainerStyle}>
                                    <Text style={[styles.caption1]}>{caption1String}</Text>
                                </View>
                                <Text numberOfLines={3} ellipsizeMode={'tail'} style={[styles.infoTextStyle]}>
                                    {upNext && upNext.longDescription
                                        ? upNext.longDescription
                                        : upNext.shortDescription}
                                </Text>
                                <View style={styles.redeemButtonContainer}>
                                    {entitlement && (
                                        <PlayButton
                                            styles={stylesPlayButton}
                                            isFocusTopButton={isFocusTopButton}
                                            playAvailable={true}
                                            onPress={() => onResourcePress(upNext)}
                                            appColors={appColors}
                                        />
                                    )}
                                    <RedeemButton
                                        asset={upNext}
                                        entitlement={entitlement}
                                        loading={entitlementLoading}
                                        // onHandleBlur={undefined}
                                        hasTVPreferredFocus={Platform.isTV ? isFocusTopButton : undefined}
                                        onPress={(purchaseState: RedeemState) => {
                                            switch (purchaseState) {
                                                case RedeemState.NotEntitled_NoCredit:
                                                    navigation.navigate(NAVIGATION_TYPE.CREDITS);
                                                    break;
                                                case RedeemState.NotEntitled:
                                                    redeem(resource);
                                                    break;
                                                case RedeemState.Entitled:
                                                    console.log('Play');
                                                    break;
                                                default:
                                                    console.log('Do nothing');
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    <RadialGradient
                        style={[styles.gradient, { width: width, height: height }]}
                        colors={[
                            'rgba(104, 110, 255, 1)',
                            'rgba(104, 110, 255, 1)',
                            'rgba(104, 110, 255, 0.8)',
                            'rgba(12,16,33, 0)',
                        ]}
                        stops={[0, 0.3, 0.7]}
                        center={[100, 600]}
                        radius={width / 1.3}
                    />
                    {upNext && (
                        <ResizableImage
                            keyId={upNext.id}
                            style={styles.imageStyle}
                            imageType={ImageType.Poster}
                            aspectRatioKey={imageAspectRatio}
                            isPortrait={false}
                            resizeMode={'cover'}
                        />
                    )}
                </View>
                {/*{upNext && (*/}
                {/*    <View style={styles.cardWrapper}>*/}
                {/*        <ResizableImage*/}
                {/*            keyId={upNext.id}*/}
                {/*            style={styles.imageStyle}*/}
                {/*            imageType={ImageType.Poster}*/}
                {/*            aspectRatioKey={imageAspectRatio}*/}
                {/*            isPortrait={false}*/}
                {/*        />*/}
                {/*        <Text style={styles.title}>{strings['recommendations.up_next']}</Text>*/}
                {/*        <StorefrontCardView*/}
                {/*            resource={upNext}*/}
                {/*            onResourcePress={onResourcePress}*/}
                {/*            isPortrait={isPortrait}*/}
                {/*            cardsPreview={cardsPreview}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*)}*/}
                {/*{somethingNew && (*/}
                {/*    <View style={styles.cardWrapper}>*/}
                {/*        <Text style={styles.title}>{strings['recommendations.something_new']}</Text>*/}
                {/*        <StorefrontCardView*/}
                {/*            resource={somethingNew}*/}
                {/*            onResourcePress={onResourcePress}*/}
                {/*            isPortrait={isPortrait}*/}
                {/*            cardsPreview={cardsPreview}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*)}*/}
                {entitlementLoading && (
                    <View style={styles.loader}>
                        <AppLoadingIndicator />
                    </View>
                )}
                {/*<View style={styles.close}>*/}
                {/*    <BorderlessButton onPress={onClose}>*/}
                {/*        <CloseIcon />*/}
                {/*    </BorderlessButton>*/}
                {/*</View>*/}
            </Animated.View>
        );
    },
);

export default UpNextTV;
