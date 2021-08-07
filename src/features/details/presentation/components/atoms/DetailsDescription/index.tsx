import React, { useState, useEffect } from 'react';
import { Text, View, Platform, TouchableHighlight } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useLocalization } from 'contexts/LocalizationContext';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { appFontStyle } from 'core/styles/AppStyles';
import { styles } from './styles';

export default function DetailsDescription(props: DetailsDescriptionProps) {
    const [briefMode, setBriefMode] = useState(true);
    const { strings } = useLocalization();
    let appColors = useAppColors();
    let descriptionStyles = styles(appColors);
    let fontStyle = appFontStyle;

    useEffect(() => {
        if (props.showLongOnly) {
            setBriefMode(false);
        } else if (props.shortDescription && props.shortDescription.length > 0) {
            setBriefMode(true);
        }
    }, [props.shortDescription, props.showLongOnly]);

    return (
        <View style={props.style}>
            <Text
                numberOfLines={briefMode ? 2 : 99}
                ellipsizeMode={'tail'}
                style={[fontStyle.body3, descriptionStyles.textStyle]}>
                {props.longDescription ? props.longDescription : props.shortDescription}
            </Text>
            {!props.showLongOnly &&
                briefMode &&
                (Platform.isTV ? (
                    <TouchableHighlight
                        style={descriptionStyles.tvReadMoreSize}
                        underlayColor={appColors.brandTint}
                        onPress={() => setBriefMode(false)}>
                        <Text style={descriptionStyles.readMoreStyle}>{strings['content_detail.read_more_lbl']}</Text>
                    </TouchableHighlight>
                ) : (
                    <BorderlessButton onPress={() => setBriefMode(false)}>
                        <Text style={descriptionStyles.readMoreStyle}>{strings['content_detail.read_more_lbl']}</Text>
                    </BorderlessButton>
                ))}
            {!props.showLongOnly &&
                !briefMode &&
                (Platform.isTV ? (
                    <TouchableHighlight
                        style={descriptionStyles.tvReadMoreSize}
                        underlayColor={appColors.brandTint}
                        onPress={() => setBriefMode(true)}>
                        <Text style={descriptionStyles.readMoreStyle}>{strings['content_detail.read_less_lbl']}</Text>
                    </TouchableHighlight>
                ) : (
                    <BorderlessButton onPress={() => setBriefMode(true)}>
                        <Text style={descriptionStyles.readMoreStyle}>{strings['content_detail.read_less_lbl']}</Text>
                    </BorderlessButton>
                ))}
        </View>
    );
}

export interface DetailsDescriptionProps {
    longDescription: string | undefined;
    shortDescription: string | undefined;
    style?: {};
    showLongOnly?: boolean;
}
