import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import { BorderlessButton } from 'react-native-gesture-handler';
import Ticker from 'react-native-ticker';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { useAlert } from 'contexts/AlertContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useIAPState } from 'utils/IAPContextProvider';
import { ProductsResponseMessage, useGetProducts } from './hooks/useGetProducts';
import AppLoadingIndicator from './components/AppLoadingIndicator';
import ModalOverlay from './components/ModalOverlay';
import CreditsIcon from '../../assets/images/credits_large.svg';
import CloseIcon from '../../assets/images/close.svg';
import { creditsTopUpPageStyles, topUpProductStyle } from '../styles/CreditsTopUp.style';
import { useAnalytics } from 'utils/AnalyticsReporterContext';
import { AppEvents, condenseErrorObject, condenseTopUpData } from 'utils/ReportingUtils';

const TopUpProduct = ({ product, onPress }: { product: ProductsResponseMessage; onPress?(): void }) => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const { strings } = useLocalization();

    const productsStyle = topUpProductStyle({ appColors });
    const creditIconWidth = selectDeviceType({ Handset: '100%' }, '100%');

    return (
        <BorderlessButton onPress={onPress}>
            <View style={productsStyle.container}>
                <View style={[productsStyle.glow, { shadowOpacity: (product.displayOrder - 1) * 0.25 }]} />
                <View style={productsStyle.logoContainer}>
                    <View style={productsStyle.logo}>
                        <CreditsIcon width={creditIconWidth} height={creditIconWidth} />
                    </View>
                </View>
                <View style={productsStyle.detailsContainer}>
                    <Text style={productsStyle.title}>
                        {strings.formatString(strings['credits.product.title'], product.creditPoints)}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={productsStyle.description}>{product.currencySymbol + product.retailPrice}</Text>
                        <Text style={productsStyle.caption}>{strings['credits.product.caption']}</Text>
                    </View>
                </View>
            </View>
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
    const { loading: purchaseInProgress, purchaseProduct, transactionSuccess, errorObject } = useIAPState();
    const { loading: loadingTopups, response: products } = useGetProducts();
    const { recordEvent } = useAnalytics();

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionSuccess, errorObject]);

    return (
        <ModalOverlay hideHeader narrow={selectDeviceType({ Tablet: true }, false)}>
            <View style={style.glow} />
            <View style={style.creditsModalContainer}>
                <Text style={style.creditsLabel}>{strings['credits.available']}</Text>
                <View style={style.creditsContainer}>
                    <View style={style.creditsIconSpacing}>
                        <CreditsIcon />
                    </View>
                    <Ticker textStyle={style.credits}>{credits}</Ticker>
                </View>
                <Text style={style.creditsLabel}>{strings['credits.add.label']}</Text>
                <>
                    {/* Products loading state */}
                    {loadingTopups && <AppLoadingIndicator />}

                    {/* Products listing */}
                    {!loadingTopups && products && products.length > 0 && (
                        <ScrollView>
                            {products.map(topupProduct => (
                                <TopUpProduct
                                    key={topupProduct.displayOrder}
                                    product={topupProduct}
                                    onPress={() => purchaseProduct(topupProduct)}
                                />
                            ))}
                        </ScrollView>
                    )}
                </>
            </View>
            {/* Product purchase in-progress */}
            {purchaseInProgress && (
                <View style={style.loadingContainer}>
                    <AppLoadingIndicator />
                </View>
            )}
            <View style={style.close}>
                <BorderlessButton onPress={() => navigation.pop()}>
                    <CloseIcon />
                </BorderlessButton>
            </View>
        </ModalOverlay>
    );
};

export default CreditsScreen;
