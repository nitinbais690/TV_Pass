import { ImageTypeUtil, ImageType, AspectRatioUtil, AspectRatio } from 'qp-common-ui';

describe('stylesheet', () => {
    it('converts aspectRatio to string using AspectRatioUtil', () => {
        const _1by1 = AspectRatioUtil.asString(AspectRatio._1by1);
        expect(_1by1).toBe('1x1');

        const _2by3 = AspectRatioUtil.asString(AspectRatio._2by3);
        expect(_2by3).toBe('2x3');

        const _3by4 = AspectRatioUtil.asString(AspectRatio._3by4);
        expect(_3by4).toBe('4x3');

        const _16by9 = AspectRatioUtil.asString(AspectRatio._16by9);
        expect(_16by9).toBe('16x9');

        const defaultResponse = AspectRatioUtil.asString(2);
        expect(defaultResponse).toBe('Unknown');
    });

    it('converts to aspectRatio from string using AspectRatioUtil', () => {
        const _1by1 = AspectRatioUtil.fromString('1x1');
        expect(_1by1).toBe(AspectRatio._1by1);

        const _2by3 = AspectRatioUtil.fromString('2x3');
        expect(_2by3).toBe(AspectRatio._2by3);

        const _3by4 = AspectRatioUtil.fromString('4x3');
        expect(_3by4).toBe(AspectRatio._3by4);

        const _16by9 = AspectRatioUtil.fromString('16x9');
        expect(_16by9).toBe(AspectRatio._16by9);

        const defaultResponse = AspectRatioUtil.fromString('unknown');
        expect(defaultResponse).toBe(AspectRatio._1by1);
    });

    it('converts ImageType to string using ImageTypeUtil', () => {
        const poster = ImageTypeUtil.asString(ImageType.Poster);
        expect(poster).toBe('0');

        const cover = ImageTypeUtil.asString(ImageType.Cover);
        expect(cover).toBe('1');

        const banner = ImageTypeUtil.asString(ImageType.Banner);
        expect(banner).toBe('2');

        const logo = ImageTypeUtil.asString(ImageType.Logo);
        expect(logo).toBe('3');
    });
});
