import useAppColors from 'core/presentation/hooks/use-app-colors';

jest.mock('core/presentation/hooks/use-app-colors');

describe('use app colors mock test', () => {
    it('useAppColors mock successfully', () => {
        expect(useAppColors()).toMatchSnapshot();
    });
});
