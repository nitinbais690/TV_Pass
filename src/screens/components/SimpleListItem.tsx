import { ViewProps, GestureResponderEvent, View, Text, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
    rowContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: 8,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
        padding: 8,
    },
    titleTextStyle: { fontSize: 20, padding: 4 },
    subtitle1TextStyle: { fontSize: 18, padding: 4 },
    subtitle2TextStyle: { fontSize: 14, padding: 4 },
    rightIconContainer: {
        flex: 0,
        alignSelf: 'center',
    },
    rightIconStyle: {
        flex: 0,
        alignSelf: 'flex-start',
        padding: 4,
    },
    leftIconContainer: {
        flex: 0,
        alignSelf: 'center',
    },
    leftIconStyle: {
        flex: 0,
        alignSelf: 'flex-start',
        padding: 4,
    },
});
export interface SimpleListItemProps extends ViewProps {
    title: string;
    subtitle1?: string;
    subtitle2?: string;
    color?: string;
    backgroundColor?: string;
    underlayColor?: string;
    onPress?: (event: GestureResponderEvent) => void;
    leftComponent?: (props: any) => React.ReactNode | null;
    rightComponent?: (props: any) => React.ReactNode | null;
    //React.ComponentType<any> | null
}

export const SimpleListItem = (props: SimpleListItemProps) => {
    return (
        // Row
        <TouchableHighlight onPress={props.onPress} activeOpacity={0.5} underlayColor={props.underlayColor}>
            <View
                style={{
                    ...props,
                    ...styles.rowContainer,
                }}>
                {/* Column - Left Icon */}
                {props.leftComponent && (
                    <View style={styles.leftIconContainer}>
                        {props.leftComponent({ ...props, style: styles.leftIconStyle })}
                    </View>
                )}
                {/* Column - Text */}
                <View style={styles.textContainer}>
                    <Text style={{ ...styles.titleTextStyle, color: props.color }}>{props.title}</Text>
                    {props.subtitle1 && (
                        <Text style={{ ...styles.subtitle1TextStyle, color: props.color }}>{props.subtitle1}</Text>
                    )}
                    {props.subtitle2 && (
                        <Text style={{ ...styles.subtitle2TextStyle, color: props.color }}>{props.subtitle2}</Text>
                    )}
                </View>
                {/* Column - Right Icon */}
                {props.rightComponent && (
                    <View style={styles.rightIconContainer}>
                        {props.rightComponent({ ...props, style: styles.rightIconStyle })}
                    </View>
                )}
            </View>
        </TouchableHighlight>
    );
};
