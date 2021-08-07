import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { defaultStyles } from './styles';
import NextArrow from 'assets/images/next_arrow.svg';
import { useLocalization } from 'contexts/LocalizationContext';
import { isTablet } from 'core/styles/AppStyles';

export default function ViewDetailsButton(props: { openDetailContent: any; appColors: any }) {
    const { strings } = useLocalization();
    const styles = defaultStyles(props.appColors);

    return (
        <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
                props.openDetailContent();
            }}>
            <View style={styles.detailButtonContainer}>
                <Text style={styles.detailsText}>{strings.details_view_more}</Text>
                <NextArrow width={isTablet ? 40 : 24} height={isTablet ? 40 : 24} />
            </View>
        </TouchableOpacity>
    );
}
