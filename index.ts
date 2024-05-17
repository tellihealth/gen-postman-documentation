// const core = require("@actions/core");
// const github = require("@actions/github");
// const fs = require("fs");
// const yaml = require("js-yaml");

// try {
//   const ymlFile = core.getInput("yml");
//   console.log(`Hello ${ymlFile}!`);

//   // Get the input yml file
//   const fileContents = fs.readFileSync(ymlFile, "utf8");
//   const data = yaml.safeLoad(fileContents);

//   console.log(data);

//   const time = new Date().toTimeString();
//   core.setOutput("postman-url", time);

//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2);
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }

console.log("Hello World!");
