import React from 'react';
import LanguageSelectionTemplate from '../../components/template/LanguageSelectionTemplate';

const LanguageSelectionScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    const { screenType } = route.params;
    return <LanguageSelectionTemplate screenType={screenType} navigation={navigation} />;
};

export default LanguageSelectionScreen;
