#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var argv = require('minimist')(process.argv.slice(2));

if (argv.version || argv.v) {
  var pkg = require('../package.json');
  process.stdout.write([pkg.name, 'v' + pkg.version].join(' ') + "\n");
  process.exit(0);
}

var cwd = process.cwd();

var files = argv._;

if (!files || !files.length) {
  console.error("Please provide at least one file");
  process.exit(1);
}

// handl one file now
var file = files[0];

file = path.resolve(cwd, file);


var output = argv.output || argv.o;
var destDir = argv.dest;

var r2c = require('../lib');

// if (destDir) {
//   fs.statSync(path.resolve(cwd, destDir), function(err, stat) {

//   });
// }

var output = r2c(file, {});

console.log(output);