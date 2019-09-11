'use strict'

const { load, parse, generate } = require('../lib')

const parsedSwagger = require('./todoparsed.json')

describe('Cygger CLI Application', () => {
  test('It should read a Swagger File', async () => {
    const data = await load('../examples/todo.yml')
    expect(data).toHaveProperty('swagger')
    expect(data).toHaveProperty('info')
    expect(data).toHaveProperty('definitions')
    expect(data).toHaveProperty('paths')
    expect(data).toHaveProperty('schemes')
    expect(data.paths).toHaveProperty('/')
    expect(data.paths).toHaveProperty('/{id}')
  })

  test('It should parse the data from a loaded Swagger file', async () => {
    const data = await parse(parsedSwagger)
    expect(data.endpoints).toBeDefined()
    expect(data.baseURL).toBeDefined()
    expect(data.baseURL).toEqual('')
    expect(data.paths).toBeDefined()
    expect(data.paths).toEqual(expect.arrayContaining(['/', '/{id}']))
  })

  test('It should generate cypress test from a parsed file', async () => {
    const parsed = await parse(parsedSwagger)
    const data = await generate('ToDo API', parsed)
    expect(data).toBeDefined()
  })
})
