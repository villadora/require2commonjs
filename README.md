
# An converter from requirejs to commonjs - require2commonjs

[![NPM version](https://badge.fury.io/js/require2commonjs.svg)](http://badge.fury.io/js/require2commonjs) [![Build Status](https://travis-ci.org/villadora/require2commonjs.svg?branch=master)](https://travis-ci.org/villadora/require2commonjs) [![Dependency Status](https://gemnasium.com/villadora/require2commonjs.svg)](https://gemnasium.com/villadora/require2commonjs)

This tool helps you convert your js module from AMD to CommonJS form, which could be used in commonjs system like [nodejs](http://nodejs.org), [cortex](), [spm](http://spm.io)

Especially when you manage your js files via requirejs, you can pass config in requirejs like _root_, _baseUrl_, _paths_ as options, to make =r2cjs= handle your relative dependencies correctly.


Code like following: 

```javascript
define([
  'backbone',
  'zepto',
  'view/layout'
], function(Backbone, $, Layout) {
  var App = {};

  $.extend(App, Backbone.Events);

  App.layout = new Layout();

  return App;
})
```

will be transformed to:

```javascript
var Layout = require('./view/layout');
var Backbone = require('backbone');
var $ = zepto;

var App = {};

$.extend(App, Backbone.Events);

App.layout = new Layout();

module.exports = App;
```

## Installation

```bash
$ npm install require2commonjs --save
```

## Usage

``` bash
r2cjs --root . --baseUrl app base.js
```

### Convert one file


``` bash
r2cjs rq.js >  common.js

# or

r2cjs rq.js -o common.js
```


### Convert multiple files

``` bash
r2cjs --dest ../common base.js app.js layout.js
```

## APIs

```js
var r2c = require('require2commonjs');

r2c(file, {
  root:root, 
  baseUrl: baseUrl, 
  paths: paths
});

```

## Licence

MIT
