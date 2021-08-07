import React from 'react';
import {
    AccessibilityProps,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    GestureResponderEvent,
    LayoutAnimation,
} from 'react-native';
import { selectDeviceType } from 'qp-common-ui';
import { ResourceVm } from 'qp-discovery-ui';
import { useLocalization } from 'contexts/LocalizationContext';
import { useCredits } from 'utils/CreditsContextProvider';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';
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
    onPress: (state: RedeemState, event: GestureResponderEvent) => void;
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
    const { loading, asset, entitlement, onPress } = props;
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const { isModalVisible: inOnboardingFlow } = false;

    const state = useRedeemState(loading, asset, entitlement);
    const shouldRenderPillStyle = state === RedeemState.Entitled;
    const { accountProfile } = useAuth();

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
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            height: selectDeviceType({ Handset: 36 }, 50),
            width: shouldRenderPillStyle ? selectDeviceType({ Handset: '50%' }, '70%') : '100%',
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
        textStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 4,
        },
        pillTextStyle: {
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: appColors.secondary,
            paddingHorizontal: 0,
        },
        cancelledPillContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            borderWidth: 2,
            flex: 1,
            borderColor: '#FF0000',
            borderRadius: 25,
        },
        highlightTextStyle: {
            color: appColors.primary,
            fontWeight: '500',
        },
        pillContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            borderWidth: 2,
            flex: 1,
            borderColor: appColors.brandTint,
            borderRadius: 25,
        },
        loadingWrapper: {
            width: '100%',
            height: selectDeviceType({ Handset: 36 }, 50),
            alignItems: 'center',
            justifyContent: 'center',
        },
        loading: {},
    });

    const availableDays = () => {
        let expireDays = getRedeemExpiringIn(entitlement!.validityTill, accountProfile);
        var stringToDisplay =
            expireDays != 1
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
            case RedeemState.NotEntitled:
                return (
                    <View style={styles.textWrapperStyle}>
                        <CreditsIcon />
                        <Text style={styles.textStyle}>
                            {strings.formatString(strings['content_detail.redeem_btn.not_entitled'], asset.credits!)}
                        </Text>
                    </View>
                );
            case RedeemState.Entitled:
                const availableForLabel = availableDays();
                return (
                    <View style={styles.textWrapperStyle}>
                        <Text style={shouldRenderPillStyle ? styles.pillTextStyle : styles.textStyle}>
                            {availableForLabel}
                        </Text>
                    </View>
                );
        }
    };

    return (
        <TouchableHighlight
            testID="redeemButton"
            accessibilityLabel={'redeemButton'}
            activeOpacity={0.5}
            disabled={loading}
            underlayColor={styles.container.backgroundColor}
            style={[styles.container, loading ? styles.loadingContainer : undefined]}
            onPress={e => onPress(state, e)}>
            <>
                {!inOnboardingFlow && (
                    <View
                        style={
                            shouldRenderPillStyle && accountProfile && accountProfile.hasSubCancelled
                                ? styles.cancelledPillContainer
                                : styles.pillContainer
                        }>
                        {purchaseButtonContent(state)}
                    </View>
                )}
            </>
        </TouchableHighlight>
    );
};
