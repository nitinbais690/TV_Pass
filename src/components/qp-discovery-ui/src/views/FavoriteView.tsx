import React from 'react';
import { TouchableHighlight, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { useFavorite } from '../hooks/useFavorites';
import { Icon } from 'react-native-elements';
import { colors } from 'qp-common-ui';

const defaultWrapperStyle = { margin: 10 };
const defaultAnimatorStyle = { position: 'absolute' as 'absolute', top: 10, left: 5 };

export interface FavoriteViewBaseProps {
    /**
     * The wrapper style for the favorite button.
     */
    wrapperStyle?: StyleProp<ViewStyle>;
    /**
     * The style for activity indicator, if its enabled. see @showActivityIndicator.
     */
    activityIndicatorStyle?: StyleProp<ViewStyle>;
    /**
     * Indicates whether to show the activity indicator. Defaults to true.
     */
    showActivityIndicator?: boolean;
    /**
     * The color of the button when it is tapped.
     */
    underlayColor?: string;
    /**
     * The size of the favorite icon. Default is 40.
     */
    iconSize?: number;
    /**
     * The color to use for the favorite icon.
     */
    iconColor?: string;
}

export interface FavoriteViewProps extends FavoriteViewBaseProps {
    /**
     * The resourceId for which to fetch favorite
     */
    resourceId: string;
    /**
     * The ovat token for the current session
     */
    ovatToken: string | undefined;
}

const FavoriteView = ({
    resourceId,
    ovatToken,
    wrapperStyle = defaultWrapperStyle,
    activityIndicatorStyle = defaultAnimatorStyle,
    showActivityIndicator = true,
    underlayColor = colors.primary,
    iconSize = 40,
    iconColor = colors.brandTint,
}: FavoriteViewProps): JSX.Element => {
    const { liked, loading, like, unlike } = useFavorite(resourceId, ovatToken);
    const iconName = liked ? 'ios-heart' : 'ios-heart-empty';
    return (
        <TouchableHighlight
            style={wrapperStyle}
            underlayColor={underlayColor}
            disabled={liked === undefined || ovatToken === undefined}
            onPress={() => {
                liked ? unlike() : like();
            }}
            testID={'favoriteButton'}
            accessibilityLabel={'Favorite'}>
            <>
                <Icon type="ionicon" color={iconColor} name={iconName} size={iconSize} />
                {showActivityIndicator && <ActivityIndicator style={activityIndicatorStyle} animating={loading} />}
            </>
        </TouchableHighlight>
    );
};

export default FavoriteView;
