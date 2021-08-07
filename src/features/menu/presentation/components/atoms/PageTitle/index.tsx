import { appFontStyle } from 'core/styles/AppStyles';
import React from 'react';
import { Text, View } from 'react-native';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { PageTitleStyle } from './style';

/*
   Renders Page Title for Menu screens
 */
export default function PageTitle(props: { title: string }) {
    const style = PageTitleStyle(useAppColors());
    return (
        <View style={style.textContainer}>
            <Text style={[appFontStyle.header1, style.textStyle]}>
                {props.title}
                {props.title !== '' && <Text style={[appFontStyle.header1, style.dotText]}>.</Text>}
            </Text>
        </View>
    );
}

interface PageTitleprops {
    title: string;
}
