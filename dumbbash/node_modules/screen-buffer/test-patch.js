
/*jshint bitwise:false*/
var ScreenBuffer = require('./')

var a = new ScreenBuffer()
var b = new ScreenBuffer()

a.setRows(40)

function randChar() {
  return String.fromCharCode(32 + ~~(Math.random() * 95))
}

function randomRow() {
  var out = []
  var count = 80 + ~~(Math.random() * 100)
  for (var i = 0; i < count; i ++) out.push([~~(Math.random() * 2), randChar()])
  return out
}

for (var i = 0; i < a.getRows(); i ++) {
  a.update(i, randomRow())
}

for (var n = 0; n < 10; n ++) {
  var o = ScreenBuffer.diff(b, a)
  ScreenBuffer.patch(b, o)
  //console.log('==============================================')
  //console.log(a.toString() + '\n\n' + b.toString())
  console.log(a.toString() == b.toString())
  //console.log(a.getRows() == b.getRows())
  a.setRows(12 + ~~(Math.random() * 24))
  for (var i = 0; i < a.getRows(); i ++) {
    a.update(i, randomRow())
  }
}

function benchmark(what, f) {
  var sta = new Date().getTime()
  f()
  var fin = new Date().getTime()
  console.log(what, fin - sta)
}


var patches = []

benchmark('patch 300 times', function() {
  var last = new ScreenBuffer()
  for (var n = 0; n < 300; n ++) {
    patches.push(ScreenBuffer.diff(last, a))
    last = a.clone()
    a.setRows(20 + ~~(Math.random() * 30))
    for (var i = 0; i < a.getRows(); i ++) {
      a.update(i, randomRow())
    }
  }
})

benchmark('apply 300 times', function() {
  var buf = new ScreenBuffer()
  patches.forEach(function(patch) {
    ScreenBuffer.patch(buf, patch)
  })
  console.log(buf.toString() == a.toString())
})












