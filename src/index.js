'use strict'

const commmander = require('commander')
const program = new commmander.Command()
program.version('0.0.1', '-v, --version', 'Output the current version')

program
  .option('-U --baseURL <baseURL>', 'Host of the Swagger server')
  .option('-t --token-param <tokenParam>', 'Param that will represent the access token')
  .option('-l --login-path <loginPath>', 'Authorization path endpoint')
  .option('-u --user <user>', 'Username to login')
  .option('-p --pass <pass>', 'Password to login')
  .arguments('<SwaggerFile>')
  .parse(process.argv)

const { baseURL, tokenParam, loginPath, user, pass, args } = program

console.log(baseURL, tokenParam, loginPath, user, pass, args)

const SwaggerParser = require('swagger-parser')
const loadSwagger = async () => {
  try {
    return await SwaggerParser.dereference(args[0])
  } catch(e) {
    console.log('Error----> ', e)
  }
}

const getPaths = (api) => {
  return Object.keys(api.paths)
}

const getTestDescription = (api, path, method) => {
  return api.paths[path][method] && api.paths[path][method].summary
      || '<DESCRIBE TEST>'
}

const getParams = (path) => {
  return []
}

const getResponses = (path) => {
  const method = Object.keys(path)
  return {
    method: method[0],
    responses: path[method[0]].responses
  }
}

const main = async () => {
  const api = await loadSwagger()
  console.log(api)
  const baseUrl = baseURL || `${api.schemes[0]}://${api.host}${api.basePath }`
  const paths = getPaths(api)
  // console.log('PATHS ---> ', paths)

  const startTest = `
/// <reference types="Cypress" />

describe('${api.info.title}', () => {
  let ${tokenParam}
  const baseUrl = '${baseUrl}'

  before(() => {
    cy.request('POST', '${baseUrl}${loginPath}', {
      "email": "${user}",
      "password": "${pass}"
    })
      .then((resp) => {
        ${tokenParam} = resp.body.${tokenParam}
      })
  })
  `
  console.log(startTest)

  paths.map(path => { 
    // console.log(baseUrl + path)
    const responses = getResponses(api.paths[path])
    // console.log(responses)

    const description = getTestDescription(api, path, responses.method)
    console.log(path, api.paths[path][responses.method].responses['200'])

    if (path !== loginPath) {
      const test = `
  it ('Should ${description}', () => {
    cy.request({
      method: '${responses.method.toUpperCase()}', 
      url: '${baseUrl}${path}',
      auth: {
        bearer: ${tokenParam}
      }
    })
      .then((resp) => {
        // expect(resp.body).to.have.property('accessToken')
        console.log('RESPONSE ---> ', resp.body)
      })
  })`

      // console.log(test)
    }
  })

  const endTest = `
})
  `

  console.log(endTest)
}

module.exports = main
