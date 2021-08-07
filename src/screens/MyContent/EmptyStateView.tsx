import React from 'react';
import { StyleSheet, Text, View, Platform, Image } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts, appPadding, tvPixelSizeForLayout, appDimensions } from '../../../AppStyles';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import FallBackGradientBackground from '../../../assets/images/backgroundRadianGradient.svg';
import LinearGradient from 'react-native-linear-gradient';

const EmptyStateView = ({ message }: { message: string }) => {
    const navigation = useNavigation();
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);

    const style = StyleSheet.create({
        container: {
            flex: 1,
            margin: appPadding.sm(true),
            paddingTop: 10,
        },
        containerTv: {
            flex: 1,
            marginHorizontal: tvPixelSizeForLayout(160),
            paddingTop: tvPixelSizeForLayout(120),
        },
        tagline: {
            color: Platform.isTV ? appColors.brandTint : appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: Platform.isTV ? tvPixelSizeForLayout(75) : appFonts.xlg,
            fontWeight: '600',
            paddingBottom: Platform.isTV ? tvPixelSizeForLayout(35) : 20,
            width: Platform.isTV ? tvPixelSizeForLayout(880) : undefined,
        },
        button: {
            color: Platform.isTV ? appColors.secondary : appColors.brandTint,
        },
        imageStyleTv: {
            right: 0,
            marginTop: tvPixelSizeForLayout(50),
            position: 'absolute',
            height: tvPixelSizeForLayout(981),
            width: tvPixelSizeForLayout(1328),
        },
        imageContainerTv: {
            position: 'absolute',
            height: appDimensions.fullHeight,
            width: appDimensions.fullWidth,
            zIndex: 0,
        },
    });

    return (
        <>
            {Platform.isTV && (
                <View style={style.imageContainerTv}>
                    <Image
                        source={require('../../../assets/images/empty_content_background.png')}
                        style={style.imageStyleTv}
                    />

                    <LinearGradient
                        colors={[appColors.primary, appColors.primaryVariant4]}
                        useAngle={true}
                        angle={90}
                        locations={[0.5, 0.7]}
                        style={StyleSheet.absoluteFill}
                    />
                </View>
            )}
            <View style={[Platform.isTV ? style.containerTv : style.container]}>
                <Text style={style.tagline}>{message}</Text>
                <BorderlessButton onPress={() => navigation.navigate(NAVIGATION_TYPE.BROWSE)}>
                    <Text style={[style.tagline, style.button]}>{strings['my_content.browse_cta']}</Text>
                </BorderlessButton>
            </View>

            {Platform.isTV && (
                <View style={style.imageContainerTv}>
                    <FallBackGradientBackground height={'100%'} width={'100%'} />
                </View>
            )}
        </>
    );
};

export default EmptyStateView;
