import { StyleSheet } from 'react-native';

export function MenuTemplateStyle() {
    return StyleSheet.create({
        mainContainer: { flex: 1, justifyContent: 'flex-start', flexDirection: 'column' },
        headerContainer: { flexGrow: 1 },
        footerContainer: { justifyContent: 'flex-end' },
        loaderStyle: {
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            bottom: 0,
            top: 0,
        },
    });
}
