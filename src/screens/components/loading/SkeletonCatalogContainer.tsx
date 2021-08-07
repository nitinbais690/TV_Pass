import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import SkeletonCard, { SkeletonCardProps } from './SkeletonCard';
import { selectDeviceType } from 'qp-common-ui';

interface SkeletonCatalogContainerProps extends SkeletonCardProps {
    showContainerLabel?: boolean;
    count: number;
}

const SkeletonCatalogContainer = (props: SkeletonCatalogContainerProps) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);
    const { width } = useDimensions().window;

    const styles = StyleSheet.create({
        container: {
            marginTop: props.layout === 'banner' ? 5 : selectDeviceType({ Handset: appPadding.md() }, appPadding.xs()),
            paddingLeft: appPadding.sm(true),
            marginLeft: 0,
            paddingBottom: selectDeviceType({ Handset: 5 }, 15),
        },
        header: {
            position: 'relative',
            width: 100,
            height: 10,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        listContainer: { flexDirection: 'row', width: width, marginTop: 14 },
    });

    return (
        <View style={styles.container}>
            {props.showContainerLabel && <View style={styles.header} />}
            <View style={styles.listContainer}>
                {[...Array(props.count).keys()].map((n, i) => (
                    <SkeletonCard {...props} key={`${i}`} />
                ))}
            </View>
        </View>
    );
};

export default React.memo(SkeletonCatalogContainer);
