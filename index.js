var debug = require('debug')('php-proxy-middleware')
var PHP = require('php-built-in-server')
var proxy = require('proxy-middleware')

module.exports = function(opts) {

  // interpret string argument as root option
  if (typeof opts == 'string') opts = { root: opts }
  else if (!opts) opts = {}

  var php = new PHP(opts.execPath, opts.iniFile)

  var forward
  var startUpError
  var shutdownHook

  php.on('listening', function(ev) {
    debug('PHP server listening on %s:%s', ev.host.address, ev.host.port)
    // The php process needs ~100ms to start listening. We would want to
    // listen for a data event here instead but there is no data written
    // to stdout upon startup.
    setTimeout(function() {
      forward = proxy({
        protocol: 'http:',
        hostname: ev.host.address,
        port: ev.host.port,
        pathname: opts.prefix || ''
      })
      php.emit('ready')
    }, 100)
  })

  php.on('error', function(ev) {
    var msg = '' + ev.error
    if (!forward && !startUpError) startUpError = msg
    console.log(msg)
  })

  // start the php server
  php.listen(opts.root, opts.port, opts.address, opts.router, opts.ini)

  return function(req, res, next) {

    // kill the php process when the server is closed
    if (!shutdownHook) req.connection.server.on('close',
      shutdownHook = php.close.bind(php)
    )

    if (startUpError) return next(startUpError)

    if (forward) {
      debug('Forwarding request %s', req.url)
      return forward(req, res, next)
    }

    debug('Waiting for PHP server to start')
    php.once('ready', function() {
      forward(req, res, next)
    })
  }
}
