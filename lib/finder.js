var escope = require('escope'),
  estraverse = require('estraverse');

function findRef(scope, ident) {
  var refs = scope.references;
  for (var i = 0; i < refs.length; ++i) {
    var ref = refs[i];
    if (ref.identifier === ident) {
      return ref;
    }
  }

  var found;
  (scope.childScopes || []).forEach(function(s, i) {
    var rs = findRef(s, ident);
    if (rs) found = rs;
  });

  return found;
}


module.exports.findRequire = function(ast, scopes) {
  scopes = scopes || escope.analyze(ast).scopes;

  var gs = scopes.filter(function(scope) {
    return scope.type == 'global';
  })[0],
    rs = [];

  ast = estraverse.traverse(ast, {
    enter: function(current, parent) {
      if (current.type === 'CallExpression' && current.callee.type === 'Identifier' &&
        current.callee.name === 'require' && current.arguments.length == 1 &&
        current.arguments[0].type == 'Literal') {

        var ref = findRef(gs, current.callee);
        if (!ref.resolved) { // global require function
          rs.push(current);
        }
      }
    }
  });

  return rs;
};


module.exports.findExports = function(ast, scopes) {
  scopes = scopes || escope.analyze(ast).scopes;

  var gs = scopes.filter(function(scope) {
    return scope.type == 'global';
  })[0],
    rs = [];

  ast = estraverse.traverse(ast, {
    enter: function(current, parent) {
      if (current.type === 'MemberExpression' && current.object.type === 'Identifier' &&
        current.object.name === 'exports') {
        var ref = findRef(gs, current.object);
        if (!ref.resolved) { // global exports variables
          rs.push(current.object);
        }
      } else if (current.type === 'AssignmentExpression' && current.left.type == 'Identifier' &&
        current.left.name == 'exports') {
        var ref = findRef(gs, current.left);
        if (!ref.resolved) {
          rs.push(current.left);
        }
      }
    }
  });

  return rs;
};

// only handle module.exports
module.exports.findModule = function(ast, scopes) {
  scopes = scopes || escope.analyze(ast).scopes;

  var gs = scopes.filter(function(scope) {
    return scope.type == 'global';
  })[0],
    rs = [];

  ast = estraverse.traverse(ast, {
    enter: function(current, parent) {
      if (current.type === 'MemberExpression' && current.object.type === 'Identifier' &&
        current.object.name === 'module' && (
          (current.computed && current.property.type == 'Literal' && current.property.value == 'exports') ||
          (!current.computed && current.property.type == 'Identifier' && current.property.name == 'exports'))) {

        var ref = findRef(gs, current.object);
        if (!ref.resolved) { // global module variables
          rs.push(current);
        }
      }
    }
  });

  return rs;
};