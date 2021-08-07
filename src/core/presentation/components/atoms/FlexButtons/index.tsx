import React from 'react';
import { View } from 'react-native';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

import { styles } from './styles';

export default function FlexButtons(props: FlexButtonsProps) {
    return (
        <View style={[styles.container, props.containerStyle]}>
            <SecondaryButton
                containerStyle={[styles.marginEnd, styles.spanEven]}
                title={props.secondaryButtonText}
                onPress={props.onPressSecondary}
                secondaryTestID={props.secondaryTestID}
                secondaryAccessibilityLabel={props.secondaryAccessibilityLabel}
            />
            <View style={[styles.spanEven]}>
                <PrimaryButton
                    primaryButtonIcon={props.primaryButtonIcon}
                    containerStyle={{ zIndex: 0 }}
                    title={props.primryButtonText}
                    onPress={props.onPressPrimary}
                    primaryTestID={props.primaryTestID}
                    primaryAccessibilityLabel={props.primaryAccessibilityLabel}
                />
                {props.primaryButtonOverlay}
            </View>
        </View>
    );
}

export interface FlexButtonsProps {
    onPressPrimary: () => void;
    onPressSecondary: () => void;
    primryButtonText: string;
    secondaryButtonText: string;
    primaryButtonIcon?: any;
    primaryButtonOverlay?: React.ReactNode;
    containerStyle?: {};
    primaryTestID?: string;
    primaryAccessibilityLabel?: string;
    secondaryTestID?: string;
    secondaryAccessibilityLabel?: string;
}
