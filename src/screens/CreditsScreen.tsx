import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    Animated,
    InteractionManager,
    StyleSheet,
    LayoutAnimation,
    Easing,
    Platform,
    TouchableHighlight,
    findNodeHandle,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import LinearGradient from 'react-native-linear-gradient';
import { BorderlessButton } from 'react-native-gesture-handler';
import Ticker from 'react-native-ticker';
import { useDimensions } from '@react-native-community/hooks';
import { AspectRatio, ImageType, selectDeviceType } from 'qp-common-ui';
import { ResizableImage } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useIAPProducts } from 'contexts/IAPProductsContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useIAPState } from 'utils/IAPContextProvider';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject, condenseTopUpData } from 'utils/ReportingUtils';
import { ProductsResponseMessage } from './hooks/useGetProducts';
import CreditLoading from 'screens/components/CreditLoading';
import ModalOverlay from './components/ModalOverlay';
import CreditsIcon from '../../assets/images/credits_large.svg';
import CloseIcon from '../../assets/images/close.svg';
import { creditsTopUpPageStyles, topUpProductStyle } from '../styles/CreditsTopUp.style';
import { tvPixelSizeForLayout } from '../../AppStyles';
import FocusButton from './components/FocusButton';
import NodeHandle from '../utils/NodeHandle';

