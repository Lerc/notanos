

var ScreenBuffer = require('../')
var assert = require('assert')
var diff = ScreenBuffer.diff

describe('diff', function() {

  var a = new ScreenBuffer()
  a.update(0, [[0, 'A'], [1, 'B'], [1, 'C']])

  var b = new ScreenBuffer()
  b.update(1, [[0, 'A'], [1, 'B'], [1, 'C']])

  it('should return empty array for same buffer', function() {
    assert.deepEqual(diff(a, a), [])
    assert.deepEqual(diff(b, b), [])
  })
  
  it('should return copy operations', function() {
    assert.deepEqual(diff(a, b), [
      [0, 0, 0],
      [1, 1, 0]
    ])
    assert.deepEqual(diff(b, a), [
      1,
      [0, 1, 1]
    ])
  })

  it('should return operations', function() {
    assert.deepEqual(diff(new ScreenBuffer(), b), [
      [1, 0, "ABC", "0,1*2"]
    ])
  })
  
})




