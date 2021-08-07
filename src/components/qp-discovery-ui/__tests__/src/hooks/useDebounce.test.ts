import { act, renderHook } from '@testing-library/react-hooks';

import useDebounce from '../../../src/hooks/useDebounce';

describe('useDebounce', () => {
    it('fetches resource and returns proper data on success', async () => {
        jest.useFakeTimers();

        const mockDelay = 100;
        const initialExpected = 'break';
        const delayExpected = 'breaking ba';

        let { result, rerender } = renderHook<any, string>(({ value, delay }) => useDebounce<string>(value, delay), {
            initialProps: { value: initialExpected, delay: mockDelay },
        });

        expect(result.current).toEqual(initialExpected);

        act(() => {
            jest.runAllTimers();
        });

        rerender({ value: 'breaking', delay: mockDelay });
        rerender({ value: 'breaking b', delay: mockDelay });
        rerender({ value: delayExpected, delay: mockDelay });

        act(() => {
            jest.runAllTimers();
        });

        rerender({ value: 'breaking bad', delay: mockDelay });

        expect(result.current).toEqual(delayExpected);
    });
});
