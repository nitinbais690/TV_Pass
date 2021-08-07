import { useLocalization } from 'contexts/LocalizationContext';
import React from 'react';
import { View } from 'react-native';
import DetailsTabRowItem from 'features/details/presentation/components/atoms/DetailsTabRowItem';
import { style } from './style';

export default function DetailsTabView(props: DetailsTabViewProps) {
    const styles = style();
    const { strings }: any = useLocalization();

    return (
        <View style={styles.container}>
            <DetailsTabRowItem title={strings.details_screen_producers} descText={props.producers} />
            <DetailsTabRowItem title={strings.details_screen_studio} descText={props.studio} />
            <DetailsTabRowItem
                title={strings.details_screen_maturity_ratings}
                descText={props.maturityRating}
                showLearnmore={true}
                learnMoreLink=""
            />
        </View>
    );
}

interface DetailsTabViewProps {
    producers: string;
    studio: string;
    maturityRating: string;
    learnMoreLink: string;
}
