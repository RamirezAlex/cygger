'use strict'

const fs = require('fs')
const commmander = require('commander')
const { load, parse, generate } = require('./lib')

const program = new commmander.Command()
program.version('0.0.1', '-v, --version', 'Output the current version')

program
  .option('-U --baseURL <baseURL>', 'Host of the Swagger server')
  .option('-o --output-dir <outputDir>', 'Output directory to save the Cypress spec file')
  .option('-s --silent', 'Silent mode: it does not show the genereted test in the console')
  .option('-t --token-param <tokenParam>', 'Param that will represent the access token - WIP')
  .option('-l --login-path <loginPath>', 'Authorization path endpoint  - WIP')
  .option('-u --user <user>', 'Username to login  - WIP')
  .option('-p --pass <pass>', 'Password to login - WIP')
  .arguments('<SwaggerFile>')
  .parse(process.argv)

const { baseURL, outputDir, silent, args } = program

const main = async () => {
  const api = await load(args[0])
  const parsed = await parse(api, baseURL)

  const cypressTest = await generate(api.info.title, parsed)

  if (!silent) console.log(cypressTest)

  if (outputDir) {
    const fileName = args[0].split('/').pop().split('.')[0]
    const testFile = fs.createWriteStream(`${outputDir}/${fileName}.spec.js`, {
      flags: 'w'
    })

    testFile.write(cypressTest)
    testFile.write(require('os').EOL)
    testFile.end()
  }
}

module.exports = main
