import React, { useEffect, useState } from 'react';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Text, View } from 'react-native';
import { defaultPasswordStrengthMetertyle } from 'styles/PasswordStrengthMeter.style';
import zxcvbn from 'zxcvbn';
import { useLocalization } from 'contexts/LocalizationContext';

const hasNumber = (value: string) => {
    return new RegExp(/[0-9]/).test(value);
};
const hasMixed = (value: string) => {
    return new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);
};
const hasSpecial = (value: string) => {
    return new RegExp(/[!#@$%^&*?)(+=._-]/).test(value);
};

const strengthIndicator = (value: string) => {
    let strengths = 0;

    if (value.length > 5) {
        if (hasNumber(value)) {
            strengths++;
        }

        if (hasSpecial(value)) {
            strengths++;
        }

        if (hasMixed(value)) {
            strengths++;
        }
        if (zxcvbn(value).score >= 4) {
            strengths++;
        }
        strengths = strengths || 1;
    } else if (value.length > 0) {
        strengths = 1;
    }

    // if (value.length > 0 && hasNumber(value) && hasSpecial(value) && hasMixed(value)) {
    //     strengths = zxcvbn(value).score;
    // }

    return strengths;
};

const passwordError = (value: string): string => {
    let errorMsg = '';

    if (value.length < 6) {
        errorMsg = 'min_length_error';
    } else if (!hasNumber(value)) {
        errorMsg = 'number_error';
    } else if (!hasSpecial(value)) {
        errorMsg = 'special_char_error';
    } else if (!hasMixed(value)) {
        errorMsg = 'mixed_char_error';
    }

    return errorMsg;
};

const curPassStrength = (scoreVal: number, barType: string = ''): string => {
    let output = '';
    if (barType === 'Weak') {
        if (scoreVal === 1 || scoreVal === 2) {
            output = 'Weak';
        }
        if (scoreVal === 3) {
            output = 'Average';
        }
        if (scoreVal === 4) {
            output = 'Secure';
        }
    }
    if (barType === 'Average') {
        if (scoreVal === 3) {
            output = 'Average';
        }
        if (scoreVal === 4) {
            output = 'Secure';
        }
    }
    if (barType === 'Secure') {
        if (scoreVal === 4) {
            output = 'Secure';
        }
    }

    return output;
};

const PasswordStrengthMeter = ({ password = '' }: { password: string }): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors, appPadding } = prefs.appTheme!(prefs);
    const { strings }: any = useLocalization();
    const styles: any = defaultPasswordStrengthMetertyle({ appColors, appPadding });
    const [score, setScore] = useState(0);

    useEffect(() => {
        const strength = strengthIndicator(password);
        setScore(strength);
        // eslint-disable-next-line
    }, [password]);

    let WeakPass = curPassStrength(score, 'Weak');
    let avgPass = curPassStrength(score, 'Average');
    let securePass = curPassStrength(score, 'Secure');

    return (
        <>
            <View style={styles.barContainer}>
                <View style={[styles.bar, WeakPass !== '' && styles['bar' + WeakPass]]} />
                <View style={[styles.bar, avgPass !== '' && styles['bar' + avgPass]]} />
                <View style={[styles.bar, securePass !== '' && styles['bar' + securePass]]} />
            </View>
            <View style={styles.barTextContainer}>
                <Text style={styles.barText}>{strings['password.weak']}</Text>
                <Text style={styles.barText}>{strings['password.secure']}</Text>
            </View>
        </>
    );
};
export default PasswordStrengthMeter;

export const getPasswordScore = (password = ''): number => {
    return strengthIndicator(password);
};

export const getPasswordError = (password = ''): string => {
    return passwordError(password);
};
