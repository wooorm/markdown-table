import assert from 'node:assert/strict'
import test from 'node:test'
import chalk from 'chalk'
import strip from 'strip-ansi'
import {markdownTable} from './index.js'

test('markdownTable()', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'markdownTable'
    ])
  })

  await t.test('should create a table', async function () {
    assert.equal(
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
      ].join('\n')
    )
  })

  await t.test('should serialize values', async function () {
    assert.equal(
      markdownTable([
        ['Type', 'Value'],
        ['string', 'alpha'],
        // @ts-expect-error: check handling of primitives.
        ['number', 1],
        // @ts-expect-error: check handling of primitives.
        ['boolean', true],
        ['undefined', undefined],
        ['null', null],
        // @ts-expect-error: check handling of other values.
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
      ].join('\n')
    )
  })

  await t.test(
    'should work correctly when cells are missing',
    async function () {
      assert.equal(
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
        ].join('\n')
      )
    }
  )

  await t.test('should align left and right', async function () {
    assert.equal(
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
      ].join('\n')
    )
  })

  await t.test('should align center', async function () {
    assert.equal(
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
      ].join('\n')
    )
  })

  await t.test('should accept a single value', async function () {
    assert.equal(
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
      ].join('\n')
    )
  })

  await t.test('should accept multi-character values', async function () {
    assert.equal(
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
      ].join('\n')
    )
  })

  await t.test('should create a table without padding', async function () {
    assert.equal(
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
      ].join('\n')
    )
  })

  await t.test(
    'should create a table without aligned delimiters',
    async function () {
      assert.equal(
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
        ].join('\n')
      )
    }
  )

  await t.test(
    'should handle short rules and missing elements for tables w/o aligned delimiters',
    async function () {
      assert.equal(
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
        ].join('\n')
      )
    }
  )

  await t.test(
    'should create rows without starting delimiter',
    async function () {
      assert.equal(
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
        ].join('\n')
      )
    }
  )

  await t.test(
    'should create rows without ending delimiter',
    async function () {
      assert.equal(
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
        ].join('\n')
      )
    }
  )

  await t.test(
    'should use `stringLength` to detect cell lengths',
    async function () {
      assert.equal(
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
        ].join('\n')
      )
    }
  )
})

/**
 * Get the length of a string, minus ANSI color characters.
 *
 * @param {string} value
 *   Cell value.
 * @returns {number}
 *   Cell size.
 */
function stringLength(value) {
  return strip(value).length
}
