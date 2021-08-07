import { CommonActions } from '@react-navigation/native';
import { ProductsResponseMessage } from '../screens/hooks/useGetProducts';
import { NAVIGATION_TYPE } from '../screens/Navigation/NavigationConstants';

export const insertBeforeLast = (routeName: string, params?: any) => (state: any) => {
    const routes = [...state.routes.slice(0, -1), { name: routeName, params }, state.routes[state.routes.length - 1]];

    return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
    });
};

export const routeToContinueSubscription = ({ navigation }: { navigation: any }) => {
    navigation.navigate(NAVIGATION_TYPE.CONTINUE_SUBSCRIPTION);
};

export const routeToPurchaseConfirmation = ({
    subscription,
    navigation,
}: {
    subscription: ProductsResponseMessage;
    navigation: any;
}) => {
    if (!subscription) {
        return;
    }

    const price = subscription.retailPrice;
    const duration = subscription.promotions && subscription.promotions[0].promotionDuration;
    const currencyCode = subscription.currencySymbol;
    const creditPoints = subscription.creditPoints;

    navigation.navigate(NAVIGATION_TYPE.PURCHASE_CONFIRMATION, {
        price: price,
        duration: duration,
        currencyCode: currencyCode,
        creditPoints: creditPoints,
    });
};
