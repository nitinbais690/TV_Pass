import React from 'react';
import Preference from '../../assets/images/Preferences.svg';
import BillingPayments from '../../assets/images/Billing_Payments.svg';
import Profile from '../../assets/images/Profile.svg';
import Help from '../../assets/images/Help.svg';
import PrivacyPolicy from '../../assets/images/Privacy.svg';
import TermsConditions from '../../assets/images/Terms_Conditions.svg';
import CreditWalkthrough from '../../assets/images/Credit_walkthrough.svg';
import Signout from '../../assets/images/Sign-out.svg';
import Language from '../../assets/images/Language.svg';

const Icon = props => {
    const { name } = props;

    if (name === 'Preferences') {
        return <Preference />;
    } else if (name === 'Preferred Catalogue') {
        return <Language />;
    } else if (name === 'Select User') {
        return <Profile />;
    } else if (name === 'Billing & Payments') {
        return <BillingPayments />;
    } else if (name === 'Profile') {
        return <Profile />;
    } else if (name === 'Help') {
        return <Help />;
    } else if (name === 'Privacy Policy') {
        return <PrivacyPolicy />;
    } else if (name === 'Terms & Conditions') {
        return <TermsConditions />;
    } else if (name === 'Credits Walkthrough') {
        return <CreditWalkthrough />;
    } else if (name === 'Logout') {
        return <Signout />;
    } else if (name === 'Login') {
        return <Signout />;
    }
};

export default Icon;