const TopUpProduct = ({
    product,
    index,
    onPress,
    purchaseInProgress,
    purchasingProduct,
    isFocusedFlag,
    onFocus,
    blockFocusLeft,
    blockFocusRight,
    nextFocusDown,
}: {
    product: ProductsResponseMessage;
    index: number;
    onPress?(): void;
    purchaseInProgress?: boolean;
    purchasingProduct?: boolean;
    isFocusedFlag?: boolean;
    onFocus?(): void;
    blockFocusLeft?: boolean;
    blockFocusRight?: boolean;
    nextFocusDown: any;
}) => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const { strings } = useLocalization();
    const { width, height } = useDimensions().window;
    const isPortrait = height > width;

    const productsStyle = topUpProductStyle({ appColors });
    const imageAttribute = product.attributes && product.attributes.filter(a => a.attributeName === 'imageUrl').shift();
    const imageUrl = imageAttribute && imageAttribute.attributeValue;
    const animatedValue = useRef<Animated.Value>(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            delay: 0,
            toValue: purchaseInProgress ? 0.2 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [animatedValue, purchaseInProgress]);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [purchasingProduct]);

    const [isPressed, setIsPressed] = useState<boolean>(false);

    const touchableHighlightRef = useRef(null);
    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    return Platform.isTV ? (
        <TouchableHighlight
            ref={onRef}
            hasTVPreferredFocus={index === 0}
            style={[
                productsStyle.creditCardView,
                isFocusedFlag ? productsStyle.containerShadowTv : undefined,
                isPressed && isFocusedFlag ? productsStyle.containerPressShadowTv : undefined,
            ]}
            nextFocusLeft={blockFocusLeft ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusRight={blockFocusRight ? findNodeHandle(touchableHighlightRef.current) : null}
            nextFocusDown={nextFocusDown}
            nextFocusUp={findNodeHandle(touchableHighlightRef.current)}
            onPress={() => {
                onPress();
                setIsPressed(true);
            }}
            underlayColor={'transparent'}
            onFocus={() => {
                onFocus();
                setIsPressed(!!isFocusedFlag);
            }}
            onBlur={() => {
                isPressed && setIsPressed(isFocusedFlag);
            }}
            disabled={purchaseInProgress}>
            <Animated.View
                style={[
                    productsStyle.containerTv,
                    purchaseInProgress && !purchasingProduct ? { opacity: animatedValue } : {},
                    !isPressed && isFocusedFlag ? productsStyle.focusContainerTv : undefined,
                    isPressed && isFocusedFlag ? productsStyle.onPressedStyle : productsStyle.onBlurStyle,
                ]}>
                <View style={StyleSheet.absoluteFill}>
                    {imageUrl && (
                        <ResizableImage
                            isPortrait={isPortrait}
                            style={productsStyle.backgroundImageStyle}
                            keyId={product.displayName}
                            imageType={ImageType.Poster}
                            aspectRatioKey={AspectRatio._16by9}
                            source={{ uri: imageUrl }}
                        />
                    )}
                </View>
                <LinearGradient
                    useAngle={true}
                    angle={90}
                    colors={[appColors.primaryEnd, appColors.primaryVariant6]}
                    style={[StyleSheet.absoluteFill]}
                />
                <LinearGradient
                    useAngle={true}
                    angle={45}
                    colors={[appColors.brandTint, 'transparent', 'transparent']}
                    locations={[0, 0.7, 0.8]}
                    style={[StyleSheet.absoluteFill, { opacity: index * 0.7 }]}
                />
                <View style={productsStyle.logoContainer}>
                    <View style={productsStyle.logo}>
                        <CreditsIcon width={tvPixelSizeForLayout(96)} height={tvPixelSizeForLayout(96)} />
                    </View>
                </View>
                <View style={productsStyle.detailsContainer}>
                    <Text style={productsStyle.title}>
                        {strings.formatString(strings['credits.product.title'], product.creditPoints)}
                    </Text>
                    <Text style={productsStyle.description}>{product.currencySymbol + product.retailPrice}</Text>
                    <Text style={productsStyle.caption}>{strings['credits.product.caption']}</Text>
                </View>

                {purchasingProduct && (
                    <Animated.View style={productsStyle.loadingWrapper}>
                        <CreditLoading color={appColors.brandTint} style={productsStyle.creditsLoadingStyle} />
                    </Animated.View>
                )}
            </Animated.View>
        </TouchableHighlight>
    ) : (
        <BorderlessButton onPress={onPress} enabled={!purchaseInProgress}>
            <Animated.View
                style={[
                    productsStyle.container,
                    purchaseInProgress && !purchasingProduct ? { opacity: animatedValue } : {},
                ]}>
                <View style={StyleSheet.absoluteFill}>
                    {imageUrl && (
                        <ResizableImage
                            isPortrait={isPortrait}
                            style={productsStyle.backgroundImageStyle}
                            keyId={product.displayName}
                            imageType={ImageType.Poster}
                            aspectRatioKey={AspectRatio._16by9}
                            source={{ uri: imageUrl }}
                        />
                    )}
                </View>
                <LinearGradient
                    useAngle={true}
                    angle={-270}
                    colors={['transparent', appColors.primaryEnd, appColors.primaryVariant6]}
                    style={[StyleSheet.absoluteFill]}
                />
                <View style={[productsStyle.glow, { shadowOpacity: index * 0.35 }]} />
                <View style={productsStyle.logoContainer}>
                    <View style={productsStyle.logo}>
                        <CreditsIcon width={50} height={50} />
                    </View>
                </View>
                <View style={productsStyle.detailsContainer}>
                    <Text style={productsStyle.title}>
                        {strings.formatString(strings['credits.product.title'], product.creditPoints)}
                    </Text>
                    <View style={productsStyle.descriptionContainer}>
                        <Text style={productsStyle.description}>{product.currencySymbol + product.retailPrice}</Text>
                        <Text style={productsStyle.caption}>{strings['credits.product.caption']}</Text>
                    </View>
                </View>
                {purchasingProduct && (
                    <Animated.View style={productsStyle.loadingWrapper}>
                        <CreditLoading color={appColors.brandTint} style={productsStyle.creditsLoadingStyle} />
                    </Animated.View>
                )}
            </Animated.View>
        </BorderlessButton>
    );
};

