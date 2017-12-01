var path = require("path");
var fs = require("fs");
var googleTranslate = require("google-translate")(
  "AIzaSyAp36PF3Zg1ZUcLBRoOXmlcs9k0cX0bvOU"
);
var english = require("./en-US.json");
var chinese = {};
var error = null;

function write() {
  var json = JSON.stringify(chinese, undefined, 2);
  console.log(json);
  fs.writeFile(path.join(__dirname, "zh-CH.json"), json);
}

function checkDone() {
  if (error) {
    return;
  }
  if (Object.keys(chinese).length === Object.keys(english).length) {
    write();
  } else {
    console.log(
      "checking",
      Object.keys(chinese).length,
      Object.keys(english).length
    );
    setTimeout(checkDone, 1000);
  }
}
checkDone();

for (var k in english) {
  googleTranslate.translate(
    english[k],
    "en",
    "zh",
    (function(k) {
      return function(err, translation) {
        if (err) {
          error = err;
          console.error(err);
        }
        console.log(english[k], translation.translatedText);
        chinese[k] = translation.translatedText;
      };
    })(k)
  );
}
