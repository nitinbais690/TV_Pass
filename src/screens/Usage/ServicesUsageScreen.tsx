import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { selectDeviceType, AspectRatio, ImageType } from 'qp-common-ui';
import AnimatedBar from './AnimatedBar';
import { useFetchServiceUsage } from 'screens/hooks/useFetchServiceUsage';
import { useFetchHistoryList } from 'screens/hooks/useFetchHistoryList';
import SkeletonUsageDashboard from 'screens/components/loading/SkeletonUsageDashboard';
import { appFonts } from '../../../AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import HistoryListView from '../../components/qp-discovery-ui/src/views/HistoryListView';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { ResourceVm, ResizableImage } from 'qp-discovery-ui';
import { useNavigation } from '@react-navigation/native';
import CreditUsageEmptyState from 'screens/Usage/CreditUsageEmptyState';
import HistoryEmptyState from 'screens/Usage/HistoryEmptyState';
import RecommendedContent from 'screens/Usage/RecommendedContent';
import { ScreenOrigin, UsageScreenOrigin } from 'utils/ReportingUtils';

const ServicesUsageScreen = (): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const navigation = useNavigation();
    const style = StyleSheet.create({
        rootContainer: {
            marginHorizontal: selectDeviceType({ Tablet: 40 }, 20),
            marginVertical: selectDeviceType({ Tablet: 30 }, 15),
            paddingVertical: selectDeviceType({ Tablet: 20 }, 10),
            borderRadius: 22,
            backgroundColor: 'rgba(39, 56, 78, 0.5)',
        },
        container: {
            paddingHorizontal: selectDeviceType({ Tablet: 60 }, 20),
        },
        tagline: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
        },
        creditsUsage: {
            alignContent: 'center',
            flexDirection: 'row',
            borderRadius: 10,
            marginVertical: 20,
            paddingHorizontal: selectDeviceType({ Tablet: 60 }, 20),
            justifyContent: 'space-between',
        },
        genreText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            paddingLeft: 5,
            textTransform: 'capitalize',
        },
        countValueText: {
            color: appColors.brandTint,
        },
        indexNumber: {
            height: selectDeviceType({ Tablet: 35 }, 24),
            width: selectDeviceType({ Tablet: 35 }, 24),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 2,
        },
        serviceLogo: {
            width: selectDeviceType({ Tablet: 35 }, 24),
            height: selectDeviceType({ Tablet: 35 }, 24),
            backgroundColor: 'rgba(39, 56, 78, 0.5)',
            borderRadius: 6,
            overflow: 'hidden',
        },
        subContainer: {
            marginLeft: 4,
            height: selectDeviceType({ Tablet: 60 }, 45),
            justifyContent: 'center',
            flex: 1,
        },
        divider: {
            height: 1,
            backgroundColor: '#2E4259',
            marginTop: 0,
        },
        barContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        // Recommended service
        imageLg: {
            flex: 1,
            backgroundColor: appColors.primaryVariant2,
            borderRadius: 50,
        },
        recServiceCont: {
            marginHorizontal: selectDeviceType({ Tablet: 40 }, 20),
            paddingHorizontal: selectDeviceType({ Tablet: 60 }, 20),
            paddingVertical: selectDeviceType({ Tablet: 40 }, 20),
            backgroundColor: appColors.primaryVariant6,
            borderRadius: 22,
            height: selectDeviceType({ Tablet: 240 }, 180),
        },
        recImageWrapper: {
            width: selectDeviceType({ Tablet: 210 }, 65),
            height: selectDeviceType({ Tablet: 156 }, 65),
            borderRadius: 10,
            overflow: 'hidden',
        },
        recServiceWrapper: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        serviceInfoCont: {
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: selectDeviceType({ Tablet: 240 }, 20),
        },
        serviceInfo: {
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: '90%',
        },
        serviceInfoText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
            paddingVertical: selectDeviceType({ Tablet: 10 }, 10),
        },

        // Recommended service
        imageWrapper: {
            width: '100%',
            overflow: 'hidden',
            aspectRatio: AspectRatio._16by9,
            borderRadius: 22,
            height: selectDeviceType({ Tablet: 200 }, 160),
        },
        image: {
            flex: 1,
        },
    });

    const DELAY = 100;
    const { strings } = useLocalization();

    const { loading, usageRecords, recommendedServices: recommendedContent } = useFetchServiceUsage();
    const { historyList } = useFetchHistoryList();
    const creditSum = usageRecords.reduce((prev, next) => prev + next.value, 0);
    const cardProps = {
        onResourcePress: (tappedResource: ResourceVm) => {
            tappedResource.origin = ScreenOrigin.USAGE;
            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: tappedResource,
                title: tappedResource.name,
                resourceId: tappedResource.id,
                resourceType: tappedResource.type,
                usageTabName: UsageScreenOrigin.ServicesUsage,
            });
        },
    };

    return (
        <BackgroundGradient insetHeader={true} headerType={'HeaderTabLess'} insetTabBar={true}>
            {loading && <SkeletonUsageDashboard />}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                    {usageRecords.length > 0 && (
                        <View style={style.rootContainer}>
                            <View style={style.creditsUsage}>
                                <View>
                                    <Text style={style.tagline}>{strings['content_usage.credits_used']}</Text>
                                </View>
                                <Text style={[style.tagline, style.countValueText]}>{creditSum}</Text>
                            </View>

                            {
                                <View style={style.container}>
                                    {usageRecords.map((item, index) => (
                                        <View key={index}>
                                            <View style={style.divider} />
                                            <View style={style.barContainer}>
                                                <View style={style.serviceLogo}>
                                                    <ResizableImage
                                                        keyId={item.group}
                                                        aspectRatioKey={AspectRatio._1by1}
                                                        imageType={ImageType.Logo}
                                                        style={style.image}
                                                    />
                                                </View>
                                                <View style={style.subContainer}>
                                                    <Text style={style.genreText}>{item.group}</Text>
                                                    <View style={style.barContainer}>
                                                        <AnimatedBar
                                                            value={item.value}
                                                            creditSum={creditSum}
                                                            delay={DELAY * index}
                                                        />
                                                        <Text style={[style.genreText, style.countValueText]}>
                                                            {item.value}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            }
                        </View>
                    )}
                    {!loading && usageRecords.length === 0 && (
                        <CreditUsageEmptyState info={strings['content_usage.service_credits_empty']} />
                    )}
                    {/* {usageRecords.length > 0 && (
                        <LinearGradient
                            colors={[appColors.brandTint, '#0C1021']}
                            start={{ x: 0.1, y: 1.4 }}
                            end={{ x: 0.5, y: 0.6 }}
                            locations={[0.1, 1]}
                            style={style.recServiceCont}>
                            <View>
                                <View style={style.recServiceWrapper}>
                                    <View style={style.recImageWrapper}>
                                        <ResizableImage
                                            keyId={'dove'}
                                            aspectRatioKey={AspectRatio._1by1}
                                            imageType={ImageType.Logo}
                                            style={style.imageLg}
                                        />
                                    </View>
                                    <View style={style.serviceInfoCont}>
                                        <View style={style.serviceInfo}>
                                            <Text style={style.serviceInfoText}>Subscribe to Showtime and save</Text>
                                        </View>
                                        {DeviceInfo.getDeviceType() === 'Tablet' && (
                                            <Button title={strings['content_usage.subscribe_now']} onPress={() => {}} />
                                        )}
                                    </View>
                                </View>
                                {DeviceInfo.getDeviceType() === 'Handset' && (
                                    <Button title={strings['content_usage.subscribe_now']} onPress={() => {}} />
                                )}
                            </View>
                        </LinearGradient>
                    )} */}
                    {recommendedContent.length > 0 && (
                        <RecommendedContent
                            recommendedContent={recommendedContent}
                            group={usageRecords && usageRecords.length > 0 && usageRecords[0].group}
                        />
                    )}
                    <HistoryListView loading={loading} historyList={historyList} cardProps={cardProps} />
                    {!loading && historyList.length === 0 && <HistoryEmptyState />}
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};

export default ServicesUsageScreen;
