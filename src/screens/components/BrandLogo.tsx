import React from 'react';
import { selectDeviceType } from 'qp-common-ui';
import Logo from '../../../assets/images/logo.svg';
import LogoLarge from '../../../assets/images/logo_large.svg';

export const BrandLogo = (): JSX.Element => {
    return selectDeviceType({ Handset: <Logo /> }, <LogoLarge />);
};
