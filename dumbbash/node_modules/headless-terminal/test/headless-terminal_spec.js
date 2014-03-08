
var HeadlessTerminal = require('../')
var assert = require('assert')

function assertBuffer(buffer, texts, attrs) {
  var i, j
  for (i = 0; i < texts.length; i ++) {
    for (j = 0; j < texts[i].length; j ++) {
      assert.equal(buffer.getCell(i, j)[1], texts[i][j])
    }
  }
  for (i = 0; i < attrs.length; i ++) {
    for (j = 0; j < attrs[i].length; j ++) {
      var attr = buffer.getCell(i, j)[0]
      assert.equal(attr, attrs[i][j],
        "expected attribute at " + i + "," + j + " to be " + attrs[i][j] + ", " +
        "but got " + attr)
    }
  }
}

/**
 * Encodes an attribute
 */
function enc(bg, fg) {
  if (fg == null) fg = 257
  if (bg == null) bg = 256
  return (fg << 9) | bg
}

describe('HeadlessTerminal', function() {

  it('should not mock dom any more', function() {
    assert(global.document === undefined)
  })

  /**
   * This is a simple acceptance test...
   */
  it('should write terminal contents into the buffer', function() {
    var terminal = new HeadlessTerminal(4, 3)
    terminal.open()
    terminal.write('a\r\n\x1b[38;5;22ma\x1b[48;5;1mbn\x1b[mc\r\nd')
    assertBuffer(terminal.displayBuffer, ['a','abnc','d'], [[enc()], [enc(null, 22), enc(1, 22), enc(1, 22), enc()], [enc()]])
  })

  it('should allow resizing', function() {
    var terminal = new HeadlessTerminal(4, 3)
    terminal.open()
    terminal.write('a\r\n\x1b[38;5;22ma\x1b[48;5;1mbn\x1b[mc\r\nd')
    terminal.resize(4, 2)
    assertBuffer(terminal.displayBuffer, ['abnc','d'], [[enc(null, 22), enc(1, 22), enc(1, 22), enc()], [enc()]])
  })
  
})
