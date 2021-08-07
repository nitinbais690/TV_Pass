import React from 'react';
import { View } from 'react-native';
import PrimaryButton from '../../atoms/PrimaryButton';
import SecondaryButton from '../../atoms/SecondaryButton';
import { FooterActionStyle } from './style';

const FooterAction = (props: FooterActionProps): JSX.Element => {
    const styles = FooterActionStyle();

    return (
        <View style={styles.container}>
            {props.secondryButton && (
                <SecondaryButton
                    containerStyle={[styles.secondaryButton]}
                    title={props.secondryButton.label}
                    onPress={props.secondryButton.onPress}
                    secondaryTestID={props.secondryButton.testId}
                    secondaryAccessibilityLabel={props.secondryButton.accessibilityLabel}
                />
            )}
            <PrimaryButton
                containerStyle={[styles.primaryButton]}
                title={props.primartButton.label}
                onPress={props.primartButton.onPress}
                primaryTestID={props.primartButton.testId}
                primaryAccessibilityLabel={props.primartButton.accessibilityLabel}
            />
        </View>
    );
};

export default FooterAction;

export interface FooterActionProps {
    primartButton: FooterButtonProps;
    secondryButton?: FooterButtonProps;
}
export interface FooterButtonProps {
    label: string;
    testId: string;
    accessibilityLabel: string;
    onPress: () => void;
}
