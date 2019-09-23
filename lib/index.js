'use strict'

const SwaggerParser = require('swagger-parser')
const path = require('path')

/**
 * Loads the Swagger file in YAML or JSON and parse with references resolved.
 * @param swaggerFile - The location of the Swagger file
 * @returns {Object} Parsed Swagger file.
 */
const load = async (swaggerFile) => {
  try {
    return await SwaggerParser.dereference(path.join(process.cwd(), swaggerFile))
  } catch (e) {
    console.log('Error reading Swagger file: ', e)
    process.exit()
  }
}

/**
 * Parse the API loaded from Swagger file
 * @param api - API loaded from Swagger file
 * @param baseURL - The location of the Swagger file
 * @returns {Object} Parsed API
 */
const parse = async (api, baseURL) => {
  const result = {}
  result.endpoints = []
  result.paths = Object.keys(api.paths)

  if (baseURL) {
    result.baseURL = baseURL
  } else if (api.swagger && api.schemes && api.schemes[0] && api.host && api.basePath) {
    result.baseURL = `${api.schemes[0]}://${api.host}${api.basePath}`
  } else if (api.openapi && api.servers[0]) {
    result.baseURL = api.servers[0].url
  } else {
    result.baseURL = ''
  }

  Object.keys(api.paths).map((path) => {
    const endpoint = {}
    endpoint.responses = []
    endpoint.fullPath = result.baseURL + path
    Object.keys(api.paths[path]).map((method) => {
      switch (method) {
        case 'post':
        case 'get':
        case 'put':
        case 'patch':
        case 'delete':
          Object.keys(api.paths[path][method].responses).map((status) => {
            if (Number(status) >= 200 && Number(status) < 400) {
              let { schema } = api.paths[path][method].responses[status]
              let type = 'object'
              if (schema) {
                if (schema.properties) {
                  schema = schema.properties
                } else if (schema.items) {
                  schema = schema.items.properties
                  type = 'array'
                }
              }
              endpoint.responses.push({
                status,
                method,
                schema,
                type,
                params: api.paths[path][method].parameters,
                description: api.paths[path][method].summary || '<DESCRIBE TEST>'
              })
            }
          })
          break
        default:
          break
      }
    })
    result.endpoints.push(endpoint)
  })

  return result
}

/**
 * Generates Cypress test out of the parsed API
 * @param title - Title of the API
 * @param parsed - Parsed API
 * @returns {String} Generated test
 */
const generate = async (title, parsed) => {
  // HACK: indentation here is broken in favor of the generated file
  let cypressTest = `/// <reference types="Cypress" />

describe ('${title}', () => {`

  parsed.endpoints.map((endpoint, i) => {
    endpoint.responses.map((resp) => {
      let body

      if (resp.params && resp.params[0] && resp.params[0].in === 'body') {
        if (resp.params[0].schema && resp.params[0].schema.properties) {
          Object.keys(resp.params[0].schema.properties).map((param) => {
            if (!resp.params[0].schema.properties[param].readOnly) {
              if (!body) body = {}
              body[param] = '<PARAM>'
            }
          })
        }
      }

      const request = JSON.stringify({
        method: resp.method,
        url: endpoint.fullPath,
        body
      }).replace(/"/g, '\'')

      let asserts = `expect(resp.status).to.equal(${resp.status});`
      if (resp.schema) {
        const arr = resp.type === 'array' ? '[0]' : ''
        Object.keys(resp.schema).map((prop) => {
          // HACK: indentation here is broken in favor of the generated file
          asserts += `\n        expect(resp.body${arr}).to.have.property('${prop}');`
        })
      }

      // HACK: indentation here is broken in favor of the generated file
      cypressTest += `
  it ('should ${resp.description}', () => {
    cy.request(${request})
      .then((resp) => {
        // Assertions here
        ${asserts}
      });
  });
`
    })
  })

  // HACK: indentation here is broken in favor of the generated file
  cypressTest += `
});`

  return cypressTest
}

module.exports = {
  load,
  parse,
  generate
}
