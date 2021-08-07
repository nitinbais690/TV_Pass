import React from 'react';
import { render, fireEvent, getByLabelText } from '@testing-library/react-native';
import { DropDownMenuView } from '../../../src/views/DropDownMenuView';

jest.useFakeTimers();

describe('EpgDropDownMenuView', () => {
    it('renders correctly with default styles', () => {
        const { container } = render(jsx());
        expect(getByLabelText(container, 'datePickerDropDown')).toBeDefined();
    });

    it('renders epg dates on selecting dropdown', () => {
        const { container } = render(jsx());
        const dropDownMenuStyle = getByLabelText(container, 'datePickerDropDown');
        fireEvent.press(dropDownMenuStyle);
        expect(getByLabelText(container, 'Today')).toBeDefined();
    });

    it('dismissed overlay on selecting a date', () => {
        const { container } = render(jsx());
        const dropDownMenuStyle = getByLabelText(container, 'datePickerDropDown');
        fireEvent.press(dropDownMenuStyle);
        const todaySchedule = getByLabelText(container, 'Today');
        fireEvent.press(todaySchedule);
        expect(getByLabelText(container, 'datePickerDropDown')).toBeDefined();
    });

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////-------SETUP MOCKS-------///////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    const jsx = () => {
        const pressHandler = jest.fn();
        return (
            <DropDownMenuView
                tintColor={'#666666'}
                selectIndex={3}
                //dropDownMenuStyle={true}
                onMenuItemPress={pressHandler}
                data={[
                    [
                        '2020-May-10 - Sun',
                        '2020-May-11 - Mon',
                        '2020-May-12 - Tue',
                        'Today',
                        '2020-May-14 - Thu',
                        '2020-May-15 - Fri',
                    ],
                ]}
            />
        );
    };
});
