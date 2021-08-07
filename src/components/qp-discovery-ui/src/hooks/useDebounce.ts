import { useState, useEffect, useRef } from 'react';

/**
 * Allows de-bouncing value that change rapidly (like user typing on a search field).
 * The debounced value will only reflect the latest value when the useDebounce hook has not been called for the specified time period.
 *
 * @param value Th value to debounce
 * @param delay The delay after which to debounce the value
 */
const useDebounce = <T>(value: T, delay: number): T => {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        }
    }, [value, delay]); // Only re-call effect if value or delay changes

    return debouncedValue;
};

export default useDebounce;
