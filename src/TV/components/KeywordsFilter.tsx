import React, { useState } from 'react';
import { AccessibilityProps, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { appFonts } from '../../../AppStyles';

export interface KeywordsFilterProps extends AccessibilityProps {
    onClick?: (text: string) => void;
    selectedKeyword: string;
    isFocus?: boolean;
    keyword?: string;
    index?: number;
    setLoading?: any;
    container?: any;
}

export const KeywordsFilter = (props: KeywordsFilterProps): JSX.Element => {
    const { onClick, selectedKeyword, keyword, index, setLoading, container } = props;
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const [focused, setFocused] = useState(false);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                commonButton: {
                    width: 100,
                    height: 35,
                    borderRadius: 50,
                    justifyContent: 'center',
                    borderColor: 'white',
                },
                keywordText: {
                    alignSelf: 'center',
                    fontFamily: appFonts.light,
                },
            }),
        [],
    );

    if (index === 0 && selectedKeyword === '') {
        onClick(container);
    }

    return (
        <TouchableHighlight
            style={[
                styles.commonButton,
                {
                    backgroundColor: selectedKeyword === keyword ? appColors.blueMid : 'transparent',
                    borderWidth: focused ? 1 : 0,
                },
            ]}
            underlayColor={appColors.blueMid}
            onFocus={() => {
                setFocused(true);
                setLoading(false);
            }}
            onBlur={() => {
                setFocused(false);
                setLoading(false);
            }}
            onPress={() => {
                onClick(container);
            }}
            key={index}>
            <Text
                style={[
                    styles.keywordText,
                    {
                        color: focused
                            ? appColors.secondary
                            : selectedKeyword === keyword
                            ? appColors.secondary
                            : appColors.blueLight,
                    },
                ]}>
                {keyword}
            </Text>
        </TouchableHighlight>
    );
};
