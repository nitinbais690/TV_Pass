import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useSafeArea } from 'react-native-safe-area-context';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { modalHeaderHeight } from 'screens/components/ModalOverlay';
import { selectDeviceType } from 'qp-common-ui';

const SkeletonDetailsScreen = () => {
    const insets = useSafeArea();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);
    const { width } = useDimensions().window;
    const marginLeft = appPadding.sm(true);

    const styles = StyleSheet.create({
        container: { marginTop: modalHeaderHeight(insets), flex: 1 },
        header: {
            width: '100%',
            aspectRatio: 16 / 9,
            backgroundColor: appColors.primaryVariant1,
        },
        titleCtaWrapper: {
            flexDirection: selectDeviceType({ Handset: 'column' }, 'row-reverse'),
            marginTop: 20,
            marginBottom: 10,
            marginHorizontal: marginLeft,
            justifyContent: 'space-between',
        },
        cta: {
            width: selectDeviceType({ Handset: '90%' }, '40%'),
            height: 32,
            borderRadius: 22,
            backgroundColor: appColors.primaryVariant1,
            marginBottom: selectDeviceType({ Handset: 20 }, 0),
        },
        title: {
            width: '40%',
            height: 30,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        desc1: {
            width: '80%',
            height: 10,
            marginLeft: marginLeft,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        desc2: {
            width: '30%',
            height: 10,
            marginLeft: marginLeft,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        listContainer: { flexDirection: 'row', width: width, marginTop: 14 },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header} />
            <View style={styles.titleCtaWrapper}>
                <View style={styles.cta} />
                <View style={styles.title} />
            </View>
            <View style={styles.desc1} />
            <View style={styles.desc1} />
            <View style={styles.desc2} />
        </View>
    );
};

export default React.memo(SkeletonDetailsScreen);
