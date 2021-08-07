import React from 'react';
import PopUp from 'core/presentation/components/molecules/PopUp';
import CommonTitle from 'core/presentation/components/atoms/CommonTitle';
import FastImage from 'react-native-fast-image';
import { Text, View } from 'react-native';
import { welcomeBannerStyle } from './styles';
import { appFontStyle } from 'core/styles/AppStyles';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { useLocalization } from 'contexts/LocalizationContext';
import AsyncStorage from '@react-native-community/async-storage';
import { SHOW_WELCOME_BANNER } from 'features/authentication/utils/auth-constants';

export default function WelcomeBanner() {
    const styles = welcomeBannerStyle(useAppColors());
    const { strings } = useLocalization();
    AsyncStorage.setItem(SHOW_WELCOME_BANNER, '');
    return (
        <PopUp onModelClosed={() => {}}>
            <View style={styles.container}>
                <View>
                    <CommonTitle
                        style={styles.titleStyle}
                        text={strings['welcome.banner_title']}
                        showThemedDot={false}
                        showAhaLogo={true}
                    />
                    <Text style={[appFontStyle.subTitle, styles.descTextStyle]}>
                        {strings['welcome.banner_description']}
                    </Text>
                </View>
                <FastImage
                    source={require('assets/images/welcome_banner_bg.png')}
                    style={[styles.welcomeBannerBgStyle, styles.bannerImageStyle]}
                />

                <FastImage
                    source={require('assets/images/welcome_banner_image.png')}
                    style={[styles.welcomeBannerImageStyle, styles.bannerImageStyle]}
                />
            </View>
        </PopUp>
    );
}
