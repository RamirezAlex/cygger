'use strict'

const cygger = require('../')

describe('First test', () => {
  test('Should pass', () => {
    expect(1).toBe(1)
  })

  test('It has methods', () => {
    console.log(cypress.getParams())
    expect(getParams).toBeDefined()
  })
})\3