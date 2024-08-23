const { sortPages } = require('./report.js');
const { test, expect } = require('@jest/globals');

test('sortPages x2', () => {
    const input = {
        'https://wagslane.dev': 3,
        'https://wagslane.dev/path': 1,
    };
    const actual = sortPages(input);
    const expected = [
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/path', 1],
    ];
    expect(actual).toEqual(expected);
});

test('sortPages x5', () => {
    const input = {
        'https://wagslane.dev/path': 1,
        'https://wagslane.dev/path2': 4,
        'https://wagslane.dev': 3,
        'https://wagslane.dev/path4': 12,
        'https://wagslane.dev/path3': 9,
    };
    const actual = sortPages(input);
    const expected = [
        ['https://wagslane.dev/path4', 12],
        ['https://wagslane.dev/path3', 9],
        ['https://wagslane.dev/path2', 4],
        ['https://wagslane.dev', 3],
        ['https://wagslane.dev/path', 1],
    ];
    expect(actual).toEqual(expected);
});
