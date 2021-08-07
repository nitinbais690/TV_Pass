import { useLocalization } from 'contexts/LocalizationContext';

const Alphabets = () => {
    const { strings } = useLocalization();
    const alphabetArray = [
        strings['tv.search.a'],
        strings['tv.search.b'],
        strings['tv.search.c'],
        strings['tv.search.d'],
        strings['tv.search.e'],
        strings['tv.search.f'],
        strings['tv.search.g'],
        strings['tv.search.h'],
        strings['tv.search.i'],
        strings['tv.search.j'],
        strings['tv.search.k'],
        strings['tv.search.l'],
        strings['tv.search.m'],
        strings['tv.search.n'],
        strings['tv.search.o'],
        strings['tv.search.p'],
        strings['tv.search.q'],
        strings['tv.search.r'],
        strings['tv.search.s'],
        strings['tv.search.t'],
        strings['tv.search.u'],
        strings['tv.search.v'],
        strings['tv.search.w'],
        strings['tv.search.x'],
        strings['tv.search.y'],
        strings['tv.search.z'],
    ];

    return alphabetArray;
};

export default Alphabets;
