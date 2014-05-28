module.exports.exportsTo = exportsTo;
module.exports.requireFn = requireFn;

function requireFn(varName, mod, range) {
  range = range || [0, varName ? 22 : 16];
  var min = range[0],
    max = range[1];

  var totalLen = mod.length + varName ? (varName.length + 20) : 14;

  var base = Math.max(0, max - totalLen);

  if (varName) {
    return {
      type: 'VariableDeclaration',
      declarations: [{
        type: 'VariableDeclarator',
        id: {
          type: 'Identifier',
          name: varName,
          range: [base, Math.min(max, base + 4 + varName.length)]
        },
        init: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'require',
            range: [Math.min(max, base + 5 + varName.length), Math.min(max, base + varName.length + 13)]
          },
          arguments: [{
            type: 'Literal',
            value: mod,
            raw: '"' + mod + '"',
            range: [Math.min(max, base + varName.length + 13), Math.min(max, base + varName.length + mod.length + 15)]
          }],
          range: [Math.min(max, base + 5 + varName.length), Math.min(max, base + varName.length + mod.length + 15)]
        },
        range: [base, Math.min(max, base + 20 + varName.lenth + mod.length)]
      }],
      kind: 'var',
      range: [base, max]
    };
  } else {
    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require',
          range: [base, Math.min(max, base + 8)]
        },
        arguments: [{
          type: 'Literal',
          value: mod,
          raw: '"' + mod + '"',
          range: [Math.min(max, base + 8), Math.min(max, base + mod.length + 14)]
        }],
        range: [base, Math.min(max, base + mod.length + 14)]
      },
      range: [base, Math.min(max, base + mod.length + 14)]
    };
  }
}

function exportsTo(object) {
  var range = object.range || [0, 0];
  var min = range[0],
    max = range[1];

  var base = Math.max(0, min - 15);

  return {
    type: "ExpressionStatement",
    expression: {
      type: 'AssignmentExpression',
      operator: "=",
      left: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: 'module',
          range: [base, Math.min(max, base + 7)]
        },
        property: {
          type: 'Identifier',
          name: 'exports',
          range: [Math.min(max, base + 8), Math.min(max, base + 14)]
        },
        range: [base, Math.min(max, base + 15)]
      },
      right: object,
      range: [base, max]
    },
    range: [base, max]
  };
}