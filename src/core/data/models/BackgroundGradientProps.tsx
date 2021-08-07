import { ViewProps, ViewStyle, StyleProp } from 'react-native';

export type HeaderType = 'Regular' | 'HeaderTab';

export interface BackgroundGradientProps extends ViewProps {
    childContainerStyle?: StyleProp<ViewStyle>;
    insetHeader?: boolean;
    headerType?: HeaderType;
    insetTabBar?: boolean;
}
