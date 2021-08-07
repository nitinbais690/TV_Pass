import React from 'react';
import { View } from 'react-native';
import PlayInline from 'assets/images/play_inline.svg';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';
import { appDimensionValues } from 'core/styles/AppStyles';
import CardTagsOverlay, { CardTagsOverlayProps } from '../CardTagsOverlay';
import { appFlexStyles } from 'core/styles/FlexStyles';

export default function CardPlayOverlay(props: CardTagsOverlayProps) {
    return (
        <View style={appFlexStyles.flexColumnFill}>
            <CardTagsOverlay isOriginals={props.isOriginals} isPremium={props.isPremium} />
            <View style={styles.container}>
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', '#000000']}
                    locations={[0.2, 0.98]}
                    style={styles.gradient}>
                    <PlayInline
                        style={styles.playIcon}
                        width={appDimensionValues.actionIconSize}
                        height={appDimensionValues.actionIconSize}
                    />
                </LinearGradient>
            </View>
        </View>
    );
}
