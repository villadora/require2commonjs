var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');
var escope = require('escope');
var estraverse = require('estraverse');
var parser = require('./amd-parser');

var exprGen = require('./exprGen');

function r2c(file, options) {
  if (!fs.existsSync(file)) {
    throw new Error('File does not exist: ' + file);
  }


  var code = fs.readFileSync(file, 'utf8');
  var requireConfig = options.config || {};

  var ast = esprima.parse(code, {
    range: true,
    tokens: true,
    comment: true
  });

  var scopeManager = escope.analyze(ast);

  var amds = parser.parse(ast, scopeManager.scopes);

  if (amds.length === 0) {
    throw new Error("Can not find AMD module in file");
  }

  if (amds.length > 1) {
    throw new Error("More than one AMD module in one file, r2cjs don't know how to split files");
  }

  var amd = amds[0];
  // console.log(amd);

  if (amd.simpleObject) {
    // dependency free,  change module.exports = object
    var expr = exprGen.exportsTo(amd.object);

    return escodegen.generate(escodegen.attachComments({
      type: 'Program',
      body: [expr],
      range: expr.range
    }, ast.comments, ast.tokens), {
      comment: true
    });
  }

  if (amd.normalized) {
    // handle return
    amd.block.type = 'Program';
    var tree = escodegen.attachComments(amd.block, ast.comments, ast.tokens);
    return escodegen.generate(tree, {
      comment: true
    });
  }


  var block = amd.block;


  // return escodegen.generate(tree);
  return "";
}



module.exports = r2c;