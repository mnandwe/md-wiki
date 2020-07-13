# REST API mdwiki application

This application provides a REST API to create a wiki that doesn't persist data.


The application split into
* `router/router.go`  - defining api routes and linking to handlers
* `middleware/middlerware.go` - defining handlers for each request
* `models/models.go` - defining data structure for articles

`main.go` brings it all together and starts the `HttpServer` 

`main_test.go` runs tests

It uses `run-curl-tests.rb` which runs each command defined in
`commands.yml`.

## Install & Build

    go get ./...
    go build

## Run the app

    server

## Run the tests

    go test

# REST API

The REST API to the wiki app is described below.

## Get list of Articles

### Request

`GET /articles/`

    curl http://localhost:9090/articles/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    []

## Create a new Article

### Request

`PUT /articles/:name`

    curl -X PUT http://localhost:9090/articles/wiki -d 'A wiki is a knowledge base website'

### Response

    If a new article was created:
    HTTP/1.1 201 Created

    No payload

    If an existing article was updated:
    HTTP/1.1 200

## Get a specific Article

### Request

`GET /articles/:name`

    curl 'http://localhost:9090/articles/rest api'

### Response

    If the article is not found:
    HTTP/1.1 404 Not Found
    No payload
    If the article is found:
    HTTP/1.1 200 OK
    Content-Type: text/html
    The payload is the latest content stored
    under this name

