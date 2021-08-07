import React, { useState, useEffect } from 'react';
import {
    AccessibilityProps,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    useTVEventHandler,
    FlatList,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import { useLocalization } from 'contexts/LocalizationContext';
import { appFonts, appPadding } from '../../../AppStyles';
import BackIcon from '../../../assets/images/tv-icons/back_button.svg';
import Alphabets from '../constants/alphabetArray';
import AppContant from 'utils/AppContant';

export interface AlphabetFilterProps extends AccessibilityProps {
    onClick?: (text: string) => void;
    onClickNumber?: (text: number) => void;
    onBackPress?: () => void;
    onChangeNumber?: () => void;
    onPressSpace?: () => void;
    selectedAlpha: string;
    isNumber: boolean;
    isLoading?: boolean;
    setIsLoading?: any;
}

interface AlphabetViewProps {
    styles?: any;
    alphaText?: string;
    index?: number;
    selectedAlpha?: string;
    onClick?: (text: string) => void;
    appColors?: any;
    focusOnSearch?: boolean;
    temp?: boolean;
    onChangeEvent?: any;
    isLoading?: boolean;
}

const AlphabetView = ({
    styles,
    alphaText,
    onClick,
    appColors,
    focusOnSearch,
    temp,
    onChangeEvent,
}: AlphabetViewProps) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <TouchableOpacity
            activeOpacity={1.0}
            key={alphaText}
            style={[
                styles.alphaButton,
                {
                    backgroundColor: isFocused ? appColors.secondary : temp ? appColors.secondary : 'transparent',
                },
            ]}
            hasTVPreferredFocus={temp ? temp : focusOnSearch}
            onFocus={() => {
                setIsFocused(true);
                onChangeEvent();
            }}
            onBlur={() => {
                setIsFocused(false);
            }}
            onPress={() => {
                onClick(alphaText);
            }}>
            <Text
                style={[
                    styles.alphaText,
                    {
                        color: isFocused ? appColors.background : appColors.primaryLight,
                    },
                ]}>
                {alphaText}
            </Text>
        </TouchableOpacity>
    );
};

interface NumberViewProps {
    styles?: any;
    onClickNumber?: (text: number) => void;
    appColors?: any;
    item?: number;
    focusOnSearch?: boolean;
    temp?: boolean;
}

const NumberView = ({ styles, onClickNumber, appColors, item, temp, focusOnSearch }: NumberViewProps) => {
    const [numberFocused, setNumberFocused] = useState(false);

    return (
        <TouchableOpacity
            activeOpacity={1.0}
            style={[
                styles.alphaButton,
                { backgroundColor: numberFocused ? appColors.secondary : temp ? appColors.secondary : 'transparent' },
            ]}
            onFocus={() => setNumberFocused(true)}
            onBlur={() => setNumberFocused(false)}
            hasTVPreferredFocus={temp ? temp : focusOnSearch}
            onPress={() => {
                onClickNumber(item);
            }}>
            <Text style={[styles.alphaText, { color: numberFocused ? appColors.background : appColors.primaryLight }]}>
                {item}
            </Text>
        </TouchableOpacity>
    );
};

