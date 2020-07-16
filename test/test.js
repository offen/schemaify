var path = require('path')
var tape = require('tape')
var browserify = require('browserify')
var vm = require('vm')

tape.test('passes schema', function (t) {
  bundle('ok.js', function (err, src) {
    if (err) {
      t.fail(err)
    }

    vm.runInNewContext(src, {
      console: { log: log }
    })

    function log (value) {
      t.equal(value, true, 'passes')
      t.end()
    }
  })
})

tape.test('does not pass schema', function (t) {
  bundle('fail.js', function (err, src) {
    if (err) {
      t.fail(err)
    }

    vm.runInNewContext(src, {
      console: { log: log }
    })

    function log (value) {
      t.equal(value, false, 'fails')
      t.end()
    }
  })
})

tape.test('secure schema by default', function (t) {
  bundle('insecure.schema', function (err, src) {
    t.ok(err, 'does not compile insecure schema')
    t.match(err.message, /is not secure/, 'has correct error message')
    t.end()
  })
})

tape.test('invalid schema', function (t) {
  bundle('invalid.schema', function (err, src) {
    t.ok(err, 'does not compile invalid schema')
    t.match(err.message, /Unexpected token/, 'has correct error message')
    t.end()
  })
})

function bundle (file, callback) {
  var b = browserify()
  b.add(path.join(__dirname, file))
  b.transform(path.resolve(__dirname, '..'))
  b.bundle(callback)
}
