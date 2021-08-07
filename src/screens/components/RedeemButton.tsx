import React, { useCallback, useRef } from 'react';
import {
    AccessibilityProps,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    GestureResponderEvent,
    LayoutAnimation,
    Platform,
    findNodeHandle,
} from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { ResourceVm } from 'qp-discovery-ui';
import { useLocalization } from 'contexts/LocalizationContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, tvPixelSizeForLayout } from '../../../AppStyles';
import { Entitlement } from '../hooks/useTVODEntitlement';
import CreditsIcon from '../../../assets/images/credits.svg';
import CreditLoading from 'screens/components/CreditLoading';
import { useAuth } from 'contexts/AuthContextProvider';
import { getRedeemExpiringIn } from 'utils/RedeemedUtils';

/**
 * Represents the various states of the Redeem Button
 *
 * TODO: How should we handle entitlement check errors? (Server failure after multiple retries?)
 *
 * State Machine representing the possible state transitions:
 *
 *                                       │
 *                                       │
 *                                       │
 *                                       ▼
 *                             ┌───────────────────┐
 *                             │CheckingEntitlement│
 *                             └───────────────────┘
 *                                       │
 *                ┌──────────────────────┼─────────────────────┐
 *                ▼                      │                     ▼
 *    ┌───────────────────────┐          │               ┌───────────┐
 *    │ NotEntitled_NoCredit  │  ┌───────┴────────┐      │  Played   │
 *    └───────────────────────┘  │                │      └───────────┘
 *                │              │                │            ▲
 *                │              │                │            │
 *                │              │                │            │
 *                │              ▼                ▼            │
 *                │      ┌──────────────┐   ┌───────────┐      │
 *                └─────▶│ NotEntitled  │──▶│  Entitled │──────┘
 *                       └──────────────┘   └───────────┘
 */
export enum RedeemState {
    /**
     * Intial state, indicates we are determining the entitlement of the asset
     */
    CheckingEntitlement,
    /**
     * Represents NotEntitled state where the user does not have enough credits to purchase the asset
     */
    NotEntitled_NoCredit,
    /**
     * Represents NotEntitled state where the user has enough credits to purchase the asset
     */
    NotEntitled,
    /**
     * Represents an already Entitled state
     */
    Entitled,
    // /**
    //  * Represents Entitled state, where the user has already begun playing the asset
    //  */
    // Played,
}

export interface RedeemButtonProps extends AccessibilityProps {
    loading: boolean;
    asset: ResourceVm;
    entitlement?: Entitlement;
    hasTVPreferredFocus?: boolean;
    onHandleBlur?: () => void;
    onPress: (state: RedeemState, event: GestureResponderEvent) => void;
    credits?: string;
    blockFocusUp: boolean;
}

/**
 * A custom hook that composes `useCredits` and computes the current PurchaseState
 *
 * @param entitlementLoading Indicates whether we are still checking entitlement for the asset
 * @param asset The TVOD asset to verify entitlement
 * @param entitlement Optional. Entitlement for the asset, if available
 */
const useRedeemState = (entitlementLoading: boolean, asset: ResourceVm, entitlement?: Entitlement) => {
    const { loading: creditsLoading, credits } = useCredits();

    if (entitlementLoading) {
        return RedeemState.CheckingEntitlement;
    }

    if (entitlement) {
        // Purchased State
        return RedeemState.Entitled;
    } else if (creditsLoading) {
        // Pre-Purchased State

        // Note: We could have an edge-case (deep-linking) where we enter the Details page directly,
        // in such cases, we might still be fetching credits from Wallet server, so this check is required.
        // But, we shouldn't combine this with `entitlementLoading` since we could have entitlements cached locally
        // for the asset. Hence, `creditsLoading` is considered, only when we know we are in `Pre-Purchased` state.
        return RedeemState.CheckingEntitlement;
    } else {
        // Check if user has enough credits to purchase the content
        return credits && asset.credits && credits >= asset.credits
            ? RedeemState.NotEntitled
            : RedeemState.NotEntitled_NoCredit;
    }
};

