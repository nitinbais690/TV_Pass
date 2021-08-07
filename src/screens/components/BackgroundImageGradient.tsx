import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface BackgroundImageProps {
    source: {
        height: number;
        width: number;
        url: string;
    };
}

const BackgroundImageGradient = (props: BackgroundImageProps) => {
    const gradientContainerStyle = React.useMemo(
        () =>
            StyleSheet.create({
                container: {
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            }),
        [],
    );

    return (
        <ImageBackground source={props.source} style={[gradientContainerStyle.container]}>
            <LinearGradient
                colors={['rgba(12, 16, 33, 0.9)', 'transparent']}
                useAngle={true}
                angle={90}
                locations={[0.2, 0.5]}
                style={[gradientContainerStyle.container]}
            />
            <LinearGradient
                colors={['rgba(12, 16, 33, 0.9)', 'transparent']}
                useAngle={true}
                angle={270}
                locations={[0.2, 0.5]}
                style={[gradientContainerStyle.container]}
            />
            <LinearGradient
                colors={['rgba(12, 16, 33, 0.9)', 'transparent']}
                useAngle={true}
                angle={360}
                locations={[0.4, 0.7]}
                style={[gradientContainerStyle.container]}
            />
        </ImageBackground>
    );
};

export default BackgroundImageGradient;
