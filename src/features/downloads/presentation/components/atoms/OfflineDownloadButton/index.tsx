import React from 'react';
import { AccessibilityProps } from 'react-native';
import RoundIconButton from 'core/presentation/components/atoms/RoundIconButton';
import { Download } from 'rn-qp-nxg-player';
import { useLocalization } from 'contexts/LocalizationContext';
import DownloadIcon from 'assets/images/ic_download.svg';
import DownloadingIcon from 'assets/images/downloading.svg';
import PlayIcon from 'assets/images/play_outline_gray_sm.svg';
import { ICON_SIZE } from './styles';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import useAppColors from 'core/presentation/hooks/use-app-colors';

const OfflineDownloadButton = (props: OfflineDownloadButtonProps) => {
    const { strings } = useLocalization();
    const appColors = useAppColors();

    const handlePress = () => {
        if (props.onPress && props.download) {
            props.onPress();
        }
    };

    const getActionIcons = () => {
        const iconSize = !props.iconSize ? ICON_SIZE : props.iconSize;
        if (props.download) {
            switch (props.download.state) {
                case 'COMPLETED':
                    return <PlayIcon width={iconSize} height={iconSize} />;
                case 'FAILED':
                    return <DownloadIcon width={iconSize} height={iconSize} />;
                case 'PAUSED':
                    return <DownloadIcon width={iconSize} height={iconSize} />;
                case 'QUEUED':
                    return <DownloadIcon width={iconSize} height={iconSize} />;
                case 'DOWNLOADING':
                    return (
                        <AnimatedCircularProgress
                            size={props.width - 2}
                            padding={1}
                            width={2}
                            fill={
                                !props.download
                                    ? 0
                                    : props.download.progressPercent >= 99
                                    ? 0
                                    : props.download.progressPercent
                            }
                            tintColor={appColors.brandTint}
                            backgroundColor={'transparent'}>
                            {() => <DownloadingIcon width={iconSize} height={iconSize} />}
                        </AnimatedCircularProgress>
                    );
                default:
                    return <DownloadingIcon width={iconSize} height={iconSize} />;
            }
        }
        return <DownloadIcon width={iconSize} height={iconSize} />;
    };

    const getTitle = (): string => {
        if (props.download) {
            switch (props.download.state) {
                case 'PAUSED':
                    return strings['download.resume'];
                case 'DOWNLOADING':
                    return `${props.download.progressPercent.toFixed(0)}${strings['download.progress']}`;
            }
        }
        return props.title;
    };

    return (
        <RoundIconButton
            width={props.width}
            height={props.height}
            title={getTitle()}
            onPress={() => handlePress()}
            svgIcon={getActionIcons()}
        />
    );
};

export interface OfflineDownloadButtonProps extends AccessibilityProps {
    width: number;
    height: number;
    title?: string;
    iconSize?: number;
    download?: Download;
    onPress?: () => void;
}

export default OfflineDownloadButton;
