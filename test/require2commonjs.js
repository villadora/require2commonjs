'use strict';

var path = require('path');
var esprima = require('esprima');

var r2c = require('../');

describe('convert', function() {
  it('standard', function() {
    var ouptut = r2c(path.join(__dirname, './fixtures/standard.js'));
  });

  it('normalized', function() {
    var ouptut = r2c(path.join(__dirname, './fixtures/normalized.js'));
  });

  it('depfree', function() {
    var ouptut = r2c(path.join(__dirname, './fixtures/depfree.js'));
  });
});
