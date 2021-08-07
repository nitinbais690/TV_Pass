import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import DetailsTitleAndCaption from '../../molecules/TitleAndCaption';
import DetailsThumbnail from '../../atoms/DetailsThumbnail';

export default function DetailsThumbnailAndCaption(props: DetailsThumbnailAndCaptionProps) {
    return (
        <View style={styles.contentDetails}>
            <DetailsThumbnail id={props.resourceId || ''} mainResourceImage={props.image} imageUrl={props.imageUrl} />
            <View style={styles.caption}>
                <DetailsTitleAndCaption
                    seriesTitle={props.seriesTitle}
                    title={props.name}
                    caption={props.caption1String}
                    advisory={props.advisory}
                />
            </View>
        </View>
    );
}

export interface DetailsThumbnailAndCaptionProps {
    advisory: string | undefined;
    caption1String: string | undefined;
    image: string | undefined;
    resourceId: string | undefined;
    seriesTitle: string | undefined;
    imageUrl: string | undefined;
    name: string | undefined;
}
