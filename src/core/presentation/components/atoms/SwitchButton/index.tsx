import React, { useCallback, useEffect, useState } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { buttonStyle } from './styles';
import LinearGradient from 'react-native-linear-gradient';

export const SwitchButton = (props: SwitchButtonProps) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const [width, setWidth] = useState(0);

    const [state, setState] = useState({
        activeSwitch: 1,
        direction: 'ltr',
        offsetX: new Animated.Value(0),
    });

    const styles = buttonStyle(appColors, width);

    const _switchDirection = (direction: string): string => {
        return direction === 'rtl' ? 'row-reverse' : 'row';
    };

    const _switchThump = useCallback(
        (direction: string, skipCallback?: boolean) => {
            const { onValueChange } = props;
            let dirsign = 1;
            if (direction === 'rtl') {
                dirsign = -1;
            }

            if (state.activeSwitch === 1) {
                if (!skipCallback) {
                    onValueChange(props.secondaryButtonText);
                }
                setState(prevState => ({
                    ...prevState,
                    activeSwitch: 2,
                }));

                Animated.timing(state.offsetX, {
                    toValue: (width / 2) * dirsign,
                    duration: 100,
                    useNativeDriver: true,
                }).start();
            } else {
                if (!skipCallback) {
                    onValueChange(props.primaryButtonText);
                }
                setState(prevState => ({
                    ...prevState,
                    activeSwitch: 1,
                }));

                Animated.timing(state.offsetX, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }).start();
            }
        },
        [props, width, state.activeSwitch, state.offsetX],
    );

    useEffect(() => {
        if (props.activeSwitch === 2) {
            setState(prevState => ({
                ...prevState,
                activeSwitch: 2,
                offsetX: new Animated.Value((width / 2) * 1),
            }));
        }
    }, [props.activeSwitch, width]);

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                _switchThump(state.direction);
            }}>
            <View
                style={[styles.container, props.style]}
                onLayout={event => {
                    setWidth(event.nativeEvent.layout.width);
                }}>
                <LinearGradient
                    colors={['#2D3037', '#3B4046']}
                    start={{ x: 0, y: 0.8 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.gradientBackground]}
                />

                <View style={[{ flexDirection: _switchDirection(state.direction) }]}>
                    <Animated.View style={{ transform: [{ translateX: state.offsetX }] }}>
                        <View style={[styles.wayBtnActive]}>
                            <LinearGradient
                                colors={['rgba(78, 67, 63, 0.5)', 'rgba(255, 110, 69, 0.5)']}
                                start={{ x: 0.45, y: 0 }}
                                style={[styles.gradientBackground, styles.selectedGradient]}
                            />
                        </View>
                    </Animated.View>

                    <View style={[styles.textPos, styles.leftText]}>
                        <Text style={[styles.text, state.activeSwitch === 1 ? styles.textActive : styles.textInActive]}>
                            {props.primaryButtonText}
                        </Text>
                    </View>

                    <View style={[styles.textPos, styles.rightText]}>
                        <Text style={[styles.text, state.activeSwitch === 2 ? styles.textActive : styles.textInActive]}>
                            {props.secondaryButtonText}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

interface SwitchButtonProps {
    onValueChange: (state: string) => void;
    primaryButtonText: string;
    secondaryButtonText: string;
    activeSwitch: 1 | 2;
    style?: {};
}

export default SwitchButton;
