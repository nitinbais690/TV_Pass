import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';
import CardTagsOverlay from 'features/discovery/presentation/components/molecules/CardTagsOverlay';
import { appFlexStyles } from 'core/styles/FlexStyles';

const RoundedCardOverlay = ({ resource }: { resource: ResourceVm }) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme!(prefs);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            padding: 6,
            overflow: 'hidden',
            borderRadius: 100,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: appFonts.sm,
            fontFamily: appFonts.semibold,
            fontWeight: '300',
            color: appColors.secondary,
        },
    });

    const hideTitle = resource.imageAspectRatio && resource.ia && resource.ia.includes('3-1x1');

    return (
        <View style={appFlexStyles.flexColumnFill}>
            <CardTagsOverlay isOriginals={resource.isOriginals} isPremium={!resource.isFreeContent} />
            <View
                style={[
                    styles.container,
                    resource.backgroundColor && !hideTitle ? { backgroundColor: resource.backgroundColor } : {},
                ]}>
                {!hideTitle && resource.name && (
                    <Text numberOfLines={2} style={styles.title}>
                        {resource.name}
                    </Text>
                )}
            </View>
        </View>
    );
};

const propsAreEqual = (prevProps: any, nextProps: any): boolean => {
    return prevProps.resource.id === nextProps.resource.id;
};

export default React.memo(RoundedCardOverlay, propsAreEqual);
