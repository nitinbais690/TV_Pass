import React from 'react';
import { View } from 'react-native';
import OriginalsTag from '../../atoms/OriginalsTag';
import PremiumTagView from 'core/presentation/components/atoms/PremiumTagView';
import { styles } from './styles';

export default function CardTagsOverlay(props: CardTagsOverlayProps) {
    const notOriginal = !props.isOriginals;
    return (
        <View style={getContainerStyle(props)}>
            {props.isOriginals && <OriginalsTag />}
            {notOriginal && props.isPremium && <PremiumTagView />}
        </View>
    );
}

function getContainerStyle(props: CardTagsOverlayProps): any {
    if (props.isOriginals) {
        return styles.originals;
    } else if (props.isPremium) {
        return styles.premium;
    }
}

export interface CardTagsOverlayProps {
    isOriginals?: boolean;
    isPremium?: boolean;
}
