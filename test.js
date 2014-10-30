'use strict';

/**
 * Dependencies.
 */

var table,
    chalk,
    assert;

table = require('./');
chalk = require('chalk');
assert = require('assert');

/**
 * Tests.
 */

describe('table()', function () {
    it('should create a table', function () {
        var output;

        output = table([
            ['Branch', 'Commit'],
            ['master', '0123456789abcdef'],
            ['staging', 'fedcba9876543210']
        ]);

        assert(output === [
            '| Branch  | Commit           |',
            '| :------ | :--------------- |',
            '| master  | 0123456789abcdef |',
            '| staging | fedcba9876543210 |'
        ].join('\n'));
    });

    it('should work correctly when cells are missing', function () {
        var output;

        output = table([
                ['A', 'B', 'C'],
                ['a', 'b', 'c'],
                ['a', 'b'],
                ['a'],
                [],
                ['a', 'b', ''],
                ['', 'b', 'c'],
                ['a', '', ''],
                ['', '', 'c'],
                ['', '', '']
            ],
            {
                'align': ['c', 'c', 'c']
            }
        );

        assert(output === [
            '|  A  |  B  |  C  |',
            '| :-: | :-: | :-: |',
            '|  a  |  b  |  c  |',
            '|  a  |  b  |     |',
            '|  a  |     |     |',
            '|     |     |     |',
            '|  a  |  b  |     |',
            '|     |  b  |  c  |',
            '|  a  |     |     |',
            '|     |     |  c  |',
            '|     |     |     |'
        ].join('\n'));
    });
});

describe('table(align: [...])', function () {
    it('should align left and right', function () {
        var output;

        output = table([
                ['Beep', 'No.'],
                ['boop', '33450'],
                ['foo', '1006'],
                ['bar', '45']
            ],
            {
                'align': ['l', 'r']
            }
        );

        assert(output === [
            '| Beep |   No. |',
            '| :--- | ----: |',
            '| boop | 33450 |',
            '| foo  |  1006 |',
            '| bar  |    45 |'
        ].join('\n'));
    });

    it('should align center', function () {
        var output;

        output = table([
                ['Beep', 'No.', 'Boop'],
                ['beep', '1024', 'xyz'],
                ['boop', '3388450', 'tuv'],
                ['foo', '10106', 'qrstuv'],
                ['bar', '45', 'lmno']
            ],
            {
                'align': ['l', 'c', 'l']
            }
        );

        assert(output === [
            '| Beep |   No.   | Boop   |',
            '| :--- | :-----: | :----- |',
            '| beep |   1024  | xyz    |',
            '| boop | 3388450 | tuv    |',
            '| foo  |  10106  | qrstuv |',
            '| bar  |    45   | lmno   |'
        ].join('\n'));
    });

    it('should align dots', function () {
        var output;

        output = table([
                ['Beep', 'No.'],
                ['beep', '1024'],
                ['boop', '334.212'],
                ['foo', '1006'],
                ['bar', '45.6'],
                ['baz', '123.']
            ],
            {
                'align': ['l', '.']
            }
        );

        assert(output === [
            '| Beep |   No.    |',
            '| :--- | :------: |',
            '| beep | 1024     |',
            '| boop |  334.212 |',
            '| foo  | 1006     |',
            '| bar  |   45.6   |',
            '| baz  |  123.    |'
        ].join('\n'));
    });

    it('should align multiple dots in a cell', function () {
        var output;

        output = table([
                ['No.'],
                ['0.1.2'],
                ['11.22.33'],
                ['5.6.7'],
                ['1.22222'],
                ['12345.'],
                ['5555.'],
                ['123']
            ],
            {
                'align': ['.']
            }
        );

        assert(output === [
            '|    No.      |',
            '| :---------: |',
            '|   0.1.2     |',
            '| 11.22.33    |',
            '|   5.6.7     |',
            '|     1.22222 |',
            '| 12345.      |',
            '|  5555.      |',
            '|   123       |'
        ].join('\n'));
    });
});

describe('table({delimiter: " - "}) // Note: invalid GFM', function () {
    it('should create a table delimited by `delimiter`', function () {
        var output;

        output = table([
                ['Branch', 'Commit'],
                ['master', '0123456789abcdef'],
                ['staging', 'fedcba9876543210']
            ],
            {
                'delimiter': ' - '
            }
        );

        assert(output === [
            '| Branch  - Commit           |',
            '| :------ - :--------------- |',
            '| master  - 0123456789abcdef |',
            '| staging - fedcba9876543210 |'
        ].join('\n'));
    });
});

describe('table({start: ""})', function () {
    it('should create a table without starting border', function () {
        var output;

        output = table([
                ['Branch', 'Commit'],
                ['master', '0123456789abcdef'],
                ['staging', 'fedcba9876543210']
            ],
            {
                'start': ''
            }
        );

        assert(output === [
            'Branch  | Commit           |',
            ':------ | :--------------- |',
            'master  | 0123456789abcdef |',
            'staging | fedcba9876543210 |'
        ].join('\n'));
    });
});

describe('table({end: ""})', function () {
    it('should create a table without ending border', function () {
        var output;

        output = table([
                ['Branch', 'Commit'],
                ['master', '0123456789abcdef'],
                ['staging', 'fedcba9876543210']
            ],
            {
                'end': ''
            }
        );

        assert(output === [
            '| Branch  | Commit          ',
            '| :------ | :---------------',
            '| master  | 0123456789abcdef',
            '| staging | fedcba9876543210'
        ].join('\n'));
    });
});

describe('table({rule: false}) // Note: invalid GFM', function () {
    it('should create a table without rule', function () {
        var output;

        output = table([
                ['Branch', 'Commit'],
                ['master', '0123456789abcdef'],
                ['staging', 'fedcba9876543210']
            ],
            {
                'rule': false
            }
        );

        assert(output === [
            '| Branch  | Commit           |',
            '| master  | 0123456789abcdef |',
            '| staging | fedcba9876543210 |'
        ].join('\n'));
    });
});

describe('table({stringLength: fn}) // For terminals, etc.', function () {
    it('should use `fn` to detect cell lengths', function () {
        var output;

        function stringLength(value) {
            return chalk.stripColor(value).length;
        }

        output = table([
                [
                    'A',
                    'B',
                    'C'
                ],
                [
                    chalk.red('Red'),
                    chalk.green('Green'),
                    chalk.blue('Blue')
                ],
                [
                    chalk.bold('Bold'),
                    chalk.underline(''),
                    chalk.italic('Italic')
                ],
                [
                    chalk.inverse('Inverse'),
                    chalk.strikethrough('Strike'),
                    chalk.hidden('Hidden')
                ],
                [
                    'bar',
                    '45',
                    'lmno'
                ]
            ],
            {
                'align': ['l', 'c', 'r'],
                'stringLength': stringLength
            }
        );

        assert(chalk.stripColor(output) === [
            '| A       |    B   |      C |',
            '| :------ | :----: | -----: |',
            '| Red     |  Green |   Blue |',
            '| Bold    |        | Italic |',
            '| Inverse | Strike | Hidden |',
            '| bar     |   45   |   lmno |'
        ].join('\n'));
    });
});
