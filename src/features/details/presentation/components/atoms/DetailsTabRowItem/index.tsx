import React from 'react';
import { View, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import LearnMoreView from '../LearnMore';
import { style } from './style';

export default function DetailsTabRowItem(props: DetailsTabRowItemProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);

    const styles = style({ appColors });

    return (
        <View style={styles.container}>
            <Text style={styles.titleTextStyle}> {props.title} </Text>
            <View style={styles.learnMoreViewStyle}>
                <Text style={styles.descTextStyle}> {props.descText} </Text>
                {props.showLearnmore && (
                    <LearnMoreView
                        onPress={() => {
                            /// handle learn more action here
                            console.log('learn more pressed');
                        }}
                    />
                )}
            </View>
        </View>
    );
}

interface DetailsTabRowItemProps {
    title: string;
    descText: string;
    showLearnmore?: boolean;
    learnMoreLink?: string;
}