export const AlphabetFilter = (props: AlphabetFilterProps): JSX.Element => {
    const {
        onClick,
        selectedAlpha,
        onBackPress,
        onChangeNumber,
        onPressSpace,
        isNumber,
        onClickNumber,
        isLoading,
        setIsLoading,
    } = props;
    const { strings } = useLocalization();
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme && appTheme(prefs);
    const [spaceFocus, setSpaceFocus] = useState(false);
    const [aplhaFocus, setAplhaFocus] = useState(false);
    const [lastEventType, setLastEventType] = useState('');
    const [backBtnFocus, setBackBtnFocus] = useState(false);
    const [temp, setTemp] = useState(false);
    const [focusOnSearch, setFocusOnSearch] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    const styles = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '92%',
                    alignSelf: 'flex-end',
                    paddingHorizontal: appPadding.md(true),
                },
                commonButton: {
                    backgroundColor: appColors.primaryLight,
                    borderRadius: 5,
                    paddingHorizontal: 5,
                    alignSelf: 'center',
                    marginVertical: 5,
                },
                alphaNumericFocus: {
                    borderWidth: 1,
                    borderColor: 'white',
                },
                buttonText: {
                    fontSize: appFonts.xxxs,
                    fontFamily: appFonts.pro_text_tv,
                },
                backButton: {
                    alignSelf: 'center',
                    marginVertical: 2,
                },
                backButtonFocus: {
                    backgroundColor: appColors.secondary,
                    opacity: 1,
                    paddingVertical: 5,
                    paddingHorizontal: 4,
                    borderRadius: 5,
                },
                alphabetView: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'center',
                    height: '100%',
                },
                numberView: {
                    flexDirection: 'row',
                    alignSelf: 'center',
                    height: '100%',
                    width: '80%',
                },
                alphaButton: {
                    borderRadius: 5,
                    paddingHorizontal: 6,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    flex: 1,
                },
                alphaText: {
                    fontSize: appFonts.lg,
                    alignSelf: 'center',
                    fontFamily: appFonts.regular_tv,
                },
            }),
        [appColors.primaryLight, appColors.secondary],
    );

    const numberList = [];

    for (let i = 0; i < 10; i++) {
        numberList.push(i);
    }

    const onChangeEvent = () => {
        if (lastEventType === AppContant.right && spaceFocus) {
            setFocusOnSearch(true);
            setTemp(false);
        }
        if (lastEventType === AppContant.down && initialLoading) {
            setTemp(true);
            setIsLoading(false);
        }
        if (lastEventType === AppContant.down && temp) {
            setTemp(false);
            setIsLoading(false);
        }
        if (lastEventType === AppContant.left && !spaceFocus) {
            setTemp(false);
        }
        if (lastEventType === AppContant.right) {
            setTemp(false);
        }
    };

    useEffect(() => {
        setInitialLoading(isLoading ? isLoading : false);
    }, [isLoading]);

    const myTVEventHandler = (evt: { eventType: React.SetStateAction<string> }) => {
        setLastEventType(evt.eventType);
        onChangeEvent();
    };

    useTVEventHandler(myTVEventHandler);

    return (
        <TouchableWithoutFeedback
            onFocus={() => {
                setAplhaFocus(true);
            }}
            onBlur={() => {
                setAplhaFocus(false);
            }}>
            <View style={styles.container}>
                <TouchableOpacity
                    hasTVPreferredFocus={true}
                    onPress={onChangeNumber}
                    activeOpacity={0.9}
                    onFocus={() => {
                        setAplhaFocus(true);
                        setTemp(false);
                    }}
                    onBlur={() => {
                        setAplhaFocus(false);
                        setTemp(false);
                    }}
                    style={[styles.commonButton, aplhaFocus && styles.alphaNumericFocus]}>
                    <Text style={styles.buttonText}>
                        {isNumber ? strings['tv.search.abc'] : strings['tv.search.123']}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.commonButton, spaceFocus && styles.alphaNumericFocus]}
                    onPress={onPressSpace}
                    onFocus={() => {
                        setSpaceFocus(true);
                        setTemp(false);
                    }}
                    onBlur={() => {
                        setSpaceFocus(false);
                        onChangeEvent();
                        setTemp(false);
                    }}
                    activeOpacity={0.9}>
                    <Text style={styles.buttonText}>{strings['tv.search.space']}</Text>
                </TouchableOpacity>

                {isNumber ? (
                    <View style={styles.numberView}>
                        {numberList.map((item, index) => {
                            return (
                                <NumberView
                                    item={item}
                                    styles={styles}
                                    onClickNumber={onClickNumber}
                                    appColors={appColors}
                                    focusOnSearch={focusOnSearch && index === 0}
                                    temp={temp && index === 0}
                                />
                            );
                        })}
                    </View>
                ) : (
                    <View style={styles.alphabetView}>
                        <FlatList
                            data={Alphabets()}
                            horizontal
                            initialNumToRender={26}
                            renderItem={({ item, index }) => {
                                return (
                                    <AlphabetView
                                        styles={styles}
                                        alphaText={item}
                                        index={index}
                                        selectedAlpha={selectedAlpha}
                                        onClick={onClick}
                                        appColors={appColors}
                                        temp={temp && index === 0}
                                        onChangeEvent={onChangeEvent}
                                    />
                                );
                            }}
                            extraData={focusOnSearch}
                            keyExtractor={item => item}
                        />
                    </View>
                )}
                <View style={[styles.backButton, backBtnFocus && styles.backButtonFocus]}>
                    <TouchableOpacity
                        onFocus={() => {
                            setBackBtnFocus(true);
                            setTemp(false);
                        }}
                        onBlur={() => {
                            setBackBtnFocus(false);
                            setTemp(false);
                        }}
                        onPress={onBackPress}>
                        {backBtnFocus ? (
                            <Image
                                source={require('../../../assets/images/delete.png')}
                                style={{ height: 28, width: 25 }}
                            />
                        ) : (
                            <BackIcon height={28} width={28} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
