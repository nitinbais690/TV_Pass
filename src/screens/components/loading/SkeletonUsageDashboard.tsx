import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { selectDeviceType } from 'qp-common-ui';

const SkeletonUsageDashboard = () => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);
    const marginLeft = appPadding.sm(true);

    const styles = StyleSheet.create({
        rootContainer: {
            marginHorizontal: selectDeviceType({ Tablet: 40 }, 20),
            marginVertical: selectDeviceType({ Tablet: 30 }, 15),
            paddingVertical: selectDeviceType({ Tablet: 20 }, 10),
            borderRadius: 22,
            backgroundColor: 'rgba(39, 56, 78, 0.5)',
        },
        container: {
            paddingLeft: selectDeviceType({ Tablet: 40 }, 20),
            paddingRight: selectDeviceType({ Tablet: 40 }, 20),
        },
        tagline: {
            color: appColors.secondary,
        },
        countValueText: {
            color: appColors.brandTint,
        },
        creditsUsage: {
            alignContent: 'center',
            flexDirection: 'row',
            borderRadius: 10,
            marginLeft: selectDeviceType({ Tablet: 40 }, 20),
            marginRight: selectDeviceType({ Tablet: 40 }, 20),
            margin: 20,
            justifyContent: 'space-between',
        },
        creditsUsageTitle: {
            width: '40%',
            height: 10,
            marginLeft: marginLeft,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        creditsUsageCount: {
            width: 28,
            height: 18,
            borderRadius: 12,
            backgroundColor: appColors.primaryVariant1,
        },

        divider: {
            height: 1,
            backgroundColor: '#2E4259',
            marginTop: 0,
        },

        barContainer: {
            height: selectDeviceType({ Tablet: 480 }, 170),
        },
        barWrapper: {
            paddingVertical: selectDeviceType({ Tablet: 20 }, 2),
        },
        recContainer: {
            height: selectDeviceType({ Tablet: 200 }, 160),
            justifyContent: 'space-between',
            padding: 10,
        },
        usageTitle1: {
            width: '20%',
            height: 10,
            marginLeft: marginLeft,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        usageTitle2: {
            width: '60%',
            height: 10,
            marginLeft: marginLeft,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        title1: {
            width: '20%',
            height: 10,
            marginLeft: marginLeft,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        title2: {
            width: '40%',
            height: 10,
            marginLeft: marginLeft,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        title3: {
            width: '60%',
            height: 10,
            marginLeft: marginLeft,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        titleBtn: {
            width: selectDeviceType({ Handset: '90%' }, '40%'),
            height: 32,
            borderRadius: 22,
            backgroundColor: appColors.primaryVariant1,
            marginLeft: marginLeft,
            marginBottom: selectDeviceType({ Handset: 20 }, 0),
        },
    });

    return (
        <>
            <View style={styles.rootContainer}>
                <View style={styles.creditsUsage}>
                    <View style={styles.creditsUsageTitle} />
                    <View style={styles.creditsUsageCount} />
                </View>
                <View style={styles.container}>
                    <View style={styles.divider} />
                    <View style={styles.barContainer}>
                        {[1, 2, 3, 4].map(index => (
                            <View style={styles.barWrapper} key={index}>
                                <View style={styles.usageTitle1} />
                                <View style={styles.usageTitle2} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <View style={styles.rootContainer}>
                <View style={styles.container}>
                    <View style={styles.recContainer}>
                        <View style={styles.title1} />
                        <View style={styles.title2} />
                        <View style={styles.title3} />
                        <View style={styles.titleBtn} />
                    </View>
                </View>
            </View>
        </>
    );
};

export default React.memo(SkeletonUsageDashboard);
