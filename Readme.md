# markdown-table [![Build Status](https://travis-ci.org/wooorm/markdown-table.svg?branch=master)](https://travis-ci.org/wooorm/markdown-table) [![Coverage Status](https://img.shields.io/coveralls/wooorm/markdown-table.svg)](https://coveralls.io/r/wooorm/markdown-table?branch=master)

Generate fancy [Markdown](https://help.github.com/articles/github-flavored-markdown/#tables) or text tables.

## Installation

npm:
```sh
$ npm install markdown-table
```

Component:
```sh
$ component install wooorm/markdown-table
```

Bower:
```sh
$ bower install markdown-table
```

## Usage

```js
var table = require('markdown-table');

/**
 * Normal usage (defaults to left-alignment):
 */

table([
    ['Branch', 'Commit'],
    ['master', '0123456789abcdef'],
    ['staging', 'fedcba9876543210']
]);
/**
 * | Branch  | Commit           |
 * | :------ | :--------------- |
 * | master  | 0123456789abcdef |
 * | staging | fedcba9876543210 |
 */

/**
 * With alignment:
 */

table([
    ['Beep', 'No.', 'Boop'],
    ['beep', '1024', 'xyz'],
    ['boop', '3388450', 'tuv'],
    ['foo', '10106', 'qrstuv'],
    ['bar', '45', 'lmno']
], {
    'align' : ['l', 'c', 'r']
});
/**
 * | Beep |   No.   |   Boop |
 * | :--- | :-----: | -----: |
 * | beep |   1024  |    xyz |
 * | boop | 3388450 |    tuv |
 * | foo  |  10106  | qrstuv |
 * | bar  |    45   |   lmno |
 */

/**
 * Alignment on dots:
 */

table([
    ['No.'],
    ['0.1.2'],
    ['11.22.33'],
    ['5.6.'],
    ['1.22222'],
], {
    'align' : ['.']
});
/**
 * |    No.      |
 * | :---------: |
 * |   0.1.2     |
 * | 11.22.33    |
 * |   5.6.      |
 * |     1.22222 |
 */
```

## API

### markdownTable(table, options?)

Turns a given matrix of strings (an array of arrays containing strings) into a table.

The following options are available:

- `options.align`  — Array of strings, each string being either `"l"` (left), `"r"` (right), `c` (center), or `.` (dot). Other values are treated as `"l"`;
- `options.delimiter` — Value to insert between cells. Carefull, non-pipe values will break GitHub Flavored Markdown;
- `options.start` — Value to insert at the beginning of every row.
- `options.end` — Value to insert at the end of every row.
- `options.rule` — Whether to display a rule between the header and the body of the table. Carefull, will break GitHub Flavored Markdown when `false`;
- `options.stringLength` — The method to detect the length of a cell (see below).

### options.stringLength(cell)

ANSI-sequences mess up table creation. To fix this, you have to pass in a `stringLength` option to detect the “visible” length of a cell.

```js
var chalk = require('chalk');

function stringLength(cell) {
    return chalk.stripColor(cell).length;
}
```

See the [tests for an example](spec/markdown-table.spec.js).

## Inspiration

The original idea and basic implementation was inspired by James Halliday's [text-table](https://github.com/substack/text-table) library.

## License

MIT © Titus Wormer
