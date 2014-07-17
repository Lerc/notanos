


var ScreenBuffer = require('../')
var assert = require('assert')
var patch = ScreenBuffer.patch

describe('patch', function() {

  var a

  beforeEach(function() {
    a = new ScreenBuffer()
  })

  it('should be able to change the screen size', function() {
    patch(a, [2, [0, 0, 22]])
    assert.equal(a.getRows(), 2)
    assert.equal(a.getCols(0), 22)
  })
  it('should be able to set cursor position', function() {
    patch(a, [[55,22]])
    assert.equal(a.cursorX, 55)
    assert.equal(a.cursorY, 22)
  })
  it('should be able to set cursor position', function() {
    a.update(0, [[0, 'A'], [1, 'B'], [2, 'C']])
    patch(a, [[1,1,0]])
    assert.equal(a.toString(), "ABC\nABC")
  })
  it('should be able to draw things', function() {
    patch(a, [[1,4,"Hello World","7*5,0,8*5"]])
    assert.equal(a.toString(), "\n    Hello World")
    assert.equal(a.getCell(1, 4)[0], 7)
    assert.equal(a.getCell(1, 5)[0], 7)
    assert.equal(a.getCell(1, 8)[0], 7)
    assert.equal(a.getCell(1, 9)[0], 0)
    assert.equal(a.getCell(1, 10)[0], 8)
    assert.equal(a.getCell(1, 14)[0], 8)
  })
  
})




