import React from 'react';
import { StyleSheet } from 'react-native';
import DownloadList from './DownloadList';
import BackgroundGradient from 'screens/components/BackgroundGradient';

const SeriesDownloadScreen = ({ route }: any): JSX.Element => {
    const styles = StyleSheet.create({
        container: { flex: 1 },
    });

    const series = route.params;

    return (
        <BackgroundGradient style={styles.container} insetHeader={false} insetTabBar={true}>
            {series && series.episodes && <DownloadList downloads={series.episodes} />}
        </BackgroundGradient>
    );
};

export default SeriesDownloadScreen;
