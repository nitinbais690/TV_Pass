import React from 'react';
import { selectDeviceType } from 'qp-common-ui';
import Logo from '../../../assets/images/logo.svg';
import LogoLarge from '../../../assets/images/logo_large.svg';
import BrandTvLogo from '../../../assets/images/brandStruumTv.svg';
export const BrandLogo = ({ height, width }: { height?: number; width?: number }): JSX.Element => {
    return selectDeviceType(
        { Handset: <Logo height={height} width={width} /> },
        <LogoLarge height={height} width={width} />,
    );
};

export const BrandLogoTV = ({ height, width }: { height?: number; width?: number }): JSX.Element => {
    return selectDeviceType(
        { Handset: <BrandTvLogo height={height} width={width} /> },
        <BrandTvLogo height={height} width={width} />,
    );
};
