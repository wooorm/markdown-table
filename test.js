import test from 'tape'
import chalk from 'chalk'
import strip from 'strip-ansi'
import {markdownTable} from './index.js'

test('markdownTable()', function (t) {
  t.equal(
    markdownTable([
      ['Branch', 'Commit'],
      ['main', '0123456789abcdef'],
      ['staging', 'fedcba9876543210']
    ]),
    [
      '| Branch  | Commit           |',
      '| ------- | ---------------- |',
      '| main    | 0123456789abcdef |',
      '| staging | fedcba9876543210 |'
    ].join('\n'),
    'should create a table'
  )

  t.equal(
    markdownTable([
      ['Type', 'Value'],
      ['string', 'alpha'],
      // @ts-ignore
      ['number', 1],
      // @ts-ignore
      ['boolean', true],
      ['undefined', undefined],
      ['null', null],
      // @ts-ignore
      ['Array', [1, 2, 3]]
    ]),
    [
      '| Type      | Value |',
      '| --------- | ----- |',
      '| string    | alpha |',
      '| number    | 1     |',
      '| boolean   | true  |',
      '| undefined |       |',
      '| null      |       |',
      '| Array     | 1,2,3 |'
    ].join('\n'),
    'should serialize values'
  )

  t.equal(
    markdownTable(
      [
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
      {align: 'c'}
    ),
    [
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
    ].join('\n'),
    'should work correctly when cells are missing'
  )

  t.equal(
    markdownTable(
      [
        ['Beep', 'No.'],
        ['boop', '33450'],
        ['foo', '1006'],
        ['bar', '45']
      ],
      {align: ['l', 'r']}
    ),
    [
      '| Beep |   No. |',
      '| :--- | ----: |',
      '| boop | 33450 |',
      '| foo  |  1006 |',
      '| bar  |    45 |'
    ].join('\n'),
    'should align left and right'
  )

  t.equal(
    markdownTable(
      [
        ['Beep', 'No.', 'Boop'],
        ['beep', '1024', 'xyz'],
        ['boop', '3388450', 'tuv'],
        ['foo', '10106', 'qrstuv'],
        ['bar', '45', 'lmno']
      ],
      {align: ['l', 'c', 'l']}
    ),
    [
      '| Beep |   No.   | Boop   |',
      '| :--- | :-----: | :----- |',
      '| beep |   1024  | xyz    |',
      '| boop | 3388450 | tuv    |',
      '| foo  |  10106  | qrstuv |',
      '| bar  |    45   | lmno   |'
    ].join('\n'),
    'should align center'
  )

  t.equal(
    markdownTable(
      [
        ['Very long', 'Even longer'],
        ['boop', '33450'],
        ['foo', '1006'],
        ['bar', '45']
      ],
      {align: 'c'}
    ),
    [
      '| Very long | Even longer |',
      '| :-------: | :---------: |',
      '|    boop   |    33450    |',
      '|    foo    |     1006    |',
      '|    bar    |      45     |'
    ].join('\n'),
    'should accept a single value'
  )

  t.equal(
    markdownTable(
      [
        ['Beep', 'No.', 'Boop'],
        ['beep', '1024', 'xyz'],
        ['boop', '3388450', 'tuv'],
        ['foo', '10106', 'qrstuv'],
        ['bar', '45', 'lmno']
      ],
      {align: ['left', 'center', 'right']}
    ),
    [
      '| Beep |   No.   |   Boop |',
      '| :--- | :-----: | -----: |',
      '| beep |   1024  |    xyz |',
      '| boop | 3388450 |    tuv |',
      '| foo  |  10106  | qrstuv |',
      '| bar  |    45   |   lmno |'
    ].join('\n'),
    'should accept multi-character values'
  )

  t.equal(
    markdownTable(
      [
        ['Branch', 'Commit'],
        ['main', '0123456789abcdef'],
        ['staging', 'fedcba9876543210']
      ],
      {padding: false}
    ),
    [
      '|Branch |Commit          |',
      '|-------|----------------|',
      '|main   |0123456789abcdef|',
      '|staging|fedcba9876543210|'
    ].join('\n'),
    'should create a table without padding'
  )

  t.equal(
    markdownTable(
      [
        ['Branch', 'Commit', 'Beep', 'No.', 'Boop'],
        ['main', '0123456789abcdef', 'beep', '1024', 'xyz'],
        ['staging', 'fedcba9876543210', 'boop', '3388450', 'tuv']
      ],
      {alignDelimiters: false, align: ['', 'l', 'c', 'r']}
    ),
    [
      '| Branch | Commit | Beep | No. | Boop |',
      '| - | :- | :-: | -: | - |',
      '| main | 0123456789abcdef | beep | 1024 | xyz |',
      '| staging | fedcba9876543210 | boop | 3388450 | tuv |'
    ].join('\n'),
    'should create a table without aligned delimiters'
  )

  t.equal(
    markdownTable(
      [
        ['A'],
        ['', '0123456789abcdef'],
        ['staging', 'fedcba9876543210'],
        ['develop']
      ],
      {alignDelimiters: false}
    ),
    [
      '| A | |',
      '| - | - |',
      '| | 0123456789abcdef |',
      '| staging | fedcba9876543210 |',
      '| develop | |'
    ].join('\n'),
    'handles short rules and missing elements for tables w/o aligned delimiters'
  )

  t.equal(
    markdownTable(
      [
        ['Branch', 'Commit'],
        ['main', '0123456789abcdef'],
        ['staging', 'fedcba9876543210'],
        ['develop']
      ],
      {delimiterStart: false}
    ),
    [
      'Branch  | Commit           |',
      '------- | ---------------- |',
      'main    | 0123456789abcdef |',
      'staging | fedcba9876543210 |',
      'develop |                  |'
    ].join('\n'),
    'should create rows without starting delimiter'
  )

  t.equal(
    markdownTable(
      [
        ['Branch', 'Commit'],
        ['main', '0123456789abcdef'],
        ['staging', 'fedcba9876543210'],
        ['develop']
      ],
      {delimiterEnd: false}
    ),
    [
      '| Branch  | Commit',
      '| ------- | ----------------',
      '| main    | 0123456789abcdef',
      '| staging | fedcba9876543210',
      '| develop |'
    ].join('\n'),
    'should create rows without ending delimiter'
  )

  t.equal(
    strip(
      markdownTable(
        [
          ['A', 'B', 'C'],
          [chalk.red('Red'), chalk.green('Green'), chalk.blue('Blue')],
          [chalk.bold('Bold'), chalk.underline(''), chalk.italic('Italic')],
          [
            chalk.inverse('Inverse'),
            chalk.strikethrough('Strike'),
            chalk.hidden('Hidden')
          ],
          ['bar', '45', 'lmno']
        ],
        {align: ['', 'c', 'r'], stringLength}
      )
    ),
    [
      '| A       |    B   |      C |',
      '| ------- | :----: | -----: |',
      '| Red     |  Green |   Blue |',
      '| Bold    |        | Italic |',
      '| Inverse | Strike | Hidden |',
      '| bar     |   45   |   lmno |'
    ].join('\n'),
    'should use `stringLength` to detect cell lengths'
  )

  t.end()
})

/**
 * Get the length of a string, minus ANSI color characters.
 * @param {string} value
 * @returns {number}
 */
function stringLength(value) {
  return strip(value).length
}
