import React from 'react';
import { ScrollView, View } from 'react-native';
import BackgroundGradient from 'core/presentation/components/atoms/BackgroundGradient';
import BackNavigation from 'core/presentation/components/atoms/BackNavigation';
import AppLoadingIndicator from 'screens/components/AppLoadingIndicator';
import AccountInfo from '../../molecules/AccountInfo';
import SettingsList, { RowItem } from '../../molecules/SettingsList';
import { settingsTemplateStyle } from './style';
import { useLocalization } from 'contexts/LocalizationContext';
import { useProfiles } from 'contexts/ProfilesContextProvider';

const SettingsTemplate = (props: SettingsTemplateProps) => {
    const { strings } = useLocalization();
    const { profiles, loading } = useProfiles();
    const styles = settingsTemplateStyle();

    const onProfileEdit = () => {
        // TODO: navigate to edit profile screen
    };

    const handlePress = (item: RowItem) => {
        // TODO: navigate to appropriate screen
        props.navigation.navigate(item.screen, { title: item.title }, props.navigation);
    };

    return (
        <BackgroundGradient insetTabBar={false}>
            <BackNavigation
                isFullScreen={true}
                navigationTitle={strings.menu_settings}
                onPress={() => {
                    props.navigation.goBack();
                }}
            />
            <ScrollView>
                <View style={styles.container}>
                    {!loading && profiles.filter(profile => profile.main).length !== 0 && (
                        <AccountInfo
                            profile={profiles.filter(profile => profile.main)[0]}
                            onEditPress={onProfileEdit}
                        />
                    )}
                    <SettingsList onPress={handlePress} />
                    {loading && <AppLoadingIndicator style={styles.loaderStyle} />}
                </View>
            </ScrollView>
        </BackgroundGradient>
    );
};

interface SettingsTemplateProps {
    navigation: any;
}

export default SettingsTemplate;
