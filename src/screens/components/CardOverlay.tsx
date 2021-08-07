import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ResourceVm, ResizableImage, Category } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';
import { Pill } from './Pill';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import ResumeIcon from '../../../assets/images/resume.svg';
import { AspectRatio, ImageType } from 'qp-common-ui';

const CardOverlay = ({ resource }: { resource: ResourceVm }) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors, appPadding } = appTheme!(prefs);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            padding: 10,
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
        },
        pillTextPadding: {
            padding: 4,
        },
        gradient: {
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            bottom: -1,
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
    });

    return (
        <View style={styles.container}>
            {resource.layout === 'banner' && (
                <>
                    <LinearGradient
                        locations={[0, 1]}
                        colors={['transparent', 'rgba(0, 0, 0, 1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.gradient}
                    />
                    <View style={styles.footer}>
                        {resource.expiresIn && (
                            <View style={styles.pillTextWrapper}>
                                <Text style={[styles.pillText, styles.pillTextPadding]}>{resource.expiresIn}</Text>
                            </View>
                        )}
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
            )}
            {resource.completedPercent !== undefined && (
                <>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progress, { width: `${resource.completedPercent}%` }]} />
                    </View>
                    {(resource.showPlayerIcon === undefined ||
                        (resource.showPlayerIcon !== undefined && resource.showPlayerIcon)) && (
                        <View style={styles.resumeIcon}>
                            <ResumeIcon />
                        </View>
                    )}
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
