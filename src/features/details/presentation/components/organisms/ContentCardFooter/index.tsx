import React from 'react';
import { View, Text } from 'react-native';
import MaturityRatingTag from '../../atoms/MaturityRatingTag';
import { styles } from './styles';
import { ResourceVm } from 'qp-discovery-ui';
import { useAppPreferencesState } from 'utils/AppPreferencesContext';
import LinearGradient from 'react-native-linear-gradient';

const ContentCardFooter = ({ resource, rating }: ContentCardFooterProps) => {
    const prefs = useAppPreferencesState();
    const { appTheme } = prefs;
    let { appColors } = appTheme(prefs);
    const style = styles(appColors);

    return (
        <View>
            {resource.completedPercent !== undefined && (
                <>
                    <View style={style.progressContainer}>
                        <LinearGradient
                            colors={['#FD6A2D', '#E14B1F']}
                            style={[style.progress, { width: `${resource.completedPercent}%` }]}
                        />
                    </View>
                </>
            )}
            <View style={style.footerViewStyle}>
                <Text style={style.footerTextStyle} numberOfLines={1} ellipsizeMode={'tail'}>
                    {resource.title}
                </Text>
                <MaturityRatingTag rating={rating} />
            </View>
        </View>
    );
};

interface ContentCardFooterProps {
    resource: ResourceVm;
    rating: {};
}

export default ContentCardFooter;
