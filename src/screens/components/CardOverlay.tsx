import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ResourceVm, ResizableImage } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import ResumeIcon from '../../../assets/images/resume.svg';
import { AspectRatio, ImageType } from 'qp-common-ui';
import LinearGradient from 'react-native-linear-gradient';
import { appFonts, appFontStyle, appPaddingValues } from 'core/styles/AppStyles';
import CardTagsOverlay from 'features/discovery/presentation/components/molecules/CardTagsOverlay';

const CardOverlay = ({ resource }: { resource: ResourceVm }) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        },
        title: {
            fontSize: appFonts.xlg,
            fontFamily: appFonts.primary,
            fontWeight: '300',
            color: appColors.secondary,
        },
        subtitle: {
            fontSize: appFonts.xxs,
            fontFamily: appFonts.primary,
            fontWeight: '500',
            color: appColors.tertiary,
            flexWrap: 'wrap',
            marginBottom: appPadding.xs(),
            textTransform: 'capitalize',
        },
        footer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
        },
        serviceText: {
            color: appColors.secondary,
            fontFamily: appFonts.semibold,
            fontSize: appFonts.xxs,
            flex: 1,
        },
        pillWrapper: {
            flex: 1,
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
            backgroundColor: appColors.primaryVariant4,
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
        resumeIcon: {
            position: 'absolute',
            bottom: 10,
            left: 13,
        },
        progressContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: appColors.caption,
        },
        progress: {
            backgroundColor: appColors.brandTint,
            height: '100%',
        },
        logoContainer: {
            flex: 1,
            alignItems: 'flex-end',
        },
        logo: {
            flex: 1,
            aspectRatio: 16 / 9,
            minHeight: 20,
        },
        bannerGradiant: {
            width: '100%',
            height: '100%',
        },
        bannerOverlay: {
            width: '100%',
            height: '40%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingLeft: appPaddingValues.sm,
            paddingBottom: appPaddingValues.xs,
        },
        bannerOverlayText: {
            color: appColors.secondary,
            ...appFontStyle.body3,
            fontFamily: appFonts.semibold,
        },
    });

    return (
        <View style={styles.container}>
            {
                <>
                    <View style={styles.footer}>
                        {resource.expiresIn && (
                            <View style={styles.pillTextWrapper}>
                                <Text style={[styles.pillText, styles.pillTextPadding]}>{resource.expiresIn}</Text>
                            </View>
                        )}
                        {(resource.layout === 'banner' || resource.size === 'large') && (
                            <LinearGradient
                                style={styles.bannerGradiant}
                                locations={[0.2, 0.9]}
                                useAngle={true}
                                angle={2.23}
                                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}>
                                <CardTagsOverlay
                                    isOriginals={resource.isOriginals}
                                    isPremium={!resource.isFreeContent}
                                />
                                <View style={styles.bannerOverlay}>
                                    <Text style={styles.bannerOverlayText}>{resource.title}</Text>
                                </View>
                            </LinearGradient>
                        )}
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
                </>
            }
            {resource.completedPercent !== undefined && (
                <>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progress, { width: `${resource.completedPercent}%` }]} />
                    </View>
                    <View style={styles.resumeIcon}>
                        <ResumeIcon />
                    </View>
                </>
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

export default React.memo(CardOverlay, propsAreEqual);
