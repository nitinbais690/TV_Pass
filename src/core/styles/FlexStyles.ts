import { StyleSheet } from 'react-native';

export const appFlexStyles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row',
    },
    rowAlignCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowHorizontalAlignStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    rowHorizontalAlignEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rowHorizontalAlignSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowHorizontalAlignSpaceEvenly: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    rowHorizontalAlignSpaceAround: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    rowVerticalAlignStart: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    rowVerticalAlignEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    rowVerticalAlignCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    flexColumnFill: {
        flex: 1,
    },
    columnAlignCenter: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnVerticalAlignStart: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    columnVerticalAlignEnd: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    columnVerticalAlignSpaceBetween: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    columnVerticalAlignSpaceEvenly: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    columnVerticalAlignSpaceAround: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
});
