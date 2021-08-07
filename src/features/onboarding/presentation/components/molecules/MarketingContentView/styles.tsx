import { percentage } from 'qp-common-ui';
import { percentageOfHeight } from 'core/styles/AppStyles';
import { StyleSheet } from 'react-native';

export const marketingContentStyle = StyleSheet.create({
    marketingImage: {
        width: percentage(100, true),
        height: percentageOfHeight(61, true),
    },
});
