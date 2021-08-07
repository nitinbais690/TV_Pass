import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    AccessibilityProps,
    Animated,
    TextInput,
    View,
    TouchableOpacity,
    Easing,
    Text,
    Platform,
    Keyboard,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { formStyle } from 'styles/Common.style';
import { FloatingLabelInputStyle } from 'styles/FloatingLabelInput.style';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import RoundChecked from '../../../assets/images/roundChecked.svg';
import VisibilityOff from '../../../assets/images/visibility_off.svg';
import VisibilityOn from '../../../assets/images/visibility_on.svg';

export enum InputType {
    email = 'email',
    password = 'password',
}

interface FloatingLabelInputProps extends AccessibilityProps {
    label?: string;
    value: any;
    hint?: string;
    errorMessage?: string | null;
    inputType?: InputType;
    disabled?: boolean;
    isValid?: boolean;
    showLabel?: boolean;
    useActionSheet?: boolean;
    maxLength?: number;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    returnKeyType?: string;
    onSubmitEditing?: () => void;
    hasTVPreferredFocus?: boolean;
    isFocusable?: boolean;
    onFocus?: () => void;
}

const FloatingLabelInput = React.forwardRef(
    (props: FloatingLabelInputProps, ref: any): JSX.Element => {
        let { hasTVPreferredFocus, isFocusable } = props;
        const prefs = useAppPreferencesState();
        const inputRef = useRef();
        let { appColors, appPadding } = prefs.appTheme!(prefs);
        const formStyles = formStyle({ appColors, appPadding });

        const [isFocused, setFocus] = useState(false);
        const [secureTextEntry, setSecureTextEntry] = useState(true);
        const animatedIsFocused = new Animated.Value(props.value === '' ? 0 : 1);
        const styles: any = FloatingLabelInputStyle({ appColors, appPadding, isFocused });
        const useActionSheet = props.useActionSheet ? props.useActionSheet : false;
        const handleFocus = (isIos: boolean) => {
            if (Platform.isTV) {
                if (isIos) {
                    !inputRef.current.isFocus && inputRef.current && inputRef.current.focus();
                } else {
                    Platform.OS === 'android' &&
                        !inputRef.current.isFocus &&
                        inputRef.current &&
                        inputRef.current.focus();
                }
                setFocus(true);
            }
        };
        const handleBlur = () => {
            if (Platform.isTV) {
                Platform.OS === 'android' && inputRef.current && inputRef.current.blur();
                setFocus(false);
            }
            if (props.onBlur) {
                props.onBlur();
            }
        };

        const animatedLabelStyle = {
            paddingLeft: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [5, 5],
            }),
            paddingRight: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 4],
            }),
            top: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [15, 5],
            }),
            fontSize: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 14],
            }),
            opacity: animatedIsFocused.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [1, 1, 0],
            }),
            zIndex: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
        };

        const animatedPadding = {
            paddingTop: animatedIsFocused.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 20, 0],
            }),
        };

        useEffect(() => {
            Animated.timing(animatedIsFocused, {
                toValue: !isFocused && props.value !== '' && !props.showLabel ? 2 : isFocused ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isFocused]);

        const onRef = useCallback(ref => {
            if (ref) {
                inputRef.current = ref;
            }
        }, []);

        useEffect(() => {
            isFocusable !== undefined && setFocus(isFocusable);
        }, [isFocusable]);

        return (
            <>
                <View style={[formStyles.inputContainer, Platform.isTV ? undefined : styles.container]}>
                    {!Platform.isTV && (
                        <Animated.Text style={[styles.labelStyle, animatedLabelStyle]}>{props.label}</Animated.Text>
                    )}
                    {useActionSheet ? (
                        <TouchableHighlight
                            accessible={true}
                            hasTVPreferredFocus={true}
                            style={[animatedPadding, styles.inputTextContainer]}>
                            <TextInput
                                style={[formStyles.inputs, styles.inputText]}
                                autoCapitalize={props.inputType === InputType.email ? 'none' : 'sentences'}
                                secureTextEntry={props.inputType === InputType.password ? secureTextEntry : false}
                                placeholderTextColor={appColors.tertiary}
                                keyboardType={props.inputType === InputType.email ? 'email-address' : 'default'}
                                returnKeyType={props.returnKeyType || 'next'}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                autoCorrect={false}
                                value={props.value}
                                onChangeText={props.onChangeText}
                                editable={!props.disabled}
                                onSubmitEditing={props.onSubmitEditing}
                            />
                        </TouchableHighlight>
                    ) : Platform.isTV ? (
                        <TouchableOpacity
                            hasTVPreferredFocus={hasTVPreferredFocus}
                            activeOpacity={1}
                            ref={ref}
                            onPress={() => handleFocus(Platform.OS === 'ios')}
                            style={[formStyles.inputsTv, isFocused && formStyles.inputFocusTv]}
                            onFocus={() => {
                                props.onFocus && props.onFocus();
                                handleFocus();
                            }}>
                            <TextInput
                                ref={onRef}
                                activeOpacity={0}
                                // hasTVPreferredFocus={hasTVPreferredFocus}
                                style={[Platform.isTV ? formStyles.inputsTv : formStyles.inputs, styles.inputText]}
                                autoCapitalize={props.inputType === InputType.email ? 'none' : 'sentences'}
                                secureTextEntry={props.inputType === InputType.password ? secureTextEntry : false}
                                placeholderTextColor={appColors.tertiary}
                                keyboardType={props.inputType === InputType.email ? 'email-address' : 'default'}
                                maxLength={props.maxLength}
                                returnKeyType={props.returnKeyType || 'next'}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                autoCorrect={false}
                                value={props.value}
                                onChangeText={props.onChangeText}
                                editable={!props.disabled}
                                onSubmitEditing={() => {
                                    setFocus(false);
                                    props.onSubmitEditing && props.onSubmitEditing();
                                    Platform.OS === 'android' && Keyboard.dismiss();
                                }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            hasTVPreferredFocus={hasTVPreferredFocus}
                            activeOpacity={1}
                            ref={ref}
                            onPress={() => handleFocus(Platform.isTV && Platform.OS === 'ios')}
                            style={[formStyles.inputsTv, isFocused && formStyles.inputFocusTv]}
                            onFocus={() => {
                                props.onFocus && props.onFocus();
                                handleFocus();
                            }}>
                            <TextInput
                                ref={onRef}
                                activeOpacity={0}
                                // hasTVPreferredFocus={hasTVPreferredFocus}
                                style={[Platform.isTV ? formStyles.inputsTv : formStyles.inputs, styles.inputText]}
                                autoCapitalize={props.inputType === InputType.email ? 'none' : 'sentences'}
                                secureTextEntry={props.inputType === InputType.password ? secureTextEntry : false}
                                placeholderTextColor={appColors.tertiary}
                                keyboardType={props.inputType === InputType.email ? 'email-address' : 'default'}
                                maxLength={props.maxLength}
                                returnKeyType={props.returnKeyType || 'next'}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                autoCorrect={false}
                                value={props.value}
                                onChangeText={props.onChangeText}
                                editable={!props.disabled}
                                onSubmitEditing={() => {
                                    setFocus(false);
                                    props.onSubmitEditing && props.onSubmitEditing();
                                    Platform.isTV && Platform.OS === 'android' && Keyboard.dismiss();
                                }}
                            />
                        </TouchableOpacity>
                    )}
                    {!Platform.isTV && props.isValid && props.value !== '' && props.inputType !== InputType.password ? (
                        <View style={[formStyles.passEyeView, styles.passEyeView]}>
                            <RoundChecked />
                        </View>
                    ) : null}
                    {!Platform.isTV && props.inputType === InputType.password && (
                        <View style={[formStyles.passEyeView, styles.passEyeView]}>
                            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                                {secureTextEntry ? <VisibilityOff /> : <VisibilityOn />}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {props.hint && props.hint.length > 0 ? (
                    <View style={[styles.hintContainer]}>
                        <Text style={styles.textHint}>{props.hint}</Text>
                    </View>
                ) : null}
                {props.errorMessage && props.errorMessage.length > 0 ? (
                    <View style={[styles.hintContainer]}>
                        <Text style={styles.errorMessageText}>{props.errorMessage}</Text>
                    </View>
                ) : null}
            </>
        );
    },
);

export default FloatingLabelInput;
