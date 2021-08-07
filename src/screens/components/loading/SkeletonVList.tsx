import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

const SkeletonVList = ({ count, showTitle }: { count: number; showTitle?: boolean }) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);
    const { width } = useDimensions().window;
    const marginLeft = appPadding.sm(true);

    const styles = StyleSheet.create({
        container: { marginTop: 0 },
        rowContainer: { marginBottom: 30, flex: 1, flexDirection: 'row' },
        image: {
            width: '40%',
            aspectRatio: 16 / 9,
            marginLeft: marginLeft,
            marginRight: 10,
            backgroundColor: appColors.primaryVariant1,
            borderRadius: 12,
        },
        image1: {
            width: '100%',
            aspectRatio: 16 / 9,
            borderRadius: 12,
        },
        wrapper: {
            width: '40%',
            marginLeft: 10,
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        season: {
            width: '20%',
            height: 24,
            marginLeft: marginLeft,
            marginBottom: 20,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        title: {
            width: '100%',
            height: 14,
            marginBottom: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        title1: {
            width: '80%',
            height: 14,
            marginBottom: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        desc1: {
            width: '100%',
            height: 8,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        desc2: {
            width: '30%',
            height: 8,
            marginTop: 8,
            borderRadius: 2,
            backgroundColor: appColors.primaryVariant1,
        },
        listContainer: { flexDirection: 'column', width: width, marginTop: 14 },
    });

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                {showTitle && <View style={styles.season} />}
                {[...Array(count).keys()].map((_, i) => (
                    <View style={styles.rowContainer} key={`${i}`}>
                        <View style={styles.image}>
                            <View style={styles.image1} />
                        </View>
                        <View style={styles.wrapper}>
                            <View>
                                <View style={styles.title} />
                                <View style={styles.title1} />
                            </View>
                            <View>
                                <View style={styles.desc1} />
                                <View style={styles.desc2} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default React.memo(SkeletonVList);
