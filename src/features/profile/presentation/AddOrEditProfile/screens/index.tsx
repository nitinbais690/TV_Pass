import React from 'react';
import AddOrEditProfileTemplate from '../components/template';

const AddOrEditProfileScreen = ({ route, navigation }: { route: any; navigation: any }) => {
    const isEditProfile = (): boolean => {
        return route.params && route.params.isEditProfile;
    };
    return (
        <AddOrEditProfileTemplate
            resource={route.params.resource}
            isEditProfile={isEditProfile()}
            navigation={navigation}
        />
    );
};

export default AddOrEditProfileScreen;
