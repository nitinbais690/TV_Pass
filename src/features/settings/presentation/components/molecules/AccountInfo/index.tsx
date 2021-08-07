import React from 'react';
import { View } from 'react-native';
import AccountEditRow from '../../atoms/AccountEditRow';
import LabeledText from '../../atoms/LabeledText';
import { accountInfoStyle } from './style';
import { useLocalization } from 'contexts/LocalizationContext';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { Profile } from 'features/profile/domain/entities/profile';

const AccountInfo = (props: AccountInfoProps) => {
    const { strings } = useLocalization();
    const style = accountInfoStyle();
    let countryCallingCode;
    try {
        countryCallingCode = props.profile.country ? getCountryCallingCode(props.profile.country as CountryCode) : '';
    } catch (err) {
        // not a valid country
        console.log(err.message);
    }

    return (
        <View style={style.container}>
            <AccountEditRow profile={props.profile} onPress={props.onEditPress} />
            <LabeledText
                label={strings['settings.profile.phone_number']}
                text={
                    props.profile.mobileNumber
                        ? countryCallingCode
                            ? ['+' + countryCallingCode.toString(), props.profile.mobileNumber].join(' ')
                            : props.profile.mobileNumber
                        : strings['settings.profile.add_phone']
                }
                style={[style.labelText, style.topLabelText, !props.profile.email ? style.bottomLabelText : {}]}
            />
            {props.profile.email && (
                <LabeledText
                    label={strings['label.email_id']}
                    text={props.profile.email.toLowerCase()}
                    style={style.labelText}
                />
            )}
            {props.profile.email && (
                <LabeledText
                    label={strings['auth.password_label']}
                    text={strings['settings.profile.password_masked']}
                    style={[style.labelText, style.bottomLabelText]}
                />
            )}
        </View>
    );
};

interface AccountInfoProps {
    profile: Profile;
    onEditPress: () => {};
}

export default AccountInfo;
