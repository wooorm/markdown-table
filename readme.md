# markdown-table

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Generate fancy [Markdown][fancy]/ASCII tables.

## Install

[npm][]:

```sh
npm install markdown-table
```

## Use

Typical usage (defaults to align left):

```js
var table = require('markdown-table')

table([
  ['Branch', 'Commit'],
  ['master', '0123456789abcdef'],
  ['staging', 'fedcba9876543210']
])
```

Yields:

```markdown
| Branch  | Commit           |
| ------- | ---------------- |
| master  | 0123456789abcdef |
| staging | fedcba9876543210 |
```

With align:

```js
table(
  [
    ['Beep', 'No.', 'Boop'],
    ['beep', '1024', 'xyz'],
    ['boop', '3388450', 'tuv'],
    ['foo', '10106', 'qrstuv'],
    ['bar', '45', 'lmno']
  ],
  {align: ['l', 'c', 'r']}
)
```

Yields:

```markdown
| Beep |   No.   |   Boop |
| :--- | :-----: | -----: |
| beep |   1024  |    xyz |
| boop | 3388450 |    tuv |
| foo  |  10106  | qrstuv |
| bar  |    45   |   lmno |
```

Align on dots:

```js
table([['No.'], ['0.1.2'], ['11.22.33'], ['5.6.'], ['1.22222']], {align: '.'})
```

Yields:

```markdown
|    No.      |
| :---------: |
|   0.1.2     |
| 11.22.33    |
|   5.6.      |
|     1.22222 |
```

## API

### `markdownTable(table[, options])`

Turns a given matrix of strings (an array of arrays of strings) into a table.

##### `options`

###### `options.align`

One style for all columns, or styles for their respective columns (`string` or
`Array.<string>`).
Each style is either `'l'` (left), `'r'` (right), `'c'` (centre), or `'.'`
(dot).
Other values are treated as `''`, which doesn’t place the colon but does align
left.
*Only the lowercased first character is used, so `Right` is fine.*

###### `options.delimiter`

Value to insert between cells (`string`, default: `' | '`).
*Careful, setting this to a non-pipe breaks Markdown*.

###### `options.start`

Value to insert at the beginning of every row (`string`, default: `'| '`).

###### `options.end`

Value to insert at the end of every row (`string`, default: `' |'`).

###### `options.rule`

Whether to display a rule between the header and the body of the table
(`boolean`, default: `true`).
*Careful, setting this to `false` will break Markdown*.

###### `options.stringLength`

Method to detect the length of a cell (`Function`, default: `s => s.length`).

ANSI-sequences or Emoji mess up tables on terminals.
To fix this, you have to pass in a `stringLength` option to detect the “visible”
length of a cell.

```js
var strip = require('strip-ansi')

function stringLength(cell) {
  return strip(cell).length
}
```

###### `options.alignDelimiters`

Whether to align the delimiters (`boolean`, default: `true`).
By default, they are aligned:

```markdown
| Alpha | B     |
| ----- | ----- |
| C     | Delta |
```

Pass `false` to make them staggered:

```markdown
| Alpha | B |
| - | - |
| C | Delta |
```

## Inspiration

The original idea and basic implementation was inspired by James Halliday’s
[`text-table`][text-table] library.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/markdown-table.svg

[build]: https://travis-ci.org/wooorm/markdown-table

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/markdown-table.svg

[coverage]: https://codecov.io/github/wooorm/markdown-table

[downloads-badge]: https://img.shields.io/npm/dm/markdown-table.svg

[downloads]: https://www.npmjs.com/package/markdown-table

[size-badge]: https://img.shields.io/bundlephobia/minzip/markdown-table.svg

[size]: https://bundlephobia.com/result?p=markdown-table

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[fancy]: https://help.github.com/articles/github-flavored-markdown/#tables

[text-table]: https://github.com/substack/text-table
