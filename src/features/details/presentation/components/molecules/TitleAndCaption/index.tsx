import React from 'react';
import { View } from 'react-native';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import DetailsTitle from '../../atoms/DetailsTitle';
import DetailsCaption from '../../atoms/DetailsCaption';

import { styles } from './styles';

export default function DetailsTitleAndCaption(props: DetailsTitleAndCaptionProps) {
    let titleStyle = styles(useAppColors());
    return (
        <View style={props.style}>
            <DetailsTitle name={props.seriesTitle || props.title} />
            <DetailsCaption name={props.caption} style={titleStyle.margin16} />
            {getAdvisory(props.advisory)}
        </View>
    );
}

function getAdvisory(advisory: string | undefined) {
    if (advisory && advisory.length > 0) {
        return <DetailsCaption name={advisory} />;
    }
}

export interface DetailsTitleAndCaptionProps {
    seriesTitle: string | undefined;
    title: string | undefined;
    caption: string | undefined;
    advisory: string | undefined;
    style?: {};
}
