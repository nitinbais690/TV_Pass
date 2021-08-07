import { useLocalization } from 'contexts/LocalizationContext';
import { ResourceVm } from 'qp-discovery-ui';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import TabOption from '../../atoms/TabOptions';
import DetailsTabView from '../DetailsTabView';

import { TabOptionViewStyles } from './style';

export default function TabOptionsView(props: TabOptionsViewProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const styles = TabOptionViewStyles({ appColors });
    const { strings } = useLocalization();

    let optionsDataArray: Array<TabOptionModel> = [
        {
            id: '1',
            title: strings.details_screen_episodes,
        },
        {
            id: '2',
            title: strings.details_screen_details,
        },
        {
            id: '3',
            title: strings.details_screen_cast,
        },
        {
            id: '4',
            title: strings.details_screen_scenes,
        },
    ];

    if (!props.episodesView) {
        optionsDataArray = optionsDataArray.filter(item => {
            return item.id !== '1' && item.id !== '4';
        });
    }
    const [selectedIndexId, setSelectedIndexId] = useState(optionsDataArray[0].id);

    const handleOnPress = (id: string) => {
        let filteredArray = optionsDataArray.filter(item => item.id === id).map(({ title }) => ({ id, title }));
        if (filteredArray !== null || filteredArray !== undefined) {
            setSelectedIndexId(filteredArray[0].id);
        }
    };

    /// temp func tobe removed
    function getSelectedTabName() {
        let filteredArray = optionsDataArray
            .filter(item => item.id === selectedIndexId)
            .map(({ title }) => ({ title }));
        var titleStr = '';
        if (filteredArray.length >= 1 && filteredArray !== null && filteredArray !== undefined) {
            titleStr = filteredArray[0].title;
        }
        return titleStr;
    }

    function getTabView() {
        if (selectedIndexId === '1') {
            if (props.episodesView === undefined) {
                // Temp view need to replace with proper view
                return (
                    <View style={styles.container}>
                        <Text style={styles.textStyle}> {getSelectedTabName()} is selected </Text>
                    </View>
                );
            } else {
                return <>{props.episodesView}</>;
            }
        } else if (selectedIndexId === '2') {
            //ToDo need to replace producer, studio & learnmore link with proper values
            return (
                <DetailsTabView
                    producers={props.resource.providerName}
                    studio={props.resource.providerName}
                    maturityRating={props.resource.allRatings.Default}
                    learnMoreLink=""
                />
            );
        } else {
            // Temp view need to replace with proper view
            return (
                <View style={styles.container}>
                    <Text style={styles.textStyle}> {getSelectedTabName()} is selected </Text>
                </View>
            );
        }
    }

    const getTabListView = () => {
        return optionsDataArray.map(item => {
            return (
                <View style={styles.tabStyle}>
                    <TabOption
                        id={item.id}
                        tabName={item.title}
                        showSelectionLine={selectedIndexId === item.id}
                        onPress={handleOnPress}
                    />
                </View>
            );
        });
    };

    return (
        <View>
            <View style={styles.tabViewStyle}>
                {getTabListView()}

                <View style={styles.tabViewBorder} />
            </View>

            {getTabView()}
        </View>
    );
}

export interface TabOptionModel {
    title: string;
    id: string;
}

interface TabOptionsViewProps {
    resource: ResourceVm;
    episodesView: JSX.element;
}
