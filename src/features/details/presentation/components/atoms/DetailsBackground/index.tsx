import React from 'react';
import { ViewProps, View, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { styles, colors } from './styles';

interface DetailsBackgroundProps extends ViewProps {
    childContainerStyle?: StyleProp<ViewStyle>;
}

export default function DetailsBackground(props: React.PropsWithChildren<DetailsBackgroundProps>) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    return (
        <LinearGradient
            colors={[
                appColors.brandTintTranslucent,
                colors.gradient2,
                appColors.primaryVariant6,
                appColors.primaryVariant6,
            ]}
            angle={180}
            locations={[0, 0.08, 0.51, 0.94]}
            useAngle={true}
            angleCenter={{ x: 0.5, y: 0.5 }}
            style={styles.container}
            {...props}>
            <View style={props.childContainerStyle}>{props.children}</View>
        </LinearGradient>
    );
}
