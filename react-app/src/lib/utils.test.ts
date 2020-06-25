import { objectsEquivalent, arraysEquivalent, isSimpleObject, countedTerm, partitionArray } from "./utils";

test('Objects are equivalent', () => {
    const obj1 = { hi: 'there' };
    const obj2 = { hi: 'there' };
    expect(objectsEquivalent(obj1, obj2)).toEqual(true);
});

test('Objects are still equivalent', () => {
    const objs1: Array<SimpleObject> = [
        { hi: 'there' },
        { foo: 644, bar: 'foo' }
    ];
    const objs2: Array<SimpleObject> = [
        { hi: 'there' },
        { bar: 'foo', foo: 644 }
    ];

    objs1.forEach((obj1, index) => {
        const obj2 = objs2[index];
        expect(objectsEquivalent(obj1, obj2)).toEqual(true);
    });

});

interface SimpleObject {
    [k: string]: any;
}

test('Objects are NOT equivalent', () => {

    const objs1: Array<SimpleObject> = [
        { hi: 'there' },
        { hi: 'there' }
    ];
    const objs2: Array<SimpleObject> = [
        { hello: 'there' },
        { hi: 'here' }
    ];

    objs1.forEach((obj1, index) => {
        const obj2 = objs2[index];
        expect(objectsEquivalent(obj1, obj2)).toEqual(false);
    });

});

test('Arrays are equivalent', () => {
    const objs1: Array<Array<any>> = [
        ['foo', 'bar'],
        ['foo', 1, true, false, null, undefined]
    ];
    const objs2: Array<Array<any>> = [
        ['foo', 'bar'],
        ['foo', 1, true, false, null, undefined]
    ];

    objs1.forEach((obj1, index) => {
        const obj2 = objs2[index];
        expect(arraysEquivalent(obj1, obj2)).toEqual(true);
    });

});

test('Arrays are NOT equivalent', () => {
    const objs1: Array<Array<any>> = [
        ['foo', 'bar'],
        ['foo', 1, true, false, null, undefined],
        [1],
        [{ foo: 'bar' }]
    ];
    const objs2: Array<Array<any>> = [
        ['bar', 'foo'],
        ['foo', 1, true, false, null],
        [true],
        [{ bar: 'foo' }]
    ];

    objs1.forEach((obj1, index) => {
        const obj2 = objs2[index];
        expect(arraysEquivalent(obj1, obj2)).toEqual(false);
    });

});

test('Is simple object', () => {
    const possibleSimpleObjects = [
        { foo: 'bar' },
        { fee: 123 },
        { a: 'b', c: true, d: null }
    ];

    possibleSimpleObjects.forEach((o) => {
        expect(isSimpleObject(o)).toEqual(true);
    });
});

test('Is NOT simple object', () => {
    const possibleSimpleObjects = [
        1,
        true,
        false,
        null,
        undefined,
        Infinity,
        Error,
        new Date()
    ];

    possibleSimpleObjects.forEach((o) => {
        expect(isSimpleObject(o)).toEqual(false);
    });
});

test('Counted terms works', () => {
    const cases: Array<{
        input: [number, string, string | undefined],
        expected: string;
    }> = [
            {
                input: [0, 'foo', 'foos'],
                expected: 'foos'
            },
            {
                input: [1, 'foo', undefined],
                expected: 'foo'
            },
            {
                input: [2, 'foo', undefined],
                expected: 'foos'
            },
            {
                input: [2, 'foo', 'fooi'],
                expected: 'fooi'
            }
        ];
    cases.forEach(({ input, expected }) => {
        const result = countedTerm.apply(null, input);
        expect(result).toEqual(expected);
    });
});

test('Array partitioner works', () => {

    const toPartition = [
        'a',
        'b',
        'c',
        'd'
    ];

    const [first, second] = partitionArray<string>(toPartition, (item: string) => {
        return item < 'c';
    });

    expect(first.length).toEqual(2);
    expect(second.length).toEqual(2);
});