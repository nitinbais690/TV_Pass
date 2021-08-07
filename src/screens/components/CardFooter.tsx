import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../../AppStyles';
//import { AspectRatio, ImageType } from 'qp-common-ui';

const CardFooter = ({ resource }: { resource: ResourceVm }) => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme!(prefs);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'hidden',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            paddingHorizontal: 10,
            paddingVertical: 10,
        },
        title: {
            fontSize: appFonts.xs,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.secondary,
        },
        subtitle: {
            fontSize: appFonts.xxs,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.tertiary,
            flexWrap: 'wrap',
            textTransform: 'capitalize',
        },
        caption: {
            fontSize: appFonts.xxs,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.caption,
            flexWrap: 'wrap',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        pillWrapper: {
            flexDirection: 'row',
            marginHorizontal: 4,
            marginVertical: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        pillTextWrapper: {
            flexDirection: 'row',
            marginVertical: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: appColors.brandTint,
            borderRadius: 12,
            paddingHorizontal: 5,
        },
        pillText: {
            color: appColors.secondary,
            fontFamily: appFonts.semibold,
            fontSize: appFonts.xxs,
            fontWeight: '500',
            marginLeft: 1,
            textTransform: 'capitalize',
        },
        pillTextPadding: {
            padding: 4,
        },
        gradient: {
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
        },
        progressContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: appColors.caption,
            zIndex: 1000,
        },
        progress: {
            backgroundColor: '#fff',
            height: '100%',
        },
        logoContainer: {
            alignItems: 'flex-end',
        },
        logo: {
            aspectRatio: 16 / 9,
            minHeight: 20,
        },
    });

    let minsLeft;
    if (resource.completedPercent !== undefined && resource.runningTime) {
        const timeleft = Math.ceil(
            (resource.runningTime - resource.runningTime * (resource.completedPercent / 100)) / 60,
        );
        if (timeleft <= 1) {
            minsLeft = strings['my_content.continue_watching_min_left'];
        } else {
            minsLeft = strings.formatString(strings['my_content.continue_watching_mins_left'], timeleft) as string;
        }
    }

    return (
        <View style={styles.container}>
            {resource.showFooterTitles && (
                <View style={{ paddingVertical: 0, paddingHorizontal: 5 }}>
                    <Text numberOfLines={1} style={styles.title}>
                        {resource.title}
                    </Text>
                    {resource.subtitle !== undefined ? (
                        <>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subtitle}>
                                {resource.subtitle}
                            </Text>
                            {minsLeft && <Text style={styles.caption}>{minsLeft}</Text>}
                        </>
                    ) : (
                        <>
                            {minsLeft && <Text style={styles.caption}>{minsLeft}</Text>}
                            <Text style={styles.caption} />
                        </>
                    )}
                </View>
            )}
            <View style={styles.footer}>
                {resource.expiresIn && (
                    <View style={styles.pillTextWrapper}>
                        <Text style={[styles.pillText, styles.pillTextPadding]}>{resource.expiresIn}</Text>
                    </View>
                )}
                {/* <View>
                    {!resource.expiresIn &&
                        resource.credits &&
                        (userType != 'SUBSCRIBED' || resource.credits === 'tvod') && (
                            <Pill>
                                <View style={styles.pillWrapper}>
                                    <Text style={styles.pillText}>{resource.credits}</Text>
                                </View>
                            </Pill>
                        )}
                </View> */}
                {/* {resource.providerName && (
                    <View style={styles.logoContainer}>
                        <ResizableImage
                            keyId={(resource.providerName && resource.providerName.toLowerCase()) || ''}
                            style={styles.logo}
                            imageType={ImageType.Logo}
                            aspectRatioKey={AspectRatio._16by9}
                        />
                    </View>
                )} */}
            </View>
        </View>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return (
        prevProps.resource.id === nextProps.resource.id &&
        prevProps.resource.expiresIn === nextProps.resource.expiresIn &&
        prevProps.resource.completedPercent === nextProps.resource.completedPercent
    );
};

export default React.memo(CardFooter, propsAreEqual);
