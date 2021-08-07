import React from 'react';
import { View } from 'react-native';
import ShareIcon from 'assets/images/ic_share.svg';
import AddIcon from 'assets/images/ic_add.svg';
import MinusIcon from 'assets/images/ic_minus.svg';
import PlayIcon from 'assets/images/ic_play.svg';
import { ROUND_BUTTON_SIZE, ICON_SIZE, SHARE_ICON_SIZE, styles } from './styles';
import { useLocalization } from 'contexts/LocalizationContext';
import RoundIconButton from 'core/presentation/components/atoms/RoundIconButton';
import DownloadButton from 'features/downloads/presentation/components/atoms/DownloadButton';
import { ResourceVm } from 'qp-discovery-ui';

export default function DetailsServiceAction(props: ServiceActionsProps) {
    const { strings } = useLocalization();

    return (
        <View style={styles.container}>
            <DownloadButton
                width={ROUND_BUTTON_SIZE}
                height={ROUND_BUTTON_SIZE}
                resource={props.resource}
                onNavigate={props.onNavigate}
            />
            <RoundIconButton
                width={ROUND_BUTTON_SIZE}
                height={ROUND_BUTTON_SIZE}
                title={strings.watchlist}
                onPress={() => {
                    props.liked ? props.unlike() : props.like();
                }}
                svgIcon={
                    props.liked ? (
                        <MinusIcon width={ICON_SIZE} height={ICON_SIZE} />
                    ) : (
                        <AddIcon width={ICON_SIZE} height={ICON_SIZE} />
                    )
                }
                testID={'watchlistButton'}
            />
            <RoundIconButton
                width={ROUND_BUTTON_SIZE}
                height={ROUND_BUTTON_SIZE}
                title={strings.share}
                svgIcon={<ShareIcon width={ICON_SIZE} height={SHARE_ICON_SIZE} />}
            />
            <RoundIconButton
                style={props.showTrailer ? {} : styles.hide}
                width={ROUND_BUTTON_SIZE}
                height={ROUND_BUTTON_SIZE}
                title={strings.trailer}
                svgIcon={<PlayIcon width={ICON_SIZE} height={SHARE_ICON_SIZE} />}
            />
        </View>
    );
}

interface ServiceActionsProps {
    resource: ResourceVm;
    onNavigate?: () => void;
    showTrailer: boolean;
    liked: boolean;
    like: () => void;
    unlike: () => void;
}
