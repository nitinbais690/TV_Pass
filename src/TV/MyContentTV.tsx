import React from 'react';
import PurchasedScreen from '../screens/MyContent/PurchasedScreen';
import { StyleSheet, View } from 'react-native';
import Menu from './components/Menu';
import BackgroundGradient from '../screens/components/BackgroundGradient';

const MyContentTV = (): JSX.Element => {
    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <>
            <BackgroundGradient insetHeader={false}>
                <View style={styles.container}>
                    <PurchasedScreen />
                </View>
                <Menu />
            </BackgroundGradient>
        </>
    );
};

export default MyContentTV;
