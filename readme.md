# markdown-table

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

Generate a markdown ([GFM][github-docs-gfm]) table.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`markdownTable(table[, options])`](#markdowntabletable-options)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Inspiration](#inspiration)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This is a simple package that takes table data and generates a [GitHub flavored
markdown (GFM)][github-docs-gfm] table.

## When should I use this?

You can use this package when you want to generate the source code of a GFM
table from some data.

This is a simple solution in that it doesn’t handle escapes or HTML or any of
that.
For a complete but heavier solution, build an AST and serialize it with
[`mdast-util-to-markdown`][github-mdast-util-to-markdown] (with
[`mdast-util-gfm`][github-mdast-util-gfm]).

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 14.14+, 16.0+), install with [npm][npmjs-install]:

```sh
npm install markdown-table
```

In Deno with [`esm.sh`][esmsh]:

```js
import {markdownTable} from 'https://esm.sh/markdown-table@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {markdownTable} from 'https://esm.sh/markdown-table@3?bundle'
</script>
```

## Use

Typical usage (defaults to align left):

```js
import {markdownTable} from 'markdown-table'

markdownTable([
  ['Branch', 'Commit'],
  ['main', '0123456789abcdef'],
  ['staging', 'fedcba9876543210']
])
```

Yields:

```markdown
| Branch  | Commit           |
| ------- | ---------------- |
| main    | 0123456789abcdef |
| staging | fedcba9876543210 |
```

With align:

```js
markdownTable(
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

## API

This package exports the identifier `markdownTable`.
There is no default export.

### `markdownTable(table[, options])`

Generate a markdown table from table data (matrix of strings).

##### `options`

Configuration (optional).

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

###### `options.align`

One style for all columns, or styles for their respective columns (`string` or
`Array<string>`).
Each style is either `'l'` (left), `'r'` (right), or `'c'` (center).
Other values are treated as `''`, which doesn’t place the colon in the alignment
row but does align left.
*Only the lowercased first character is used, so `Right` is fine.*

###### `options.delimiterEnd`

Whether to end each row with the delimiter (`boolean`, default: `true`).

> 👉 **Note**: please don’t use this: it could create fragile structures that
> aren’t understandable to some markdown parsers.

When `true`, there are ending delimiters:

```markdown
| Alpha | B     |
| ----- | ----- |
| C     | Delta |
```

When `false`, there are no ending delimiters:

```markdown
| Alpha | B
| ----- | -----
| C     | Delta
```

###### `options.delimiterStart`

Whether to begin each row with the delimiter (`boolean`, default: `true`).

> 👉 **Note**: please don’t use this: it could create fragile structures that
> aren’t understandable to some markdown parsers.

When `true`, there are starting delimiters:

```markdown
| Alpha | B     |
| ----- | ----- |
| C     | Delta |
```

When `false`, there are no starting delimiters:

```markdown
Alpha | B     |
----- | ----- |
C     | Delta |
```

###### `options.fillRows`

Whether to fill rows with empty cells up to the most cells in a row (`boolean`,
default: `true`).

When `true`, all rows have as many cells as the longest row:

```markdown
| Alpha | B    |   |
| ----- | ---- | - |
| C     |      |   |
| D     | Echo | F |
```

When `false`, rows keep their cells,
and the delimiter row has as many cells as the header row:

```markdown
| Alpha | B    |
| ----- | ---- |
| C     |
| D     | Echo | F |
```

###### `options.padding`

Whether to add a space of padding between delimiters and cells (`boolean`,
default: `true`).

When `true`, there is padding:

```markdown
| Alpha | B     |
| ----- | ----- |
| C     | Delta |
```

When `false`, there is no padding:

```markdown
|Alpha|B    |
|-----|-----|
|C    |Delta|
```

###### `options.stringLength`

Function to detect the length of table cell content (`Function`, default:
`s => s.length`).
This is used when aligning the delimiters (`|`) between table cells.
Full-width characters and emoji mess up delimiter alignment when viewing the
markdown source.
To fix this, you can pass this function, which receives the cell content and
returns its “visible” size.
Note that what is and isn’t visible depends on where the text is displayed.

Without such a function, the following:

```js
markdownTable([
  ['Alpha', 'Bravo'],
  ['中文', 'Charlie'],
  ['👩‍❤️‍👩', 'Delta']
])
```

Yields:

```markdown
| Alpha | Bravo |
| - | - |
| 中文 | Charlie |
| 👩‍❤️‍👩 | Delta |
```

With [`string-width`][github-string-width]:

```js
import stringWidth from 'string-width'

markdownTable(
  [
    ['Alpha', 'Bravo'],
    ['中文', 'Charlie'],
    ['👩‍❤️‍👩', 'Delta']
  ],
  {stringLength: stringWidth}
)
```

Yields:

```markdown
| Alpha | Bravo   |
| ----- | ------- |
| 中文  | Charlie |
| 👩‍❤️‍👩    | Delta   |
```

## Types

This package is fully typed with [TypeScript][].
It exports the additional type `Options`.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Inspiration

The original idea and basic implementation was inspired by James Halliday’s
[`text-table`][github-text-table] library.

## Contribute

Yes please!
See [How to Contribute to Open Source][opensource-guide-contribute].

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definitions -->

[badge-build-image]: https://github.com/wooorm/markdown-table/workflows/main/badge.svg

[badge-build-url]: https://github.com/wooorm/markdown-table/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/wooorm/markdown-table.svg

[badge-coverage-url]: https://codecov.io/github/wooorm/markdown-table

[badge-downloads-image]: https://img.shields.io/npm/dm/markdown-table.svg

[badge-downloads-url]: https://www.npmjs.com/package/markdown-table

[badge-size-image]: https://img.shields.io/bundlejs/size/markdown-table

[badge-size-url]: https://bundlejs.com/?q=markdown-table

[esmsh]: https://esm.sh

[file-license]: license

[github-docs-gfm]: https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[github-mdast-util-gfm]: https://github.com/syntax-tree/mdast-util-gfm

[github-mdast-util-to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[github-string-width]: https://github.com/sindresorhus/string-width

[github-text-table]: https://github.com/substack/text-table

[npmjs-install]: https://docs.npmjs.com/cli/install

[opensource-guide-contribute]: https://opensource.guide/how-to-contribute/

[typescript]: https://www.typescriptlang.org

[wooorm]: https://wooorm.com
