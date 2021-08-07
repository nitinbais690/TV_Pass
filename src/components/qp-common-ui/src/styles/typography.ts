import { Platform, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { fonts } from './stylesheet';
import { scale } from './responsiveUtils';

export const defaultFont = {
    xs: scale(12),
    sm: scale(14),
    md: scale(18),
    lg: scale(20),
    primary: 'Inter-Regular',
    light: 'Inter-Light',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
    semibold: 'Inter-SemiBold',
};

export interface typography {
    /**
     * The text style of heading
     */
    headline: StyleProp<TextStyle>;
    /**
     * The text style of section header
     */
    sectionHeader: StyleProp<TextStyle>;
    /**
     * The text style of title
     */
    title: StyleProp<TextStyle>;
    /**
     * The text style of sub heading
     */
    subheading: StyleProp<TextStyle>;
    /**
     * The text style of body
     */
    body: StyleProp<TextStyle>;
    /**
     * The text style of caption
     */
    caption: StyleProp<TextStyle>;
    /**
     * The text style of button title
     */
    button: StyleProp<TextStyle>;
}

export const typography = StyleSheet.create({
    headline: {
        fontSize: fonts.lg,
        fontFamily: defaultFont.bold,
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
        textTransform: 'uppercase',
    },
    sectionHeader: {
        fontSize: fonts.xs,
        fontFamily: defaultFont.bold,
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: fonts.md,
        fontFamily: defaultFont.bold,
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
    },
    subheading: {
        fontSize: Platform.isTV ? fonts.xxs : fonts.xs,
        fontFamily: defaultFont.primary,
    },
    body: {
        fontSize: fonts.sm,
        fontFamily: defaultFont.primary,
    },
    caption: {
        fontSize: fonts.xs,
        fontFamily: defaultFont.primary,
    },
    caption1: {
        fontSize: fonts.xxs,
        fontFamily: defaultFont.primary,
    },
    button: {
        fontSize: fonts.sm,
        fontFamily: defaultFont.bold,
        textTransform: 'uppercase',
        fontWeight: Platform.OS === 'ios' ? 'bold' : undefined,
    },
});