const CreditsScreen = ({ navigation }: { navigation: any }): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const isMounted = useRef(true);
    const insets = useSafeArea();
    const { Alert } = useAlert();
    const { strings } = useLocalization();
    const { credits, fetchCredits } = useCredits();
    const {
        loading: purchaseInProgress,
        purchaseProduct,
        transactionSuccess,
        errorObject,
        resetTransaction,
    } = useIAPState();
    const { topups: products } = useIAPProducts();
    const { recordEvent } = useAnalytics();
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
    let animatedValue = useRef<Animated.Value>(new Animated.Value(0));
    let closeButtonOpacity = useRef<Animated.Value>(new Animated.Value(0));
    let creditLabelOpacity = useRef<Animated.Value>(new Animated.Value(0));
    let addCreditsLabelOpacity = useRef<Animated.Value>(new Animated.Value(0));

    const creditPillAnimationStyle = {
        transform: [
            {
                translateY: animatedValue.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 0],
                }),
            },
        ],
        opacity: animatedValue.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    };

    const glowAnimationStyle = {
        transform: [
            {
                translateY: animatedValue.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                }),
            },
        ],
        opacity: animatedValue.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    };

    const topupsAnimationStyle = {
        transform: [
            {
                translateY: animatedValue.current.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: [-120, 0, 0],
                }),
            },
        ],
        opacity: animatedValue.current.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    };

    useEffect(() => {
        const runAnimations = () => {
            const duration = 800;

            Animated.parallel([
                Animated.timing(animatedValue.current, {
                    delay: 0,
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad),
                }),
                Animated.timing(closeButtonOpacity.current, {
                    delay: duration / 2,
                    toValue: 1,
                    duration: duration - duration / 2,
                    useNativeDriver: true,
                }),
                Animated.timing(creditLabelOpacity.current, {
                    delay: duration - duration / 4,
                    toValue: 1,
                    duration: duration / 4,
                    useNativeDriver: true,
                }),
                Animated.timing(addCreditsLabelOpacity.current, {
                    delay: duration - duration / 3,
                    toValue: 1,
                    duration: duration / 3,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        InteractionManager.runAfterInteractions(() => runAnimations());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const style = creditsTopUpPageStyles({ appColors, insets });

    useEffect(() => {
        if (DeviceInfo.getDeviceType() === 'Handset') {
            Orientation.lockToPortrait();
        }
    }, []);

    useEffect(() => {
        if (!products || !isMounted.current) {
            return;
        }

        const errorPrompt = () => {
            Alert.alert(
                strings['top_up.err_msg'],
                undefined,
                [
                    {
                        text: strings['global.okay'],
                    },
                ],
                { cancelable: false },
            );
        };

        if (transactionSuccess === true) {
            fetchCredits().then(() => {
                recordEvent(AppEvents.PURCHASE_TOPUP, condenseTopUpData(credits));
            });
        } else if (transactionSuccess === false) {
            recordEvent(AppEvents.TOP_UP_FAILURE, condenseErrorObject(errorObject));
            console.debug('IAP transaction failed with error ', errorObject);
            if (!isMounted.current) {
                return;
            }

            if (errorObject && !['E_USER_CANCELLED', 'E_USER_ERROR'].includes(errorObject.code)) {
                errorPrompt();
            }
        }
        return () => {
            // Note: added to reset transactionSuccess. not resetting causes topup event to fire when opening CreditsScreen after a successful purchase
            resetTransaction();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionSuccess, errorObject]);

    const [isFocussed, setIsFocussed] = useState<boolean>(false);
    // const [isPressed, setIsPressed] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductsResponseMessage>();

    const bottomBtnRef = React.useRef(null);
    const bottomFocusHandle = NodeHandle(bottomBtnRef);

    return (
        <ModalOverlay hideHeader narrow={selectDeviceType({ Tablet: true }, false)}>
            {Platform.isTV ? (
                <>
                    <View style={{ flex: 1 }}>
                        <Animated.View style={[style.creditsContainerTV, creditPillAnimationStyle]}>
                            <View style={style.creditsIconSpacing}>
                                <CreditsIcon width={tvPixelSizeForLayout(42)} height={tvPixelSizeForLayout(42)} />
                            </View>
                            <Ticker textStyle={style.credits}>{credits}</Ticker>
                        </Animated.View>
                        <Text style={[style.creditsHeadingTv]}>Add Credits</Text>

                        <View style={style.containerFullHeight}>
                            {/* Products listing */}
                            {products && products.length > 0 && (
                                <Animated.ScrollView
                                    style={[topupsAnimationStyle, style.scrollviewStyleTv]}
                                    horizontal={true}>
                                    {products.map((topupProduct, i) => (
                                        <TopUpProduct
                                            key={topupProduct.displayOrder}
                                            index={i}
                                            product={topupProduct}
                                            purchaseInProgress={purchaseInProgress}
                                            purchasingProduct={purchaseInProgress && selectedIndex === i}
                                            onPress={() => {
                                                setSelectedIndex(i);
                                                setSelectedProduct(topupProduct);
                                                setIsFocussed(true);
                                            }}
                                            onFocus={() => {
                                                setSelectedIndex(i);
                                            }}
                                            isFocusedFlag={selectedIndex === i}
                                            blockFocusLeft={i === 0}
                                            blockFocusRight={i === products.length - 1}
                                            nextFocusDown={bottomFocusHandle}
                                        />
                                    ))}
                                </Animated.ScrollView>
                            )}
                        </View>
                        <View style={style.bottomContainerTv}>
                            {selectedProduct ? (
                                <Text style={[style.creditsRedeemLabelTv]}>
                                    {strings.formatString(
                                        strings['credits.redeem.textTv'],
                                        selectedProduct.currencySymbol + selectedProduct.retailPrice,
                                        selectedProduct.creditPoints,
                                    )}
                                </Text>
                            ) : (
                                <Text style={[style.creditsRedeemLabelTv]}>{strings['credits.redeem.text']}</Text>
                            )}
                            <View style={[style.buttonContainerTv]}>
                                {isFocussed ? (
                                    <FocusButton
                                        focusRef={bottomBtnRef}
                                        hasTVPreferredFocus={true}
                                        title={strings['credits.confirmTv']}
                                        onPress={() => {
                                            purchaseProduct(selectedProduct);
                                        }}
                                        onFocus={() => {
                                            // setIsPressed(false);
                                        }}
                                        onBlur={() => {
                                            setIsFocussed(false);
                                            setSelectedProduct(null);
                                        }}
                                        blockFocusDown={true}
                                        blockFocusLeft={true}
                                        blockFocusRight={true}
                                    />
                                ) : (
                                    <FocusButton
                                        focusRef={bottomBtnRef}
                                        title={strings['credits.backTv']}
                                        onPress={() => navigation.pop()}
                                        blockFocusDown={true}
                                        blockFocusLeft={true}
                                        blockFocusRight={true}
                                    />
                                )}
                            </View>
                            <Text style={[style.creditsCopyLabel]}>{strings['credits.copy.text']}</Text>
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <Animated.View style={[style.glow, glowAnimationStyle]} />
                    <View style={style.creditsModalContainer}>
                        <Animated.Text style={[style.creditsLabel, { opacity: creditLabelOpacity.current }]}>
                            {strings['credits.available']}
                        </Animated.Text>
                        <Animated.View style={[style.creditsContainer, creditPillAnimationStyle]}>
                            <View style={style.creditsIconSpacing}>
                                <CreditsIcon />
                            </View>
                            <Ticker textStyle={style.credits}>{credits}</Ticker>
                        </Animated.View>
                        <Animated.Text style={[style.creditsLabel, { opacity: addCreditsLabelOpacity.current }]}>
                            {strings['credits.add.label']}
                        </Animated.Text>
                        <>
                            {/* Products listing */}
                            {products && products.length > 0 && (
                                <Animated.ScrollView style={[topupsAnimationStyle]}>
                                    {products.map((topupProduct, i) => (
                                        <TopUpProduct
                                            key={topupProduct.displayOrder}
                                            index={i}
                                            product={topupProduct}
                                            purchaseInProgress={purchaseInProgress}
                                            purchasingProduct={purchaseInProgress && selectedIndex === i}
                                            onPress={() => {
                                                setSelectedIndex(i);
                                                purchaseProduct(topupProduct);
                                            }}
                                        />
                                    ))}
                                    <Text style={[style.creditsCopyLabel]}>{strings['credits.copy.text']}</Text>
                                </Animated.ScrollView>
                            )}
                        </>
                    </View>
                    <Animated.View style={[style.close, { opacity: closeButtonOpacity.current }]}>
                        <BorderlessButton onPress={() => navigation.pop()}>
                            <CloseIcon />
                        </BorderlessButton>
                    </Animated.View>
                </>
            )}
        </ModalOverlay>
    );
};

export default CreditsScreen;
