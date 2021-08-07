import { TrackVariantInfo, TrackVariantTypeValue } from 'rn-qp-nxg-player';
import { TrackInfo } from '../presentation/components/template/PlatformPlayer';

export const FORWORD_BACKWORD_TIME = 10000;

export const filterAndMapVariantsToCode = (
    variants: Array<TrackVariantInfo>,
    type: TrackVariantTypeValue,
): TrackInfo[] => {
    if (variants) {
        return variants
            .filter((variant: TrackVariantInfo) => {
                return variant.type === type;
            })
            .map((variant: TrackVariantInfo) => {
                return { displayName: variant.displayName, languageCode: variant.languageCode };
            })
            .filter(Boolean) as [];
    } else {
        return [];
    }
};

export const filterAndMapActiveVariantsToCode = (variants: Array<TrackVariantInfo>, type: TrackVariantTypeValue) => {
    if (variants) {
        const track: Array<TrackVariantInfo> = variants.filter((variant: TrackVariantInfo) => {
            return variant.type === type;
        });
        if (track && track.length > 0) {
            return track[0].displayName;
        } else {
            return '';
        }
    }
};
