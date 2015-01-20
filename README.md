# php-proxy-middleware

Node middleware that forwards requests to a built-in PHP server.
Uses [proxy-middleware](https://www.npmjs.com/package/proxy-middleware) and [php-built-in-server](https://www.npmjs.com/package/php-built-in-server) under the hood.


## Usage

```js
var express = require('express');
var php = require('php-proxy-middleware');

var app = express();

// add routes to be handled by express here
// ...

// forward all other requests to the php server
app.use(php(__dirname + '/php'));
```

### Route forwarding

You can also selectively forward a single route:

```js
app.use('/api', php(__dirname + '/php'));
```

Requests to `/api/foo.php` for example will be proxied to
`http://localhost:####/foo.php`

If you want the PHP server to see the original URL (starting with  `/api`)
you can specify a URL prefix:

```js
app.use('/api', php({
  root: __dirname + '/php',
  prefix: '/api'
}));
```

### Available Options

```js
php({
  phpPath: 'path/to/phpExecutable',
  address: '0.0.0.0', // which interface to bind to
  port: '5000', // will auto-detect a free port otherwise
  iniFile: '/path/to/php.ini',
  ini: { max_execution_time: 60, error_log: '...' },
  root: 'path/to/docroot',
  router: 'path/to/router.php',
  prefix: '/some/url/prefix/'
});
```


### The MIT License (MIT)

Copyright (c) 2014 Felix Gnass

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
