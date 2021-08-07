import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { isTablet } from 'core/styles/AppStyles';
import { preloginCommonTemplateStyles } from './style';
import { appFlexStyles } from 'core/styles/FlexStyles';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

export default function PreloginCommonTemplate(props: React.PropsWithChildren<PreloginCommonTemplateProps>) {
    return (
        <BackgroundGradient childContainerStyle={isTablet ? appFlexStyles.columnAlignCenter : appFlexStyles.flexColumn}>
            <View
                style={[
                    isTablet
                        ? preloginCommonTemplateStyles.tabScreenContainer
                        : preloginCommonTemplateStyles.mobileScreenContainer,
                    props.childContainerStyle,
                ]}>
                {props.children}
            </View>
        </BackgroundGradient>
    );
}

interface PreloginCommonTemplateProps extends ViewProps {
    childContainerStyle?: StyleProp<ViewStyle>;
}
