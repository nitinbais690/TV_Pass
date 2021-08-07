import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ResourceVm, ResizableImage, Category } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts } from '../../../AppStyles';
import { Pill } from './Pill';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import { AspectRatio, ImageType } from 'qp-common-ui';

const CardFooter = ({ resource }: { resource: ResourceVm }) => {
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme!(prefs);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
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
            color: appColors.secondary,
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
        pillContainer: {
            justifyContent: 'center',
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
            minHeight: 25,
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
            <View style={styles.footer}>
                {resource.expiresIn && (
                    <View style={styles.pillTextWrapper}>
                        <Text style={[styles.pillText, styles.pillTextPadding]}>{resource.expiresIn}</Text>
                    </View>
                )}
                <View style={styles.pillContainer}>
                    {!resource.expiresIn && (
                        <Pill>
                            <View style={styles.pillWrapper}>
                                <CreditsIcon width={12} height={12} />
                                {resource.type !== Category.TVSeries && !!resource.credits && (
                                    <Text style={styles.pillText}>{resource.credits}</Text>
                                )}
                            </View>
                        </Pill>
                    )}
                </View>
                {resource.providerName && (
                    <View style={styles.logoContainer}>
                        <ResizableImage
                            keyId={(resource.providerName && resource.providerName.toLowerCase()) || ''}
                            style={styles.logo}
                            imageType={ImageType.Logo}
                            aspectRatioKey={AspectRatio._16by9}
                        />
                    </View>
                )}
            </View>
            {(resource.showFooterTitles || resource.type === Category.TVEpisode) && (
                <View style={{ paddingVertical: 5, paddingHorizontal: 5 }}>
                    <Text numberOfLines={1} style={styles.title}>
                        {resource.title}
                    </Text>
                    {resource.subtitle !== undefined ? (
                        <>
                            <Text numberOfLines={1} style={styles.subtitle}>
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
