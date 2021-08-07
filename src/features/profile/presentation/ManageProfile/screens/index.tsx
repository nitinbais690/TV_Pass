import React from 'react';
import ManageProfileTemplate from '../components/template';

const ManageProfileScreen = ({ navigation, route }: { navigation: any; route: any }) => {
    return <ManageProfileTemplate navigation={navigation} title={route.params.title} />;
};

export default ManageProfileScreen;
