import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import DetailsBackground from 'features/details/presentation/components/atoms/DetailsBackground';
import PrimaryButton from 'core/presentation/components/atoms/PrimaryButton';
import PrimarySwitchRow from '../../molecules/PrimarySwitchRow';
import { HintCheckBox } from '../../molecules/HintCheckBox';
import { downloadSettingsSheetStyle } from './style';
import { DownloadQuality } from 'utils/UserPreferenceUtils';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { getDownloadSecondaryText, getDownloadTitleText, updateDownloadQuality } from 'features/downloads/utils';
import { useDownloadQuality } from 'features/downloads/presentation/hooks/useDownloadQuality';
import { useLocalization } from 'contexts/LocalizationContext';
import { AUTOMATION_TEST_ID } from 'core/presentation/automation-ids';
import RadioSelected from 'assets/images/radio_button_selected.svg';
import RadioUnselected from 'assets/images/radio_button_unselected.svg';
import DetailsClose from 'assets/images/details_close.svg';

const DownloadSettingsSheet = (props: DownloadSettingsSheetProps) => {
    const { strings } = useLocalization();
    const [preferredQuality, availableQualities] = useDownloadQuality();
    const styles = downloadSettingsSheetStyle(useAppColors());
    const [quality, setQuality] = useState('');
    const [keepAsDefault, setKeepAsDefault] = useState(false);

    useEffect(() => {
        if (preferredQuality) {
            setQuality(preferredQuality);
        }
    }, [preferredQuality]);

    const renderItem = (item: string) => {
        return (
            <HintCheckBox
                key={item}
                label={getDownloadTitleText(strings, item as DownloadQuality)}
                hint={getDownloadSecondaryText(strings, item as DownloadQuality)}
                checkedIcon={<RadioSelected width={styles.radioIcon.width} height={styles.radioIcon.height} />}
                uncheckedIcon={<RadioUnselected width={styles.radioIcon.width} height={styles.radioIcon.height} />}
                checked={quality === item}
                onPress={() => setQuality(item)}
            />
        );
    };

    const handleSave = async () => {
        if (keepAsDefault) {
            await updateDownloadQuality(quality as DownloadQuality);
        }
        props.onSave(quality as DownloadQuality, false);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollViewContainer}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={props.onClose}
                    testID={AUTOMATION_TEST_ID.CLOSE_ICON}
                    accessibilityLabel={AUTOMATION_TEST_ID.CLOSE_ICON}>
                    <DetailsClose width={'100%'} height={'100%'} />
                </TouchableOpacity>

                <DetailsBackground style={styles.gradientContainer}>
                    <Text style={styles.title}>{strings['download.settings']}</Text>
                    {availableQualities && availableQualities.length > 0 && (
                        <View style={styles.list}>{availableQualities.map(item => renderItem(item))}</View>
                    )}
                    <PrimarySwitchRow
                        style={styles.switch}
                        text={strings['download.settings.set_as_default']}
                        secondaryText={strings['download.settings.set_as_default_hint']}
                        activated={keepAsDefault}
                        onValueChange={(value: boolean) => setKeepAsDefault(value)}
                    />
                    <PrimaryButton title={strings.save} onPress={handleSave} />
                </DetailsBackground>
            </ScrollView>
        </View>
    );
};

export interface DownloadSettingsSheetProps {
    onSave: (quality: DownloadQuality, downloadOverCellular: boolean) => void;
    onClose: () => void;
}

export default DownloadSettingsSheet;
