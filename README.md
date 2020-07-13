# Md Wiki Application

Md Wiki is a simple web app to create and view content for a wiki


The application split into
* `client`  - React  client side for rendering reponses from api
* `server` - Golang REST API to create, read and update articles

Built with docker


## Run Web App
### Build Docker Image

    `docker build . -t md-wiki:2019`



### Run Docker Build

    `docker run -ti -p 8080:8080 react-docker`
