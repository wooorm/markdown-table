/**
 * @typedef Options
 * @property {string|null|Array<string|null|undefined>} [align]
 * @property {boolean} [padding=true]
 * @property {boolean} [delimiterStart=true]
 * @property {boolean} [delimiterStart=true]
 * @property {boolean} [delimiterEnd=true]
 * @property {boolean} [alignDelimiters=true]
 * @property {(value: string) => number} [stringLength]
 */

/**
 * @typedef {Options} MarkdownTableOptions
 * @todo
 *   Remove next major.
 */

/**
 * Create a table from a matrix of strings.
 *
 * @param {Array<Array<string|null|undefined>>} table
 * @param {Options} [options]
 * @returns {string}
 */
export function markdownTable(table, options = {}) {
  const align = (options.align || []).concat()
  const stringLength = options.stringLength || defaultStringLength
  /** @type {Array<number>} Character codes as symbols for alignment per column. */
  const alignments = []
  /** @type {Array<Array<string>>} Cells per row. */
  const cellMatrix = []
  /** @type {Array<Array<number>>} Sizes of each cell per row. */
  const sizeMatrix = []
  /** @type {Array<number>} */
  const longestCellByColumn = []
  let mostCellsPerRow = 0
  let rowIndex = -1

  // This is a superfluous loop if we don’t align delimiters, but otherwise we’d
  // do superfluous work when aligning, so optimize for aligning.
  while (++rowIndex < table.length) {
    /** @type {Array<string>} */
    const row = []
    /** @type {Array<number>} */
    const sizes = []
    let columnIndex = -1

    if (table[rowIndex].length > mostCellsPerRow) {
      mostCellsPerRow = table[rowIndex].length
    }

    while (++columnIndex < table[rowIndex].length) {
      const cell = serialize(table[rowIndex][columnIndex])

      if (options.alignDelimiters !== false) {
        const size = stringLength(cell)
        sizes[columnIndex] = size

        if (
          longestCellByColumn[columnIndex] === undefined ||
          size > longestCellByColumn[columnIndex]
        ) {
          longestCellByColumn[columnIndex] = size
        }
      }

      row.push(cell)
    }

    cellMatrix[rowIndex] = row
    sizeMatrix[rowIndex] = sizes
  }

  // Figure out which alignments to use.
  let columnIndex = -1

  if (typeof align === 'object' && 'length' in align) {
    while (++columnIndex < mostCellsPerRow) {
      alignments[columnIndex] = toAlignment(align[columnIndex])
    }
  } else {
    const code = toAlignment(align)

    while (++columnIndex < mostCellsPerRow) {
      alignments[columnIndex] = code
    }
  }

  // Inject the alignment row.
  columnIndex = -1
  /** @type {Array<string>} */
  const row = []
  /** @type {Array<number>} */
  const sizes = []

  while (++columnIndex < mostCellsPerRow) {
    const code = alignments[columnIndex]
    let before = ''
    let after = ''

    if (code === 99 /* `c` */) {
      before = ':'
      after = ':'
    } else if (code === 108 /* `l` */) {
      before = ':'
    } else if (code === 114 /* `r` */) {
      after = ':'
    }

    // There *must* be at least one hyphen-minus in each alignment cell.
    let size =
      options.alignDelimiters === false
        ? 1
        : Math.max(
            1,
            longestCellByColumn[columnIndex] - before.length - after.length
          )

    const cell = before + '-'.repeat(size) + after

    if (options.alignDelimiters !== false) {
      size = before.length + size + after.length

      if (size > longestCellByColumn[columnIndex]) {
        longestCellByColumn[columnIndex] = size
      }

      sizes[columnIndex] = size
    }

    row[columnIndex] = cell
  }

  // Inject the alignment row.
  cellMatrix.splice(1, 0, row)
  sizeMatrix.splice(1, 0, sizes)

  rowIndex = -1
  /** @type {Array<string>} */
  const lines = []

  while (++rowIndex < cellMatrix.length) {
    const row = cellMatrix[rowIndex]
    const sizes = sizeMatrix[rowIndex]
    columnIndex = -1
    /** @type {Array<string>} */
    const line = []

    while (++columnIndex < mostCellsPerRow) {
      const cell = row[columnIndex] || ''
      let before = ''
      let after = ''

      if (options.alignDelimiters !== false) {
        const size =
          longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0)
        const code = alignments[columnIndex]

        if (code === 114 /* `r` */) {
          before = ' '.repeat(size)
        } else if (code === 99 /* `c` */) {
          if (size % 2) {
            before = ' '.repeat(size / 2 + 0.5)
            after = ' '.repeat(size / 2 - 0.5)
          } else {
            before = ' '.repeat(size / 2)
            after = before
          }
        } else {
          after = ' '.repeat(size)
        }
      }

      if (options.delimiterStart !== false && !columnIndex) {
        line.push('|')
      }

      if (
        options.padding !== false &&
        // Don’t add the opening space if we’re not aligning and the cell is
        // empty: there will be a closing space.
        !(options.alignDelimiters === false && cell === '') &&
        (options.delimiterStart !== false || columnIndex)
      ) {
        line.push(' ')
      }

      if (options.alignDelimiters !== false) {
        line.push(before)
      }

      line.push(cell)

      if (options.alignDelimiters !== false) {
        line.push(after)
      }

      if (options.padding !== false) {
        line.push(' ')
      }

      if (
        options.delimiterEnd !== false ||
        columnIndex !== mostCellsPerRow - 1
      ) {
        line.push('|')
      }
    }

    lines.push(
      options.delimiterEnd === false
        ? line.join('').replace(/ +$/, '')
        : line.join('')
    )
  }

  return lines.join('\n')
}

/**
 * @param {string|null|undefined} [value]
 * @returns {string}
 */
function serialize(value) {
  return value === null || value === undefined ? '' : String(value)
}

/**
 * @param {string} value
 * @returns {number}
 */
function defaultStringLength(value) {
  return value.length
}

/**
 * @param {string|null|undefined} value
 * @returns {number}
 */
function toAlignment(value) {
  const code = typeof value === 'string' ? value.codePointAt(0) : 0

  return code === 67 /* `C` */ || code === 99 /* `c` */
    ? 99 /* `c` */
    : code === 76 /* `L` */ || code === 108 /* `l` */
    ? 108 /* `l` */
    : code === 82 /* `R` */ || code === 114 /* `r` */
    ? 114 /* `r` */
    : 0
}
