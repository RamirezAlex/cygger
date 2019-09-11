# cygger

cygger is CLI tool that generates boilerplate for API testing with [cypress.io](https://www.cypress.io/) out of a [swagger.io](https://swagger.io/) file.

## Install

```
$ npm install cygger -g
```
or
```
$ yarn global add cygger
```



## Usage

```
$ npx cygger [options] <swagger-file>
```

This is a **Work in Progress** tool, some issues are expected.

```
$ cygger -h

Usage: cygger [options] <SwaggerFile>

Options:
  -v, --version                  Output the current version
  -U --baseURL <baseURL>         Host of the Swagger server
  -o --output-dir <outputDir>    Output directory to save the Cypress spec file
  -s --silent                    Silent mode: it does not show the genereted test in the console
  -t --token-param <tokenParam>  Param that will represent the access token - WIP
  -l --login-path <loginPath>    Authorization path endpoint  - WIP
  -u --user <user>               Username to login  - WIP
  -p --pass <pass>               Password to login - WIP
  -h, --help                     output usage information
```

```
$ cygger examples/todo.yml -o cypress/integration --baseURL http://localhost:3000

// Reads the Swagger file todo.yml and create todo.spec.js Cypress test in cypress/integration directory
```

## To Do

- [x] Support for Swagger 2.0
- [x] Support for OpenAPI 3.0
- [x] Support JSON/YAML swagger files(.json/.yaml/.yml).
- [ ] Support for authentication
- [ ] Support for setup and teardown
- [ ] Support for multiple Swagger files
- [ ] Onile tool

## License
### The MIT License

Copyright (c) 2019 Alex Ramirez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
