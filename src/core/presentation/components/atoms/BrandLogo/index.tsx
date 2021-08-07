import React from 'react';
import AhaLogo from 'assets/images/aha-logo.svg';

export default function BrandLogo(props: { width: number; height: number }) {
    return <AhaLogo width={props.width} height={props.height} />;
}
