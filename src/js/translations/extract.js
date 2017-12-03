var path = require("path");
var fs = require("fs");
var prettier = require("prettier");
var shortid = require("shortid");
var stringsById = {};
var jsxRe = /id\="XXXX"\s+defaultMessage=\{`([^`]+)`\}/g;
var funcRe = /id\:\s*"XXXX",\s*defaultMessage\:\s*`(.+)`/g;

function getReplaceJSX(id, message) {
  return 'id="' + id + '" defaultMessage={`' + message + "`}";
}

function getReplaceFunc(id, message) {
  return 'id:"' + id + '", defaultMessage:"' + message + '"';
}

function replaceJSX(content) {
  var match;
  while ((match = jsxRe.exec(content)) !== null) {
    var message = match[1];
    var id = shortid.generate();

    stringsById[id] = message;
    // Replace JSX
    content = content.replace(match[0], getReplaceJSX(id, message));
  }

  return content;
}

function replaceFunc(content) {
  var match;
  while ((match = funcRe.exec(content)) !== null) {
    var message = match[1];
    var id = shortid.generate();

    stringsById[id] = message;
    // Replace Func
    content = content.replace(match[0], getReplaceFunc(id, message));
  }

  return content;
}

function findAndReplace(content) {
  content = replaceJSX(content);
  content = replaceFunc(content);

  return content;
}

function extract(filename) {
  if (filename.indexOf(".json") > -1 || filename.indexOf("node_modules") > -1) {
    return;
  }
  var content = fs.readFileSync(filename, "utf8");
  var newContent = findAndReplace(content);

  if (newContent !== content) {
    try {
      newContent = prettier.format(newContent);
      fs.writeFileSync(filename, newContent, "utf8");
    } catch (err) {}
  }
}

function findFilesInDir(startPath, filter) {
  var results = [];

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter)); //recurse
    } else if (filename.indexOf(filter) >= 0) {
      console.log("-- found: ", filename);
      results.push(filename);
    }
  }
  return results;
}

function writeExtractions() {
  var json = JSON.stringify(stringsById, undefined, 2);
  console.log(json);
  fs.writeFile(path.join(__dirname, "new.json"), json);
}

var root_dir = path.join(__dirname, "..", "..", "..");
var plugins = path.join(root_dir, "plugins");
var src = path.join(root_dir, "src");
var external_plugins = path.join(root_dir, "..", "dcos-ui-plugins-private");

// var filename = path.join(__dirname, "..", "schemas/job-schema/Schedule.js");
// extract(filename);

var files = [].concat(
  findFilesInDir(plugins, ".js"),
  findFilesInDir(src, ".js"),
  findFilesInDir(external_plugins, ".js")
);

for (index in files) {
  extract(files[index]);
}
writeExtractions();
