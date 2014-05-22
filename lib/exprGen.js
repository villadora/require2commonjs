module.exports.exportsTo = exportsTo;

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
          range: [base, Math.min(min, base + 7)]
        },
        property: {
          type: 'Identifier',
          name: 'exports',
          range: [base + 8, Math.min(min, base + 14)]
        },
        range: [base, Math.min(min, base + 15)]
      },
      right: object,
      range: [base, max]
    },
    range: [base, max]
  };
}