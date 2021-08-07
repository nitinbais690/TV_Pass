import { ResourceVm } from 'qp-discovery-ui';
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import WatchListGroup from '../../organisms/WatchListGroup';
import { WatchListTemplateStyles } from './style';
import BackNavigation from 'core/presentation/components/atoms/BackNavigation';
import { useLocalization } from 'contexts/LocalizationContext';
import ProfileAvatar from '../../atoms/ProfileAvatar';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import { appFontStyle } from 'core/styles/AppStyles';

export default function WatchListTemplate(props: WatchListTemplateProps): JSX.Element {
    const { strings } = useLocalization();
    const appColors = useAppColors();
    const styles = WatchListTemplateStyles(appColors);

    return (
        <BackgroundGradient>
            <View style={styles.container}>
                <BackNavigation
                    isFullScreen={true}
                    navigationTitle={strings.watchlist}
                    onPress={() => {
                        props.goToHomeNavigation();
                    }}
                />
                <View style={styles.profileContainer}>
                    <View style={styles.profileWrapper}>
                        <ProfileAvatar />
                    </View>

                    <TouchableOpacity style={styles.textWrapper} onPress={props.removeAllResource}>
                        <Text style={[styles.removeAllText, appFontStyle.sublineText]}>
                            {strings['watchList.removeAll']}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.listContainer}>
                    <WatchListGroup
                        resources={props.resources}
                        hasMore={props.hasMore}
                        loadMoreResources={props.loadMoreResources}
                        removeSingleResource={props.removeSingleResource}
                    />
                </View>
            </View>
        </BackgroundGradient>
    );
}

export interface WatchListTemplateProps {
    resources: ResourceVm[];
    hasMore: boolean;
    loadMoreResources: () => Promise<void>;
    removeAllResource: () => Promise<any>;
    goToHomeNavigation: () => void;
    removeSingleResource: (id: string) => void;
}
