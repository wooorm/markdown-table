import chalk from 'chalk'
import strip from 'strip-ansi'
import {markdownTable} from '../index'

describe('markdownTable()', () => {
  it('should create a table', () => {
    expect(
      markdownTable([
        ['Branch', 'Commit'],
        ['main', '0123456789abcdef'],
        ['staging', 'fedcba9876543210']
      ])
    ).toBe(
      [
        '| Branch  | Commit           |',
        '| ------- | ---------------- |',
        '| main    | 0123456789abcdef |',
        '| staging | fedcba9876543210 |'
      ].join('\n')
    )
  })
  it('should serialize values', () => {
    expect(
      markdownTable([
        ['Type', 'Value'],
        ['string', 'alpha'],
        ['number', 1],
        ['boolean', true],
        ['undefined', undefined],
        ['null', null],
        ['Array', [1, 2, 3]]
      ])
    ).toBe(
      [
        '| Type      | Value |',
        '| --------- | ----- |',
        '| string    | alpha |',
        '| number    | 1     |',
        '| boolean   | true  |',
        '| undefined |       |',
        '| null      |       |',
        '| Array     | 1,2,3 |'
      ].join('\n')
    )
  })

  it('should work correctly when cells are missing', () => {
    expect(
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
      )
    ).toBe(
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
      ].join('\n')
    )
  })
  it('should align left and right', () => {
    expect(
      markdownTable(
        [
          ['Beep', 'No.'],
          ['boop', '33450'],
          ['foo', '1006'],
          ['bar', '45']
        ],
        {align: ['l', 'r']}
      )
    ).toBe(
      [
        '| Beep |   No. |',
        '| :--- | ----: |',
        '| boop | 33450 |',
        '| foo  |  1006 |',
        '| bar  |    45 |'
      ].join('\n')
    )
  })
  it('should align center', () => {
    expect(
      markdownTable(
        [
          ['Beep', 'No.', 'Boop'],
          ['beep', '1024', 'xyz'],
          ['boop', '3388450', 'tuv'],
          ['foo', '10106', 'qrstuv'],
          ['bar', '45', 'lmno']
        ],
        {align: ['l', 'c', 'l']}
      )
    ).toBe(
      [
        '| Beep |   No.   | Boop   |',
        '| :--- | :-----: | :----- |',
        '| beep |   1024  | xyz    |',
        '| boop | 3388450 | tuv    |',
        '| foo  |  10106  | qrstuv |',
        '| bar  |    45   | lmno   |'
      ].join('\n')
    )
  })
  it('should accept a single value', () => {
    expect(
      markdownTable(
        [
          ['Very long', 'Even longer'],
          ['boop', '33450'],
          ['foo', '1006'],
          ['bar', '45']
        ],
        {align: 'c'}
      )
    ).toBe(
      [
        '| Very long | Even longer |',
        '| :-------: | :---------: |',
        '|    boop   |    33450    |',
        '|    foo    |     1006    |',
        '|    bar    |      45     |'
      ].join('\n')
    )
  })
  it('should accept multi-character values', () => {
    expect(
      markdownTable(
        [
          ['Beep', 'No.', 'Boop'],
          ['beep', '1024', 'xyz'],
          ['boop', '3388450', 'tuv'],
          ['foo', '10106', 'qrstuv'],
          ['bar', '45', 'lmno']
        ],
        {align: ['left', 'center', 'right']}
      )
    ).toBe(
      [
        '| Beep |   No.   |   Boop |',
        '| :--- | :-----: | -----: |',
        '| beep |   1024  |    xyz |',
        '| boop | 3388450 |    tuv |',
        '| foo  |  10106  | qrstuv |',
        '| bar  |    45   |   lmno |'
      ].join('\n')
    )
  })
  it('should create a table without padding', () => {
    expect(
      markdownTable(
        [
          ['Branch', 'Commit'],
          ['main', '0123456789abcdef'],
          ['staging', 'fedcba9876543210']
        ],
        {padding: false}
      )
    ).toBe(
      [
        '|Branch |Commit          |',
        '|-------|----------------|',
        '|main   |0123456789abcdef|',
        '|staging|fedcba9876543210|'
      ].join('\n')
    )
  })
  it('should create a table without aligned delimiters', () => {
    expect(
      markdownTable(
        [
          ['Branch', 'Commit', 'Beep', 'No.', 'Boop'],
          ['main', '0123456789abcdef', 'beep', '1024', 'xyz'],
          ['staging', 'fedcba9876543210', 'boop', '3388450', 'tuv']
        ],
        {alignDelimiters: false, align: ['', 'l', 'c', 'r']}
      )
    ).toBe(
      [
        '| Branch | Commit | Beep | No. | Boop |',
        '| - | :- | :-: | -: | - |',
        '| main | 0123456789abcdef | beep | 1024 | xyz |',
        '| staging | fedcba9876543210 | boop | 3388450 | tuv |'
      ].join('\n')
    )
  })
  it('handles short rules and missing elements for tables w/o aligned delimiters', () => {
    expect(
      markdownTable(
        [
          ['A'],
          ['', '0123456789abcdef'],
          ['staging', 'fedcba9876543210'],
          ['develop']
        ],
        {alignDelimiters: false}
      )
    ).toBe(
      [
        '| A | |',
        '| - | - |',
        '| | 0123456789abcdef |',
        '| staging | fedcba9876543210 |',
        '| develop | |'
      ].join('\n')
    )
  })
  it('should create rows without starting delimiter', () => {
    expect(
      markdownTable(
        [
          ['Branch', 'Commit'],
          ['main', '0123456789abcdef'],
          ['staging', 'fedcba9876543210'],
          ['develop']
        ],
        {delimiterStart: false}
      )
    ).toBe(
      [
        'Branch  | Commit           |',
        '------- | ---------------- |',
        'main    | 0123456789abcdef |',
        'staging | fedcba9876543210 |',
        'develop |                  |'
      ].join('\n')
    )
  })
  it('should create rows without ending delimiter', () => {
    expect(
      markdownTable(
        [
          ['Branch', 'Commit'],
          ['main', '0123456789abcdef'],
          ['staging', 'fedcba9876543210'],
          ['develop']
        ],
        {delimiterEnd: false}
      )
    ).toBe(
      [
        '| Branch  | Commit',
        '| ------- | ----------------',
        '| main    | 0123456789abcdef',
        '| staging | fedcba9876543210',
        '| develop |'
      ].join('\n')
    )
  })
  it('should use `stringLength` to detect cell lengths', () => {
    expect(
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
      )
    ).toBe(
      [
        '| A       |    B   |      C |',
        '| ------- | :----: | -----: |',
        '| Red     |  Green |   Blue |',
        '| Bold    |        | Italic |',
        '| Inverse | Strike | Hidden |',
        '| bar     |   45   |   lmno |'
      ].join('\n')
    )
  })
})

/**
 * Get the length of a string, minus ANSI color characters.
 * @param {string} value
 * @returns {number}
 */
function stringLength(value) {
  return strip(value).length
}
