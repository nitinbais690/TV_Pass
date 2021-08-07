import { useState, useEffect } from 'react';
import { findNodeHandle } from 'react-native';

/**
 * Custom hook to get native node handle from reference.
 * @param ref
 */
const NodeHandle = (ref: any) => {
    const [node, setNodeHandle] = useState(null);

    useEffect(() => {
        if (ref.current) {
            setNodeHandle(findNodeHandle(ref.current));
        }
    }, [ref]);

    return node;
};

export default NodeHandle;
