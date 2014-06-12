var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');
var escope = require('escope');
var estraverse = require('estraverse');
var parser = require('amd-parser');

var exprGen = require('./exprGen');

function r2c(file, options) {

  if (!fs.existsSync(file)) {
    throw new Error('File does not exist: ' + file);
  }

  options = options || {};

  var code = fs.readFileSync(file, 'utf8');
  var root = options.root || path.dirname(file);
  var baseUrl = options.baseUrl || '.';
  var paths = options.paths || {};

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

  // add require('dep');
  var pos = block.range[0];
  for (var mod in amd.dependencies) {
    var varName = amd.dependencies[mod];

    if (mod.indexOf('/') != -1) {

      // normalize mod
      var p = mod.split('/')[0];
      if (paths.hasOwnProperty(p)) {
        mod = mod.replace(new RegExp(p), paths[p]);
      }

      mod = path.relative(path.dirname(file), path.join(root, baseUrl, mod));

      if (!/^\./.test(mod))
        mod = './' + mod;
    }


    var expr = exprGen.requireFn(varName, mod, [0, pos]);
    pos -= (expr.range[1] - expr.range[0]);
    block.body.unshift(expr);
  }


  amd.returns.forEach(function(ret) {
    var retVal = ret.argument;
    delete ret.argument;

    var expr = exprGen.exportsTo(retVal);

    ret.type = expr.type;
    ret.expression = expr.expression;
  });



  block.type = 'Program';
  var tree = escodegen.attachComments(block, ast.comments, ast.tokens);

  return escodegen.generate(tree);
}


module.exports = r2c;