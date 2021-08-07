import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableHighlight, Platform } from 'react-native';
import { Category, ResizableImage, ResourceVm } from 'qp-discovery-ui';
import { AspectRatio, ImageType } from 'qp-common-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts, appPadding, tvPixelSizeForLayout } from '../../../AppStyles';
import { imageAspectRatio } from '../../styles/ContentDetails.style';
import { Pill } from '../../screens/components/Pill';
import CreditsIcon from '../../../assets/images/credits_small.svg';
import LinearGradient from 'react-native-linear-gradient';
import { NAVIGATION_TYPE } from '../../screens/Navigation/NavigationConstants';
import { useNavigation } from '@react-navigation/native';
import { useLocalization } from '../../contexts/LocalizationContext';
import FocusButton from '../../screens/components/FocusButton';
import { useTVODEntitlement } from '../../screens/hooks/useTVODEntitlement';
import { RedeemButton } from '../../screens/components/RedeemButton';

const HeroCarouselCardTV = ({
    resource,
    index,
    route,
    hasTVPreferredFocus,
    itemKey,
}: {
    resource: ResourceVm;
    index: number;
    route?: string;
    onResourcePress?: (resource: ResourceVm) => void;
    hasTVPreferredFocus?: boolean;
    itemKey: any;
    // fallbackAspectRatio?: AspectRatio;
    // containerSize?: { width: number; height: number };
    // cardsPreview?: number;
    // gridMode?: boolean;
}): JSX.Element => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme(prefs);
    const { height } = Dimensions.get('window');
    const navigation = useNavigation();
    const [isFocused, setFocused] = useState(false);
    const { strings, appLanguage } = useLocalization();

    let name = resource && resource.name;
    if (resource && resource.type === Category.TVEpisode) {
        name = `S${resource.seasonNumber} E${resource.episodeNumber}: ${resource.name}`;
    }

    let entitlementResponse = useTVODEntitlement(resource.id);

    const { loading: entitlementLoading, entitlement } = entitlementResponse;

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                heroTouchable: {
                    flex: 1,
                },
                gradient: {
                    position: 'absolute',
                    flex: 1,
                    width: '100%',
                },
                imageContainer: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                },
                imageStyle: {
                    flex: 1,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    height: '100%',
                    aspectRatio: AspectRatio._16by9,
                    zIndex: -1,
                    backgroundColor: appColors.primaryVariant2,
                },
                pillContainer: {
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: tvPixelSizeForLayout(225),
                    left: tvPixelSizeForLayout(190),
                    zIndex: 10,
                },
                movieDetailsContainer: {
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: tvPixelSizeForLayout(220),
                    left: tvPixelSizeForLayout(200),
                    zIndex: 10,
                },
                pillWrapper: {
                    flexDirection: 'row',
                    marginHorizontal: 4,
                    marginVertical: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                },
                pillTextWrapper: {
                    flexDirection: 'row',
                    marginVertical: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: appColors.brandTint,
                },
                pillText: {
                    color: appColors.secondary,
                    fontFamily: appFonts.semibold,
                    fontSize: appFonts.md,
                    fontWeight: '500',
                    marginLeft: 4,
                },
                pillTextPadding: {
                    padding: 6,
                },
                logoContainer: {
                    alignItems: 'flex-end',
                    position: 'absolute',
                    bottom: tvPixelSizeForLayout(230),
                    right: tvPixelSizeForLayout(100),
                    zIndex: 1,
                },
                logo: {
                    aspectRatio: 16 / 9,
                    minHeight: 40,
                },
                seriesTitleStyle: {
                    fontSize: appFonts.xs,
                    fontFamily: appFonts.primary,
                    color: appColors.secondary,
                    marginVertical: Platform.isTV ? 0 : 5,
                },
                titleStyle: {
                    fontSize: Platform.isTV ? appFonts.xxlg : appFonts.xxxlg,
                    fontFamily: appFonts.bold,
                    color: appColors.secondary,
                },
                caption1: {
                    fontSize: appFonts.xxs,
                    fontFamily: appFonts.primary,
                    color: appColors.secondary,
                    margin: 0,
                    marginTop: 0,
                    marginBottom: appPadding.xxs(true),
                    textTransform: 'none',
                },
                heroButtonsContainer: {
                    width: '50%',
                    flexDirection: 'row',
                },
                focusButtonContainer: {
                    width: '60%',
                    marginRight: 10,
                },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const resourceMetadata = (appLanguage: string, resource?: ResourceVm) => {
        const metaInfo = [];
        if (resource) {
            const ratings = resource.allRatings && Object.values(resource.allRatings);
            if (resource.releaseYear) {
                metaInfo.push(resource.releaseYear);
            }
            if (resource.contentGenre && resource.contentGenre[appLanguage]) {
                metaInfo.push(resource.contentGenre[appLanguage].join(', '));
            }
            if (ratings && ratings.length > 0 && ratings[0] && ratings[0].toUpperCase() !== 'UNRATED') {
                metaInfo.push(ratings[0]);
            }
            if (resource.formattedRunningTime) {
                metaInfo.push(resource.formattedRunningTime);
            }
        }
        return metaInfo.join(' - ');
    };

    const caption1String = resourceMetadata(appLanguage, resource);

    const handleNavigation = () => {
        const screenName = NAVIGATION_TYPE.CONTENT_DETAILS;
        navigation.navigate(screenName, {
            resource: resource,
            title: resource.name,
            resourceId: resource.id,
            resourceType: resource.type,
        });
    };

    return (
        <TouchableHighlight
            key={itemKey}
            activeOpacity={1.0}
            onPress={handleNavigation}
            onFocus={() => {
                setFocused(true);
            }}
            onBlur={() => {
                setFocused(false);
            }}
            underlayColor={appColors.secondary}
            hasTVPreferredFocus={hasTVPreferredFocus}
            style={styles.heroTouchable}>
            <>
                <View style={styles.imageContainer}>
                    <ResizableImage
                        keyId={resource.id}
                        style={[styles.imageStyle]}
                        imageType={ImageType.Poster}
                        aspectRatioKey={imageAspectRatio}
                        isPortrait={false}
                    />
                </View>
                {route === 'My Content' ? (
                    <View style={styles.movieDetailsContainer}>
                        <View>
                            {resource.seriesTitle && (
                                <Text style={[styles.seriesTitleStyle]}>{resource.seriesTitle}</Text>
                            )}
                            <Text style={[styles.titleStyle]}>{name}</Text>
                            <Text style={[styles.caption1]}>{caption1String}</Text>
                            <View style={styles.heroButtonsContainer}>
                                {!entitlementLoading && (
                                    <>
                                        <View style={styles.focusButtonContainer}>
                                            <FocusButton
                                                hasTVPreferredFocus={hasTVPreferredFocus && index == 4}
                                                title={strings['my_content.more_info']}
                                                onPress={() => handleNavigation()}
                                                isHasFocused={isFocused}
                                            />
                                        </View>
                                        <RedeemButton
                                            asset={resource}
                                            entitlement={entitlement}
                                            loading={entitlementLoading}
                                        />
                                    </>
                                )}
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.pillContainer}>
                        {!resource.expiresIn && !!resource.credits && (
                            <Pill borderRadius={18}>
                                <View style={styles.pillWrapper}>
                                    <CreditsIcon width={18} height={18} />
                                    <Text style={styles.pillText}>{resource.credits}</Text>
                                </View>
                            </Pill>
                        )}
                    </View>
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
                <LinearGradient
                    locations={[0, 0.5, 0.8, 1.0]}
                    colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.7)', 'rgba(37, 52, 74, 1)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.gradient, { height: height }]}
                />
            </>
        </TouchableHighlight>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resource === nextProps.resource;
};

export default React.memo(HeroCarouselCardTV, propsAreEqual);
