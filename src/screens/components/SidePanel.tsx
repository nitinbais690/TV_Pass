import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';

export const SidePanel = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
        },
        emptyContianer: {
            flex: 1,
        },
        containerContainer: {
            flex: 1,
            elevation: 30,
        },
    });

    return (
        <>
            {Platform.isTV ? (
                <View style={styles.container}>
                    <View style={styles.emptyContianer} />
                    <View style={styles.containerContainer}>{children}</View>
                </View>
            ) : (
                <>{children}</>
            )}
        </>
    );
};
