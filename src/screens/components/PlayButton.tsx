import * as React from 'react';
import { ActivityIndicator, TouchableHighlight, findNodeHandle, Platform } from 'react-native';
import PlayCTAIcon from '../../../assets/images/play_cta.svg';
import { tvPixelSizeForLayout } from '../../../AppStyles';
import FocusButton from './FocusButton';

export interface PlayButtonProps {
    isFocusTopButton?: boolean;
    onHandleBlur?: () => void;
    playAvailable: boolean;
    onPress: () => void;
    styles: object;
    appColors: object;
    title: string;
    blockFocusUp: boolean;
}

export const PlayButton = ({
    styles,
    onPress,
    onHandleBlur,
    playAvailable,
    isFocusTopButton,
    appColors,
    title,
    blockFocusUp,
}: PlayButtonProps) => {
    const playTouchableHighlightRef = React.useRef(null);

    const onRef = React.useCallback(ref => {
        if (ref) {
            playTouchableHighlightRef.current = ref;
        }
    }, []);

    const [isFocussed, setIsFocussed] = React.useState<boolean>(false);
    const onPlayFocus = (): void => {
        setIsFocussed(true);
    };
    const onPlayBlur = (): void => {
        setIsFocussed(false);
    };

    if (playAvailable) {
        return (
            <>
                {title ? (
                    <FocusButton
                        hasTVPreferredFocus={isFocusTopButton}
                        ref={Platform.isTV ? onRef : undefined}
                        title={title}
                        blockFocusLeft={true}
                        blockFocusRight={true}
                        blockFocusUp={blockFocusUp}
                        onBlur={onHandleBlur ? onHandleBlur : undefined}
                        onPress={onPress}
                    />
                ) : (
                    <TouchableHighlight
                        activeOpacity={0.85}
                        hasTVPreferredFocus={isFocusTopButton}
                        ref={Platform.isTV ? onRef : undefined}
                        underlayColor={appColors.brandTint}
                        nextFocusLeft={Platform.isTV ? findNodeHandle(playTouchableHighlightRef.current) : undefined}
                        nextFocusRight={Platform.isTV ? findNodeHandle(playTouchableHighlightRef.current) : undefined}
                        nextFocusUp={
                            Platform.isTV && blockFocusUp
                                ? findNodeHandle(playTouchableHighlightRef.current)
                                : undefined
                        }
                        onBlur={() => {
                            onHandleBlur ? onHandleBlur : undefined;
                            Platform.isTV ? onPlayBlur() : undefined;
                        }}
                        onFocus={Platform.isTV ? onPlayFocus : undefined}
                        style={
                            Platform.isTV
                                ? isFocussed
                                    ? styles.playButtonFocusTv
                                    : styles.playButtonTv
                                : styles.playButton
                        }
                        onPress={onPress}
                        enabled={playAvailable}>
                        <PlayCTAIcon height={tvPixelSizeForLayout(100)} width={tvPixelSizeForLayout(100)} />
                    </TouchableHighlight>
                )}
            </>
        );
    } else {
        return <ActivityIndicator color={appColors.secondary} />;
    }
};
