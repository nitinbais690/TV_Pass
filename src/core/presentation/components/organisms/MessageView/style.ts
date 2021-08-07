import { StyleSheet } from 'react-native';
export const MessageViewStyle = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        imageContainer: {
            flex: 2,
        },
        footerAction: {
            flex: 1,
        },
    });
};