export const RedeemButton = (props: RedeemButtonProps) => {
    const { loading, asset, entitlement, onPress, hasTVPreferredFocus, onHandleBlur, blockFocusUp } = props;
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { isModalVisible: inOnboardingFlow } = false;

    const state = useRedeemState(loading, asset, entitlement);
    const shouldRenderPillStyle = state === RedeemState.Entitled;
    const { accountProfile } = useAuth();
    const touchableHighlightRef = useRef(null);

    React.useLayoutEffect(() => {
        if (state === RedeemState.Entitled) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
    }, [state]);

    const styles = StyleSheet.create({
        container: {
            borderRadius: 25,
            backgroundColor: inOnboardingFlow
                ? appColors.primary
                : shouldRenderPillStyle
                ? 'transparent'
                : appColors.brandTint,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-start',
            height: selectDeviceType({ Handset: 36 }, 50),
            width: Platform.isTVOS ? '50%' : '100%',
            // flex:1
        },
        containerTv: {
            borderRadius: tvPixelSizeForLayout(400),
            backgroundColor: inOnboardingFlow
                ? appColors.primary
                : shouldRenderPillStyle
                ? 'transparent'
                : appColors.brandTint,
            alignItems: 'center',
            height: tvPixelSizeForLayout(80),
            borderColor: 'transparent',
            borderWidth: tvPixelSizeForLayout(4),
            justifyContent: 'center',
            alignSelf: 'flex-start',
            marginRight: tvPixelSizeForLayout(40),
            overflow: 'hidden',
        },
        buttonBorderStyleTv: {
            backgroundColor: appColors.brandTint,
            borderWidth: tvPixelSizeForLayout(4),
            borderColor: appColors.brandTint,
        },
        buttonBorderFocusStyleTv: {
            backgroundColor: appColors.brandTint,
            borderWidth: tvPixelSizeForLayout(4),
            borderColor: appColors.secondary,
        },
        loadingContainer: {
            alignItems: 'center',
            width: '100%',
        },
        textWrapperStyle: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: shouldRenderPillStyle ? 'center' : undefined,
            paddingLeft: shouldRenderPillStyle ? 0 : 20,
        },
        textWrapperStyleTV: {
            justifyContent: shouldRenderPillStyle ? 'center' : undefined,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: tvPixelSizeForLayout(50),
        },
        textStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 4,
        },
        textStyleTv: {
            paddingLeft: tvPixelSizeForLayout(10),
            fontFamily: appFonts.primary,
            fontSize: tvPixelSizeForLayout(32),
            fontWeight: '500',
            color: appColors.secondary,
        },
        pillTextStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 0,
        },
        pillTextStyleTv: {
            fontFamily: appFonts.primary,
            fontSize: tvPixelSizeForLayout(32),
            fontWeight: '500',
            color: appColors.secondary,
        },
        highlightTextStyle: {
            color: appColors.primary,
            fontWeight: '500',
        },
        pillContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            borderWidth: Platform.isTV ? tvPixelSizeForLayout(4) : 2,
            flex: 1,
            borderColor: appColors.brandTint,
            borderRadius: Platform.isTV ? tvPixelSizeForLayout(400) : 25,
        },
        loadingWrapper: {
            width: '50%',
            height: selectDeviceType({ Handset: 36 }, 50),
            alignItems: 'center',
            justifyContent: 'center',
        },
        loading: {},
        addCreditTextTv: {
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(32) : appFonts.md,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: Platform.isTV ? tvPixelSizeForLayout(30) : 10,
            alignSelf: 'center',
        },
    });

    const availableDays = () => {
        let expireDays = getRedeemExpiringIn(entitlement!.validityTill, accountProfile);
        var stringToDisplay =
            expireDays !== 1
                ? strings.formatString(strings['content_detail.redeem_btn.entitled_other'], expireDays)
                : strings['content_detail.redeem_btn.entitled_one'];
        return stringToDisplay;
    };

    const purchaseButtonContent = (purchaseState: RedeemState): JSX.Element => {
        switch (purchaseState) {
            case RedeemState.CheckingEntitlement:
                return (
                    <View style={styles.loadingWrapper}>
                        <CreditLoading style={styles.loading} />
                    </View>
                );
            case RedeemState.NotEntitled_NoCredit:
                return <Text style={styles.addCreditTextTv}>{strings['content_detail.redeem_btn.no_credit']}</Text>;
            case RedeemState.NotEntitled:
                return (
                    <View style={[Platform.isTV ? styles.textWrapperStyleTV : styles.textWrapperStyle]}>
                        {Platform.isTV ? (
                            <CreditsIcon width={tvPixelSizeForLayout(35)} height={tvPixelSizeForLayout(35)} />
                        ) : (
                            <CreditsIcon />
                        )}
                        <Text style={[Platform.isTV ? styles.textStyleTv : styles.textStyle]}>
                            {strings.formatString(strings['content_detail.redeem_btn.not_entitled'], asset.credits!)}
                        </Text>
                    </View>
                );
            case RedeemState.Entitled:
                const availableForLabel = availableDays();
                return (
                    <View style={[Platform.isTV ? styles.textWrapperStyleTV : styles.textWrapperStyle]}>
                        <Text
                            style={
                                shouldRenderPillStyle
                                    ? Platform.isTV
                                        ? styles.pillTextStyleTv
                                        : styles.pillTextStyle
                                    : Platform.isTV
                                    ? styles.textStyleTv
                                    : styles.textStyle
                            }>
                            {availableForLabel}
                        </Text>
                    </View>
                );
        }
    };

    const onRef = useCallback(ref => {
        if (ref) {
            touchableHighlightRef.current = ref;
        }
    }, []);

    const [isFocussed, setIsFocussed] = React.useState<boolean>(false);
    const onRedeemFocus = (): void => {
        setIsFocussed(true);
    };
    const onRedeemBlur = (): void => {
        setIsFocussed(false);
    };

    return (
        <TouchableHighlight
            testID="redeemButton"
            accessibilityLabel={'redeemButton'}
            activeOpacity={0.5}
            disabled={loading}
            hasTVPreferredFocus={state === 2 ? hasTVPreferredFocus : false}
            isTVSelectable={state === 2}
            ref={onRef}
            nextFocusLeft={findNodeHandle(touchableHighlightRef.current)}
            nextFocusRight={findNodeHandle(touchableHighlightRef.current)}
            nextFocusUp={blockFocusUp ? findNodeHandle(touchableHighlightRef.current) : undefined}
            onBlur={() => {
                Platform.isTV && onHandleBlur && onHandleBlur();
            }}
            onFocus={() => {
                state === 2 && Platform.isTV ? onRedeemFocus() : undefined;
            }}
            underlayColor={styles.container.backgroundColor}
            style={[
                Platform.isTV ? styles.containerTv : styles.container,
                loading ? styles.loadingContainer : undefined,
                state === 2 && Platform.isTV
                    ? isFocussed
                    ? styles.buttonBorderFocusStyleTv
                    : styles.buttonBorderStyleTv
                    : undefined,
            ]}
            onPress={e => onPress(state, e)}>
            <>{!inOnboardingFlow && <View style={[styles.pillContainer]}>{purchaseButtonContent(state)}</View>}</>
        </TouchableHighlight>
    );
};
