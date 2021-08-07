import { isRegionRestricted } from '../../src/utils/GeoChecker';

describe('GeoChecker', () => {
    it('does not restrict when Geo API errors out', async () => {
        const query = async () => {
            return { error: true, errorObject: {} };
        };

        const isRestricted = await isRegionRestricted({ allowedRegions: 'ca,in,us' } as any, query);
        expect(isRestricted).not.toBeTruthy();
    });

    it('does not restrict when Geo API response parse fails', async () => {
        const query = async () => {
            return { error: false, payload: {} };
        };

        const isRestricted = await isRegionRestricted({ allowedRegions: 'ca,in,us' } as any, query);
        expect(isRestricted).not.toBeTruthy();
    });

    it('does not restrict when detcted country matches allowed regions', async () => {
        const query = async () => {
            return { error: false, payload: { countryCode: 'in' } };
        };

        const isRestricted = await isRegionRestricted({ allowedRegions: 'ca,in,us' } as any, query);
        expect(isRestricted).not.toBeTruthy();
    });

    it('does not restrict when there are no allowed regions configured', async () => {
        const query = async () => {
            return { error: false, payload: { countryCode: 'in' } };
        };

        const isRestricted = await isRegionRestricted({} as any, query);
        expect(isRestricted).not.toBeTruthy();
    });

    it('restricts when detcted country does not matches allowed regions', async () => {
        const query = async () => {
            return { error: false, payload: { countryCode: 'in' } };
        };

        const isRestricted = await isRegionRestricted({ allowedRegions: 'us' } as any, query);
        expect(isRestricted).toBeTruthy();
    });
});
