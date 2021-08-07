import React, { useState } from 'react';
import { View, TouchableHighlight, Text, FlatList, ScrollView } from 'react-native';
import DropDownArrow from 'assets/images/drop_down_arrow.svg';
import LinearGradient from 'react-native-linear-gradient';
import { DropDownOptionViewStyles } from './styles';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';

export default function InlineDropDown({ data, keyName, selectedItem, onMenuClicked }: DropDownProps) {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const styles = DropDownOptionViewStyles(appColors);
    const [isMenuEnabled, setMenuEnabled] = useState(false);

    const renderItem = ({ item }: { item: { title: string; id: string } }) => (
        <TouchableHighlight
            onPress={() => {
                setMenuEnabled(!isMenuEnabled);
                const index = data.findIndex(obj => {
                    return obj[keyName] === item[keyName];
                });
                onMenuClicked && onMenuClicked(index);
            }}>
            <Text style={styles.popupText}>{item.title}</Text>
        </TouchableHighlight>
    );

    const getDefaultTitle = (): string => {
        return selectedItem ? selectedItem.title : data.length > 0 ? data[0].title : '';
    };

    return (
        <View>
            <TouchableHighlight style={styles.button} onPress={() => setMenuEnabled(!isMenuEnabled)}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>{getDefaultTitle()}</Text>
                    <DropDownArrow style={styles.buttonImage} />
                </View>
            </TouchableHighlight>

            {isMenuEnabled && data.length > 1 && (
                <View style={styles.popup}>
                    <LinearGradient colors={['#161718', '#3B4046']} style={styles.gradient} />

                    <ScrollView nestedScrollEnabled={true}>
                        <FlatList keyExtractor={item => item[keyName]} data={data} renderItem={renderItem} />
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

interface DropDownProps {
    data: DropDownData[];
    keyName: string;
    onMenuClicked?: any;
    selectedItem?: DropDownData;
}

interface DropDownData {
    title: string;
}
