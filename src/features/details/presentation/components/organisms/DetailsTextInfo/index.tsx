import React from 'react';
import { View } from 'react-native';
import DetailsTitleAndCaption, { DetailsTitleAndCaptionProps } from '../../molecules/TitleAndCaption';
import DetailsDescription from '../../atoms/DetailsDescription';
import { styles } from './styles';

export default function DetailsTextInfo(props: DetailsTextInfoProps) {
    return (
        <View style={[styles.container]}>
            <DetailsTitleAndCaption
                seriesTitle={props.seriesTitle}
                title={props.title}
                caption={props.caption}
                advisory={props.advisory}
            />
            <DetailsDescription shortDescription={props.shortDescription} longDescription={props.longDescription} />
        </View>
    );
}

interface DetailsTextInfoProps extends DetailsTitleAndCaptionProps {
    shortDescription: string | undefined;
    longDescription: string | undefined;
}
