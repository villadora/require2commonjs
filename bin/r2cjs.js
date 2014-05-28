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


var paths = {};
var apath = argv.path;

if (typeof apath == 'string') {
  var p = apath.split('=');
  if (p.length < 2) {
    console.error('Invalid path argument: ' + apath);
    process.exit(1);
  }

  paths[p[0]] = p[1];

} else if (Object.prototype.toString.call(apath) == '[object Array]') {
  apath.forEach(function(pt) {
    var p = pt.split('=');
    if (p.length < 2) {
      console.error('Invalid path argument: ' + pt);
      process.exit(1);
    }

    paths[p[0]] = p[1];
  });
}


var baseUrl = argv.baseUrl || '.';

var root = argv.root;
if (root) root = path.join(cwd, root);

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

var output = r2c(file, {
  root: root,
  baseUrl: baseUrl,
  paths: paths
});

console.log(output);