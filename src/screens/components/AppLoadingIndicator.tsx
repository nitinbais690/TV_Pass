import React from 'react';
import { StyleProp, ViewStyle, View, PixelRatio, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { selectDeviceType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { Button as RNEButton } from 'react-native-elements';
import CloseIcon from '../../../assets/images/close.svg';
import { useNavigation } from '@react-navigation/native';

export type Size = 'small' | 'large';

const AppLoadingIndicator = ({
    style,
    size = 'large',
    isClearable = false,
}: {
    style?: StyleProp<ViewStyle>;
    size?: Size;
    isClearable?: boolean;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appBaseStyles } = prefs.appTheme!(prefs);
    const small = selectDeviceType({ Handset: 50 }, 70) * PixelRatio.get();
    const large = selectDeviceType({ Handset: 100, Tv: 350 }, 140) * PixelRatio.get();
    const sizePx = size === 'large' ? large : small;
    const navigation = useNavigation();

    return (
        <View style={style ? style : appBaseStyles.loading}>
            {isClearable && (
                <View
                    style={{
                        position: 'absolute',
                        top: '5%',
                        right: '5%',
                        alignSelf: 'flex-end',
                    }}>
                    <RNEButton icon={CloseIcon} type="clear" onPress={() => navigation.goBack()} />
                </View>
            )}
            <LottieView
                source={
                    Platform.isTV
                        ? require('../../../assets/animations/Struum_Tv_Loader.json')
                        : require('../../../assets/animations/Struum_Loader.json')
                }
                autoPlay
                autoSize={false}
                style={{ width: sizePx, aspectRatio: 1 }}
            />
        </View>
    );
};

export default AppLoadingIndicator;
