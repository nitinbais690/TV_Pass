import deepMerge from '../../../src/utils/deepMerge';

describe('mergeDeep', function() {
    it('should merge object properties without affecting any object', function() {
        var obj1 = { a: 0, b: 1 };
        var obj2 = { c: 2, d: 3 };

        var actual = { a: 0, b: 1, c: 2, d: 3 };
        expect(deepMerge(obj1, obj2)).toEqual(actual);
    });

    it('should do a deep merge', function() {
        var obj1 = { a: { b: 1, c: 1, d: { e: 1, f: 1 } } };
        var obj2 = { a: { b: 2, d: { f: 'f' } } };

        expect(deepMerge(obj1, obj2)).toEqual({ a: { b: 2, c: 1, d: { e: 1, f: 'f' } } });
    });

    it('should not merge strings', function() {
        var obj1 = { a: 'fooo' };
        var obj2 = { a: { b: 2, d: { f: 'f' } } };
        var obj3 = { a: 'bar' };

        var actual = deepMerge(deepMerge(obj1, obj2), obj3);
        expect(actual.a).toEqual('bar');
    });

    it('should clone objects during merge', function() {
        var obj1 = { a: { b: 1 } };
        var obj2 = { a: { c: 2 } };

        var actual = deepMerge(obj1, obj2);
        expect(actual).toEqual({ a: { b: 1, c: 2 } });
    });

    it('should clone unioned arrays', function() {
        var obj1 = { a: [1, 2, [3, 4]] };
        var obj2 = { a: [5] };

        var actual = deepMerge(obj1, obj2);
        expect(actual.a).toEqual([1, 2, [3, 4], 5]);
    });

    it('should not merge non-objects', function() {
        var arr1 = [1, 2, 3];
        var arr2 = [1, 2, 3];
        var actual = deepMerge('string', arr2);
        expect(actual).toEqual(arr2);

        var actual1 = deepMerge(arr1, 'string');
        expect(actual1).toEqual('string');
    });
});
