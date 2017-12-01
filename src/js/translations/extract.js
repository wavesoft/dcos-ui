var path = require("path");
var fs = require("fs");
var prettier = require("prettier");
var shortid = require("shortid");
var stringsById = {};
var re = /id\="XXXX"\s+defaultMessage=\{`([^`]+)`\}/g;

function getReplaceJSX(id, message) {
  return 'id="' + id + '" defaultMessage={`' + message + "`}";
}

function replaceJSX(content) {
  var match;
  while ((match = re.exec(content)) !== null) {
    var message = match[1];
    var id = shortid.generate();

    stringsById[id] = message;
    // Replace JSX
    content = content.replace(match[0], getReplaceJSX(id, message));
  }

  return content;
}

function findAndReplace(content) {
  content = replaceJSX(content);

  return content;
}

function extract(filename) {
  var content = fs.readFileSync(filename, "utf8");

  content = findAndReplace(content);
  content = prettier.format(content);
  console.log(content);
  fs.writeFileSync(filename, content, "utf8");
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

var root_dir = path.join(__dirname, "..", "..", "..");

var files = findFilesInDir(root_dir, ".js");
for (filename in files) {
  extract(filename);
}

console.log(JSON.stringify(stringsById, undefined, 2));
