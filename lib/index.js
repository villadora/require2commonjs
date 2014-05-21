var esprima = require('esprima');
var escodegen = require('escodegen');
var escope = require('escope');
var estraverse = require('estraverse');

function r2c(code, options) {

  var ast = esprima.parse(code, {
    range: true,
    token: true,
    comment: true
  });



  var tree = escodegen.attachComments(ast, ast.comments, ast.tokens);
  return escodegen.generate(tree);
}

module.exports = r2c;