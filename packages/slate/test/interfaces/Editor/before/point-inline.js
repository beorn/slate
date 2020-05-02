/** @jsx jsx */

import { Editor } from 'slate'
import { jsx } from '../../..'

export const input = (
  <editor>
    <block>
      <text/>
      <inline>a</inline>
      <text/>
    </block>
  </editor>
)

export const test = editor => {
  console.error("editor", dumpEditor(editor))
  return Editor.before(editor, { path: [0, 1, 0], offset: 0 })
}

export const output = { path: [0, 0], offset: 0 }








export function dumpEditor(editor) {
  const positions = Array.from(Editor.positions(editor, { at: [] }))
  return [
    dumpNodes(editor),
    '\nSelection:',
    dumpRange(editor.selection, positions),
    '\nPositions:',
    dumpPositions(positions)
  ].join('\n')
}

function dumpPositions(positions) {
  if (positions.length > 20) return `Hid ${positions.length} positions (too many to show)`
  return positions.map((p, index) => `#${index}:  ${dumpPoint(p)}`).join('\n')
}

export function dumpNodes(editor) {
  return [...Editor.nodes(editor, { at: [] })]
    .map(([node, path]) => `[${path}]       ${dumpNode(node)}`)
    .join('\n')
}

function dumpNode(obj) {
  let {
    type = 'text',
    children = [], // all nodes
    value,
    text, // text nodes only
    ...node // custom props
  } = obj
  if (Editor.isEditor(obj)) {
    type = 'editor'
  }

  let n = `<${type}>`
  // treat value and text nicer - they're usually the texual content
  if (text) {
    n += ` '${escape(text)}'`
  }
  if (value) {
    n += ` value:'${escape(value)}'`
  }
  // the rest of the properties get a more JSON look
  if (type === 'editor') {
    // don't include props, or custom props later
  } else if (Object.keys(node).length > 0) {
    n += ` ${escape(JSON.stringify(node))}`
  }
  return n
}

// escape to make everything one line
function escape(s) {
  return s.split('\n').join('\\n')
}

function dumpPoint(point) {
  if (!point || !Array.isArray(point.path)) return `${point}`
  let out = '[' + point.path.join(',') + ']+' + point.offset
  return out
}

export function dumpRange(range, positions = undefined) {
  if (!range) {
    return '-\n'
  }
  if (positions) {
    const anchorIndex = positions.findIndex(p => Point.equals(p, range.anchor))
    const focusIndex = positions.findIndex(p => Point.equals(p, range.focus))
    return (
      `#${anchorIndex}: ${dumpPoint(range.anchor)} -\n` +
      `#${focusIndex}: ${dumpPoint(range.focus)}`
    )
  }
  return dumpPoint(range.anchor) + '  –\n' + dumpPoint(range.focus)
}