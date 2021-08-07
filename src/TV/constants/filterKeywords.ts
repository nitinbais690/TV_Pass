import { useLocalization } from 'contexts/LocalizationContext';

const Keywords = (selected?: boolean) => {
    const { strings } = useLocalization();
    const keywordsArray = [
        strings['tv.search.Popular'],
        strings['tv.search.JustAdded'],
        strings['tv.search.channels'],
        strings['tv.search.movies'],
        strings['tv.search.TVShows'],
        strings['tv.search.shorts'],
    ];

    const selectedKeywordsArray = [
        strings['tv.search.all_results'],
        strings['tv.search.movies'],
        strings['tv.search.TVShows'],
        strings['tv.search.shorts'],
    ];

    if (selected) {
        return selectedKeywordsArray;
    } else {
        return keywordsArray;
    }
};

export default Keywords;
