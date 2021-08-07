import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Platform,
    Animated,
    Easing,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    BackHandler,
    Modal,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { colors, fonts, padding, percentage, selectDeviceType } from 'qp-common-ui';
// import { BorderlessButton } from 'react-native-gesture-handler';
// import CloseIcon from '../../assets/images/close.svg';
import CheckImg from '../../assets/images/checkImg.svg';
import { BlurView } from '@react-native-community/blur';

const ITEM_HEIGHT = 64;
const selectorHeight = Platform.isTV ? percentage(8, true) : percentage(14, true);

const defaultDropDownMenuStyle = StyleSheet.create({
    rootContainerStyle: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.backgroundGrey,
    },
    touchableContainerStyle: {
        flex: 1,
        height: selectorHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDownMenuButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTextStyle: {
        color: colors.brandTint,
        fontSize: fonts.sm,
        fontFamily: fonts.bold,
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
    },
    itemStyle: {
        flex: 1,
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    itemSeparatorStyle: {
        flex: 1,
        backgroundColor: colors.captionLight,
        marginLeft: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 1,
    },
    itemRowStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: Platform.isTV ? padding.xs(true) : padding.sm(true),
        flexDirection: 'row',
    },
    dropDownArrowStyle: {
        width: percentage(1.5, true),
        height: percentage(1, true),
        marginLeft: percentage(2, true),
    },
    itemTextStyle: {
        color: colors.primary,
        fontFamily: fonts.primary,
        margin: percentage(2, true),
        marginLeft: percentage(6, true),
    },
    modalInsideView: {
        backgroundColor: colors.primaryVariant1,
        height: 100,
        width: selectDeviceType({ Handset: '90%' }, '40%'),
        borderRadius: 22,
        paddingVertical: padding.sm(true),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    closeButton: {
        marginHorizontal: padding.sm(true),
        paddingTop: padding.xxs(true),
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
    },
});

export interface DropDownMenuViewStyle {
    /**
     * The Style of the modal container(View)
     */
    modalContainer?: StyleProp<ViewStyle>;
    /**
     * The Style of the modal view container(View)
     */
    modalInsideView?: StyleProp<ViewStyle>;
    /**
     * The Style of the root container(View)
     */
    rootContainerStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the touchable container(View)
     */
    touchableContainerStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the  Drop Down Menu Button (View)
     */
    dropDownMenuButtonStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the title text(Text)
     */
    titleTextStyle?: StyleProp<TextStyle>;
    /**
     * The Style of the item separator(View)
     */
    itemSeparatorStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the item row(View)
     */
    itemRowStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the item row(View)
     */
    itemStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the Drop Down Arrow(View)
     */
    dropDownArrowStyle?: StyleProp<ViewStyle>;
    /**
     * The Style of the row item text(Text)
     */
    itemTextStyle?: StyleProp<TextStyle>;

    closeButton?: StyleProp<ViewStyle>;
}

export interface DropDownMenuViewProps {
    data?: any[];
    /**
     * The style of the epg view container
     */
    dropDownMenuStyle?: DropDownMenuViewStyle;
    /**
     * The image used for selected drop down item
     */
    checkImage?: string;
    /**
     * The image used for drop down selection button
     */
    arrowImg?: string;
    /**
     * The color used for selected drop down item
     */
    activeTintColor?: string;
    /**
     * The color used for selection feedback
     */
    selectionColor?: string;
    /**
     * text color of each
     */
    tintColor?: string;
    /**
     * The index value to show as selected item for the first launch
     */
    selectIndex?: number;

    /**
     * Called when the touch is released,
     * but not if cancelled (e.g. by a scroll that steals the responder lock).
     */
    onMenuItemPress?: (index: number) => void;
}

export const DropDownMenuView = (props: DropDownMenuViewProps): JSX.Element => {
    const {
        data,
        selectIndex,
        onMenuItemPress,
        arrowImg,
        activeTintColor,
        selectionColor = colors.brandTintLight,
        tintColor,
        dropDownMenuStyle = {},
    } = props;

    const {
        rootContainerStyle,
        touchableContainerStyle,
        dropDownMenuButtonStyle,
        titleTextStyle,
        itemSeparatorStyle,
        itemRowStyle,
        itemTextStyle,
        itemStyle,
        // modalInsideView,
        modalContainer,
        // closeButton,
    } = dropDownMenuStyle;

    const defaultConfig = {
        tintColor: colors.tertiary,
        activeTintColor: colors.primary,
        arrowImg: require('../../assets/dropdown_arrow.png'),
        checkImage: require('../../assets/menu_check.png'),
    };

    const initialState = {
        activityIndex: -1,
        selectIndex: [selectIndex],
        rotationAnims: data!.map(() => new Animated.Value(0)),
    };

    const [state, setState] = useState(initialState);
    const [modalVisible, setModalVisible] = useState(false);

    const springAnim = useRef(new Animated.Value(0)).current;
    let ySpringAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

    useEffect(() => {
        const handleBackButtonPressAndroid = () => {
            if (modalVisible) {
                setModalVisible(true);
                // We have handled the back button
                // Return `true` to prevent react-navigation from handling it
                return true;
            } else {
                return false;
            }
        };

        const isAndroidTV = Platform.isTV && Platform.OS === 'android';
        if (isAndroidTV) {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonPressAndroid);
        }

        return () => {
            if (isAndroidTV) {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonPressAndroid);
            }
        };
    }, [modalVisible]);

    const itemOnPress = (index: number) => {
        if (state.activityIndex > -1) {
            var selectedIndex = state.selectIndex;
            selectedIndex[state.activityIndex] = index;
            setState({
                ...state,
                selectIndex: selectedIndex,
            });
            if (onMenuItemPress) {
                onMenuItemPress(index);
            }
        }
        closePanel(state.activityIndex);
    };

    const renderCheck = (index: number, title: string) => {
        var activityIndex = state.activityIndex;
        if (state.selectIndex[activityIndex] === index) {
            return (
                <View style={[defaultDropDownMenuStyle.itemRowStyle, itemRowStyle]}>
                    <CheckImg
                        style={{
                            width: 10,
                            position: 'absolute',
                            left: selectDeviceType({ Handset: 25 }, 30),
                        }}
                    />
                    <Text
                        style={[
                            defaultDropDownMenuStyle.itemTextStyle,
                            itemTextStyle,
                            {
                                color: activeTintColor ? activeTintColor : defaultConfig.activeTintColor,
                            },
                        ]}
                        accessibilityLabel={title}>
                        {title}
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={[defaultDropDownMenuStyle.itemRowStyle, itemRowStyle]}>
                    <Text
                        style={[
                            defaultDropDownMenuStyle.itemTextStyle,
                            itemTextStyle,
                            {
                                color: tintColor ? tintColor : defaultConfig.tintColor,
                            },
                        ]}>
                        {title}
                    </Text>
                </View>
            );
        }
    };

    const renderItem = (item: string, index: number) => {
        return (
            <TouchableHighlight
                key={index}
                activeOpacity={1}
                underlayColor={selectionColor}
                style={[defaultDropDownMenuStyle.itemStyle, itemStyle]}
                onPress={() => itemOnPress(index)}>
                <>
                    {renderCheck(index, item)}
                    <View style={[defaultDropDownMenuStyle.itemSeparatorStyle, itemSeparatorStyle]} />
                </>
            </TouchableHighlight>
        );
    };

    const keyExtractor = (item: string) => String(item);

    const renderActivityPanel = () => {
        if (state.activityIndex < 0 || !modalVisible) {
            return null;
        }
        var currentTitles = data![state.activityIndex];

        return (
            <Modal transparent={true} visible={modalVisible}>
                <BlurView
                    style={StyleSheet.absoluteFillObject}
                    blurType="light"
                    blurAmount={3}
                    reducedTransparencyFallbackColor="transparent"
                />
                <TouchableOpacity
                    style={[defaultDropDownMenuStyle.modalContainer, modalContainer]}
                    activeOpacity={1}
                    onPressOut={() => closePanel(state.activityIndex)}>
                    <Animated.View
                        style={{
                            ...defaultDropDownMenuStyle.modalInsideView,
                            height: 'auto',
                            maxHeight: springAnim,
                            transform: [
                                {
                                    translateY: ySpringAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 200],
                                    }),
                                },
                            ],
                        }}>
                        {/* <BorderlessButton
                            onPress={() => closePanel(state.activityIndex)}
                            style={[defaultDropDownMenuStyle.closeButton, closeButton]}>
                            <CloseIcon />
                        </BorderlessButton> */}
                        <ScrollView keyboardShouldPersistTaps={'always'}>
                            <FlatList
                                data={currentTitles}
                                renderItem={({ item, index }) => renderItem(item, index)}
                                keyExtractor={keyExtractor}
                                showsVerticalScrollIndicator={false}
                            />
                        </ScrollView>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        );
    };

    const renderDropDownArrow = (index: number) => {
        var icon = arrowImg ? arrowImg : defaultConfig.arrowImg;
        return (
            <Animated.Image
                source={icon}
                style={[
                    defaultDropDownMenuStyle.dropDownArrowStyle,
                    dropDownMenuStyle.dropDownArrowStyle,
                    {
                        tintColor: activeTintColor,
                        transform: [
                            {
                                rotateZ: state.rotationAnims[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                }),
                            },
                        ],
                    },
                ]}
            />
        );
    };

    const openPanel = (index: number) => {
        if (state.activityIndex > -1) {
            closePanel(state.activityIndex);
        }
        Animated.timing(state.rotationAnims[index], {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
        setModalVisible(true);
        setState({
            ...state,
            activityIndex: index,
        });

        Animated.parallel([
            Animated.spring(springAnim, {
                toValue: 300,
                useNativeDriver: false,
            }),
            Animated.spring(ySpringAnim, {
                toValue: 1,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const closePanel = (index: number) => {
        if (state.activityIndex === index) {
            Animated.timing(state.rotationAnims[index], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start();
            setModalVisible(true);
            setState({
                ...state,
                activityIndex: -1,
            });
        }

        springAnim.setValue(0);
        ySpringAnim.setValue(0);
    };

    return (
        <>
            <View style={[defaultDropDownMenuStyle.rootContainerStyle, rootContainerStyle]}>
                {data!.map((rows, index) => (
                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={colors.caption}
                        onPress={() => openPanel(index)}
                        key={index}
                        style={[defaultDropDownMenuStyle.touchableContainerStyle, touchableContainerStyle]}>
                        <View style={[defaultDropDownMenuStyle.dropDownMenuButtonStyle, dropDownMenuButtonStyle]}>
                            <Text
                                style={[defaultDropDownMenuStyle.titleTextStyle, titleTextStyle]}
                                accessibilityLabel="datePickerDropDown">
                                {rows[state.selectIndex[index]!]}
                            </Text>
                            {renderDropDownArrow(index)}
                        </View>
                    </TouchableHighlight>
                ))}
            </View>
            {renderActivityPanel()}
        </>
    );
};
