#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var argv = require('minimist')(process.argv.slice(2));

if (argv.version || argv.v) {
  var pkg = require('../package.json');
  process.stdout.write('v' + pkg.version + "\n");
  process.exit(0);
}


if (argv.help || argv.h) {
  console.log("Usage: r2cjs [--root <root path>] [--baseUrl <baseUrl for requirejs>] [-o|--output <path of output file>] file");
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
var destDir = argv.dest;
var root = argv.root;

if (root) root = path.resolve(cwd, root);


var r2c = require('../lib');

if (files.length === 1) {
  // handl one file now
  var file = files[0];

  file = path.resolve(cwd, file);

  var outputFile = argv.output || argv.o;


  if (!outputFile) {
    if (destDir) {
      outputFile = path.resolve(destDir, path.relative(root || path.dirname(file), file));
    }
  }

  var output = r2c(file, {
    root: root,
    baseUrl: baseUrl,
    paths: paths
  });

  if (!outputFile) {
    console.log(output);
  } else {
    fs.writeFileSync(path.resolve(cwd, outputFile), output, 'utf8');
  }
} else {
  if (destDir) destDir = path.resolve(cwd, destDir);
  else {
    console.error('Dest directory must be given when more than one file provided');
    process.exit(1);
  }

  root = root || cwd;

  files.map(function(f) {
    return path.resolve(cwd, f);
  }).forEach(function(file) {
    var outputFile = path.resolve(destDir, path.relative(root, file));

    var output = r2c(file, {
      root: root,
      baseUrl: baseUrl,
      paths: paths
    });

    fs.writeFileSync(outputFile, output, 'utf8');
  });
}