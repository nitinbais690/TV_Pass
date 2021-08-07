import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { Text, View } from 'react-native';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import CommonTitle from 'core/presentation/components/atoms/CommonTitle';
import { marketingTextContentStyle } from './styles';

/*
 *  Renders Title and Description of Marketing pages.
 **/
export default function MarketingText(props: MarketingTextprops) {
    const styles = marketingTextContentStyle(useAppColors());
    return (
        <View style={styles.textContainer}>
            <CommonTitle style={styles.commonTitleStyle} text={props.title} showThemedDot={true} />
            <Text style={[appFontStyle.subTitle, styles.descTextStyle]}>{props.description}</Text>
        </View>
    );
}

interface MarketingTextprops {
    title: string;
    description: string;
}
