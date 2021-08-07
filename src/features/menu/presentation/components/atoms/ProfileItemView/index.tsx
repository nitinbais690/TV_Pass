import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import {
    ProfileItemViewStyle,
    selectedGradientEnd,
    selectedGradientStart,
    unselectedGradientEnd,
    unselectedGradientStart,
} from './style';
import ProfileIcon from 'assets/images/profile_icon.svg';
import LinearGradient from 'react-native-linear-gradient';

export default function ProfileItemView(props: ProfileItemViewProps) {
    const appPref = useAppPreferencesState();
    const { appTheme } = appPref;
    let { appColors } = appTheme && appTheme(appPref);

    const style = ProfileItemViewStyle(appColors);

    return (
        <TouchableOpacity onPress={props.onPress} style={style.mainContainer}>
            <View style={style.container}>
                <LinearGradient
                    colors={
                        props.isSelectedItem
                            ? [selectedGradientStart, selectedGradientEnd]
                            : [unselectedGradientStart, unselectedGradientEnd]
                    }
                    style={[style.gradientContainer]}
                    angle={-180}
                    useAngle={true}>
                    <View style={style.iconStyle}>
                        <ProfileIcon />
                    </View>
                </LinearGradient>
            </View>
            <Text style={style.textStyle}>{props.profileName}</Text>
        </TouchableOpacity>
    );
}

interface ProfileItemViewProps {
    profileName: string;
    isSelectedItem: boolean;
    onPress: () => void;
}
