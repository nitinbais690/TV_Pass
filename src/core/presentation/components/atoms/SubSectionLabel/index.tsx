import React from 'react';
import useAppColors from 'core/presentation/hooks/use-app-colors';
import { subSectionLabelStyle } from './style';
import { Text } from 'react-native';

export default function SubSectionLabel(props: SubSectionLabelProps) {
    let styles = subSectionLabelStyle(useAppColors());
    return (
        <>
            <Text style={styles.labelText}>{props.title}</Text>
        </>
    );
}

export interface SubSectionLabelProps {
    title: string;
}
