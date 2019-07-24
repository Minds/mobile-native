'use strict';

/**
 * find specific value in json object properties
 */
const findPaths = (
  obj,
  searchValue,
  { searchKeys = typeof searchValue === "string", maxDepth = 20 } = {}
) => {
  const paths = []
  const notObject = typeof searchValue !== "object"
  const gvpio = (obj, maxDepth, prefix) => {
    if (!maxDepth) return

    for (const [curr, currElem] of Object.entries(obj)) {

      if (typeof currElem === "object") {
        gvpio(currElem, maxDepth - 1, prefix + curr + ".")
        if (notObject) continue
      }

      if (currElem.includes(searchValue)) {
        paths.push(prefix + curr)
      }
    }
  }
  gvpio(obj, maxDepth, "")
  return paths
}

/**
 * Add diff capability to arrays
 */
Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

const fs = require('fs');
const localesFolder = 'locales';
const mainFile = 'en.json';
const validationExpressions = [];
validationExpressions.push(/\{\{(.*?)\}\}/g);
validationExpressions.push(/\&\{(.*?)\}\&/g);


let rawdata = fs.readFileSync(`${localesFolder}/${mainFile}`); 
const mainFile_str_data = rawdata.toString();
const mainFile_json_data = JSON.parse(rawdata);

//Every expression that matches in main file
validationExpressions.forEach(validationExpression => {
  console.log(`Validating language files for tags ${validationExpression.toString()} ...`)
  const mainFile_expresions = [...new Set(mainFile_str_data.match(validationExpression))];
  fs.readdirSync(localesFolder).forEach(file => { //for each locale file...
    if(file != mainFile){
      rawdata = fs.readFileSync(`${localesFolder}/${file}`);
      const currentFile_str_data = rawdata.toString();
      const currentFile_json_data = JSON.parse(rawdata);

      let failedExpresions = [];
      mainFile_expresions.forEach((exp) =>{ //...look for each expression in main file...
        const mainFile_matches = mainFile_str_data.match(new RegExp(exp,'g'));
        const currentFile_matches = currentFile_str_data.match(new RegExp(exp,'g'));
        if(!currentFile_matches || (mainFile_matches.length != currentFile_matches.length)){ //...if there is a difference...
          if(!(exp in failedExpresions)){//...that isn't already added to failed expresions...
            const mainFile_expressionPath = findPaths(mainFile_json_data,exp);
            const currentFile_expressionPath = findPaths(currentFile_json_data,exp) || [];
            failedExpresions[exp] = mainFile_expressionPath.diff(currentFile_expressionPath); //...add it to failed expressions
          }
        }
      });
      if(Object.entries(failedExpresions).length !== 0){
        console.log("Validation failed for some expressions in file " + file);
        for (const [exp, paths] of Object.entries(failedExpresions)) {
          console.log(`   Expression ${exp} in ${paths.join(' or ')}`);
        }
      } else {
        console.log("All good in file " + file);
      }
    }
  });
  console.log("-------------------------------------------------------------------------");
})

