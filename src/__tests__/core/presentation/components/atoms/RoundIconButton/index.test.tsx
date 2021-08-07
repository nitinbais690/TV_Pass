import React from 'react';
import { render, toJSON } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import RoundIconButton from 'core/presentation/components/atoms/RoundIconButton';
import DownloadIcon from 'assets/images/ic_download.svg';

jest.mock('core/presentation/hooks/use-app-colors');

describe('roundIconButton', () => {
    const buttonSize: number = 40;
    const iconSize: number = 24;

    test('renders correctly', () => {
        const { container } = render(
            <RoundIconButton
                width={buttonSize}
                height={buttonSize}
                svgIcon={<DownloadIcon width={iconSize} height={iconSize} />}
                title={'Download'}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });

    test('render with style', () => {
        const styles = StyleSheet.create({
            container: {
                padding: 16,
            },
        });

        const { container } = render(
            <RoundIconButton
                width={buttonSize}
                height={buttonSize}
                svgIcon={<DownloadIcon width={iconSize} height={iconSize} />}
                title={'Download'}
                style={styles.container}
            />,
        );
        expect(toJSON(container)).toMatchSnapshot();
    });
});
