import { useDeviceOrientation } from '../../../src/hooks/useDeviceOrientation';
import { renderHook } from '@testing-library/react-hooks';

describe('EpgGuideView', () => {
    it('Date is formtted to human readable time', async () => {
        const { result } = renderHook<void, any>(() => useDeviceOrientation());
        expect(result.current).toEqual('PORTRAIT');
    });
});
