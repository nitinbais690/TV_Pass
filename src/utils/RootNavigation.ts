import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef | null>();

export function navigate(name: string, params: any) {
    navigationRef.current && navigationRef.current.navigate(name, params);
}
