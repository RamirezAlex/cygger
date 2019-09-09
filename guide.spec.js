/// <reference types="Cypress" />

let accessToken = null
const baseUrl = 'http://localhost:3000'

before(() => {
  cy.request('POST', `${baseUrl}/users/login`, {
    "email": "jamespurdy@hilton.com",
    "password": "IAmTheManager"
  })
    .then((resp) => {
      accessToken = resp.body.accessToken
    })
})

describe('User', () => {
  it ('Should return JSON', () => {
    cy.request('GET', `${baseUrl}/data`)
      .then((resp) => {
        console.log(resp.body)
        expect(resp.body).not.equal(null)
      })
  })

  it ('Should login', () => {
    cy.request('POST', `${baseUrl}/users/login`, {
      "email": "jamespurdy@hilton.com",
      "password": "IAmTheManager"
    })
      .then((resp) => {
        // expect(resp.body).to.contain('accessToken')
        console.log('RESPONSE ---> ', resp.body.accessToken)
        console.log('AccessToken ---> ', accessToken)
      })
  })

  it ('Should query Accounts', () => {
    cy.request({
      method: 'GET', 
      url: `${baseUrl}/users/accounts`,
      setImmediate: true,
      auth: {
        bearer: accessToken
      }
    })
      .then((resp) => {
        console.log('RESPONSE ---> ', resp.body)
      })
  })
})
