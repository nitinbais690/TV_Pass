import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { BorderlessButton } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialIndicator } from 'react-native-indicators';
import { Download } from 'rn-qp-nxg-player';
import { selectDeviceType } from 'qp-common-ui';
import DownloadIcon from '../../../assets/images/download.svg';
import DownloadSmallIcon from '../../../assets/images/download_small.svg';
import DownloadedIcon from '../../../assets/images/downloaded.svg';
import DownloadedSmallIcon from '../../../assets/images/downloaded_small.svg';
import DownloadFailedIcon from '../../../assets/images/download_failed.svg';
import DownloadFailedSmallIcon from '../../../assets/images/download_failed_small.svg';
import DownloadPausedIcon from '../../../assets/images/download_paused.svg';
import DownloadPausedSmallIcon from '../../../assets/images/download_paused_small.svg';
import { appFonts } from '../../../AppStyles';

export interface DownloadButtonProps {
    fetchingAuthorization: boolean;
    download?: Download;
    onPress?: (pointerInside: boolean) => void;
}

const DownloadButton = ({ fetchingAuthorization, download, onPress }: DownloadButtonProps) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const size = selectDeviceType({ Handset: 36 }, 50);

    const styles = StyleSheet.create({
        container: {},
        progressText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            fontWeight: '500',
        },
        progressPercentText: {
            fontSize: 6,
        },
        loadingContainer: {
            borderWidth: 2,
            width: size,
            aspectRatio: 1,
            borderRadius: size,
            borderColor: appColors.secondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    const downloadButtonContent = (loading: boolean, download?: Download): JSX.Element => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <MaterialIndicator size={size} color={appColors.brandTint} trackWidth={2} />
                </View>
            );
        }

        if (!download) {
            return selectDeviceType({ Handset: <DownloadSmallIcon /> }, <DownloadIcon />);
        }

        switch (download.state) {
            case 'COMPLETED':
                return selectDeviceType({ Handset: <DownloadedSmallIcon /> }, <DownloadedIcon />);
            case 'FAILED':
                return selectDeviceType({ Handset: <DownloadFailedSmallIcon /> }, <DownloadFailedIcon />);
            case 'PAUSED':
                return selectDeviceType({ Handset: <DownloadPausedSmallIcon /> }, <DownloadPausedIcon />);
            case 'QUEUED':
                return selectDeviceType({ Handset: <DownloadPausedSmallIcon /> }, <DownloadPausedIcon />);
            case 'DOWNLOADING':
                return (
                    <AnimatedCircularProgress
                        size={size}
                        width={2}
                        fill={download.progressPercent}
                        tintColor={appColors.secondary}
                        backgroundColor={'#FFFFFF4D'}>
                        {fill => (
                            <Text style={styles.progressText}>
                                {fill.toFixed(0)}
                                <Text style={styles.progressPercentText}>%</Text>
                            </Text>
                        )}
                    </AnimatedCircularProgress>
                );
            default:
                return selectDeviceType({ Handset: <DownloadSmallIcon /> }, <DownloadIcon />);
        }
    };

    return (
        <BorderlessButton
            testID="downloadButton"
            activeOpacity={0.5}
            // underlayColor={appColors.prima}
            style={styles.container}
            onPress={onPress}>
            <View style={styles.container}>{downloadButtonContent(fetchingAuthorization, download)}</View>
        </BorderlessButton>
    );
};

export default DownloadButton;
