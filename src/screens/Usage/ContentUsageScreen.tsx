import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import AnimatedBar from './AnimatedBar';
import { useFetchContentUsage } from 'screens/hooks/useFetchContentUsage';
import { useFetchHistoryList } from 'screens/hooks/useFetchHistoryList';
import { appFonts } from '../../../AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import BackgroundGradient from 'screens/components/BackgroundGradient';
import { selectDeviceType } from 'qp-common-ui';
import HistoryListView from '../../components/qp-discovery-ui/src/views/HistoryListView';
import { NAVIGATION_TYPE } from 'screens/Navigation/NavigationConstants';
import { ResourceVm } from 'qp-discovery-ui';
import { useNavigation } from '@react-navigation/native';
import StarIcon from '../../../assets/images/star.svg';
import CreditUsageEmptyState from 'screens/Usage/CreditUsageEmptyState';
import HistoryEmptyState from 'screens/Usage/HistoryEmptyState';
import RecommendedContent from 'screens/Usage/RecommendedContent';
import SkeletonUsageDashboard from 'screens/components/loading/SkeletonUsageDashboard';
import { ScreenOrigin, UsageScreenOrigin } from 'utils/ReportingUtils';

const ContentUsageScreen = (): JSX.Element => {
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
            paddingLeft: selectDeviceType({ Tablet: 40 }, 20),
            paddingRight: selectDeviceType({ Tablet: 40 }, 20),
        },
        tagline: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.md,
        },
        countValueText: {
            color: appColors.brandTint,
        },
        creditsUsage: {
            alignContent: 'center',
            flexDirection: 'row',
            borderRadius: 10,
            marginLeft: selectDeviceType({ Tablet: 40 }, 20),
            marginRight: selectDeviceType({ Tablet: 40 }, 20),
            margin: 20,
            justifyContent: 'space-between',
        },
        genreText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xxs,
            paddingLeft: 5,
            textTransform: 'capitalize',
        },
        indexNumber: {
            height: selectDeviceType({ Tablet: 35 }, 24),
            width: selectDeviceType({ Tablet: 35 }, 24),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 2,
        },
        subContainer: {
            marginLeft: 4,
            height: selectDeviceType({ Tablet: 60 }, 45),
            justifyContent: 'center',
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
    });

    const DELAY = 100;

    const { strings } = useLocalization();

    const { loading, usageRecords, recommendedContent } = useFetchContentUsage();
    const { historyList } = useFetchHistoryList();

    const cardProps = {
        onResourcePress: (tappedResource: ResourceVm) => {
            tappedResource.origin = ScreenOrigin.USAGE;
            navigation.navigate(NAVIGATION_TYPE.CONTENT_DETAILS, {
                resource: tappedResource,
                title: tappedResource.name,
                resourceId: tappedResource.id,
                resourceType: tappedResource.type,
                usageTabName: UsageScreenOrigin.ContenUsage,
            });
        },
    };
    const creditSum = usageRecords.reduce((prev, next) => prev + next.value, 0);
    const starIconSize = selectDeviceType({ Tablet: 25 }, 17);

    return (
        <BackgroundGradient insetHeader={true} headerType={'HeaderTab'} insetTabBar={true}>
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
                                                <View style={style.indexNumber}>
                                                    <Text style={[style.genreText, { paddingLeft: 0 }]}>
                                                        {index === 0 && (
                                                            <StarIcon width={starIconSize} height={starIconSize} />
                                                        )}
                                                    </Text>
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
                        <CreditUsageEmptyState info={strings['content_usage.content_credits_empty']} />
                    )}
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

export default ContentUsageScreen;
