import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { appPadding } from '../../../AppStyles';
import { UserProfileView } from '../settings/UserProfileView';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';

export const userProfileScreen = ({ navigation }: { navigation: any }) => {
    const styles = StyleSheet.create({
        root: {
            flex: 1,
            marginTop: appPadding.xxxl(),
        },
    });

    return (
        <BackgroundGradient insetTabBar={true}>
            <SafeAreaView style={styles.root}>
                {<UserProfileView horizontal={false} numColumns={3} navigation={navigation} />}
            </SafeAreaView>
        </BackgroundGradient>
    );
};
