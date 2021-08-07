import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppPreferencesState } from '../../utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';
import { useLocalization } from 'contexts/LocalizationContext';
import { selectDeviceType, AspectRatio, ImageType } from 'qp-common-ui';
import { ResourceVm, ResizableImage } from 'qp-discovery-ui';
import StarIcon from '../../../assets/images/star.svg';
import LinearGradient from 'react-native-linear-gradient';
import { Button as RNEButton } from 'react-native-elements';
import CreditsIcon from '../../../assets/images/credits.svg';
import DetailPopup from 'features/details/presentation/components/template/DetailPopupScreen';

const RecommendedContent = (props: any): JSX.Element => {
    const prefs = useAppPreferencesState();
    let { appColors } = prefs.appTheme!(prefs);
    const darkBackClr = '#0C1021';
    const [detailModelResource, setDetailModelResource] = useState({});

    const style = StyleSheet.create({
        imageWrapper: {
            overflow: 'hidden',
            aspectRatio: AspectRatio._16by9,
            borderRadius: 22,
            height: selectDeviceType({ Tablet: 200 }, 160),
        },
        image: {
            flex: 1,
        },
        recmdContainer: {
            marginHorizontal: selectDeviceType({ Tablet: 40 }, 20),
            borderRadius: 22,
            alignItems: 'flex-end',
            backgroundColor: darkBackClr,
        },
        LinearOverviewWrapper: {
            ...StyleSheet.absoluteFillObject,
        },
        overviewWrapper: {
            paddingVertical: 20,
            position: 'absolute',
            paddingHorizontal: selectDeviceType({ Tablet: 40 }, 20),
        },
        genreTitle: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
        },
        genreTitleText: {
            color: appColors.secondary,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            paddingLeft: 10,
            textTransform: 'capitalize',
        },
        contentTitleText: {
            color: appColors.secondary,
            fontFamily: appFonts.bold,
            fontSize: appFonts.md,
        },
        contStyle: {
            width: '100%',
        },
        btnStyle: {
            backgroundColor: appColors.brandTint,
            height: selectDeviceType({ Tablet: 50 }, 35),
            width: selectDeviceType({ Tablet: '50%' }, '100%'),
            borderRadius: 25,
            justifyContent: 'flex-start',
            paddingLeft: 15,
        },
        titleStyle: {
            paddingLeft: 5,
            fontFamily: appFonts.primary,
            fontSize: appFonts.xs,
            fontWeight: '500',
            color: appColors.secondary,
        },
        rightzoro: {
            right: '0%',
        },
    });

    const { strings } = useLocalization();
    const { group, recommendedContent } = props;
    const cardProps = {
        onResourcePress: (tappedResource: ResourceVm) => {
            setDetailModelResource({
                resource: tappedResource,
                title: tappedResource.name,
                resourceId: tappedResource.id,
                resourceType: tappedResource.type,
            });
        },
    };
    const onModelClosed = () => {
        setDetailModelResource({});
    };

    const starIconSize = selectDeviceType({ Tablet: 25 }, 17);
    let recTitleStr =
        recommendedContent &&
        recommendedContent.length > 0 &&
        strings.formatString(strings['content_detail.redeem_btn.not_entitled'], recommendedContent[0].credits || 0);
    return (
        <View style={style.recmdContainer}>
            {recommendedContent.length > 0 && (
                <>
                    <View style={style.imageWrapper}>
                        <ResizableImage
                            keyId={recommendedContent[0].id}
                            aspectRatioKey={AspectRatio._16by9}
                            imageType={ImageType.Poster}
                            style={style.image}
                        />
                        <LinearGradient
                            colors={[darkBackClr, 'rgba(0, 0, 0, 0)']}
                            start={{ x: 0.2, y: 0.5 }}
                            end={{ x: 0.9, y: 0.5 }}
                            locations={[0.1, 1]}
                            style={[style.LinearOverviewWrapper, style.rightzoro]}
                        />
                    </View>
                    <View style={style.overviewWrapper}>
                        <View style={style.genreTitle}>
                            <StarIcon width={starIconSize} height={starIconSize} />
                            <Text style={style.genreTitleText}>{group}</Text>
                        </View>
                        <View style={style.genreTitle}>
                            <Text style={style.contentTitleText}>{recommendedContent[0].title}</Text>
                        </View>
                        <View style={style.genreTitle}>
                            <RNEButton
                                icon={<CreditsIcon />}
                                title={recTitleStr.toString()}
                                titleStyle={style.titleStyle}
                                containerStyle={style.contStyle}
                                buttonStyle={style.btnStyle}
                                onPress={() => cardProps.onResourcePress(recommendedContent[0])}
                            />
                        </View>
                    </View>
                </>
            )}
            <DetailPopup onModelClosed={onModelClosed} data={detailModelResource} />
        </View>
    );
};

export default RecommendedContent;
