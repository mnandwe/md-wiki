FROM golang:1.12.7-alpine3.10 AS go-build
# Support CGO and SSL
RUN apk --no-cache add gcc g++ make
RUN apk add git
WORKDIR /go/src/app
COPY ./server .
RUN go get github.com/gorilla/mux
RUN GOOS=linux go build -ldflags="-s -w" -o ./bin/server ./main.go

# stage: 1
FROM node:10-alpine as react-build
WORKDIR /app
COPY ./client ./
RUN yarn
RUN yarn build

# stage: 2 — the production environment
FROM nginx:alpine
RUN apk add supervisor
RUN mkdir -p /var/log/supervisord
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=go-build /go/src/app/bin /go/bin
COPY --from=react-build /app/build /usr/share/nginx/html
COPY nginx/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE 8080
CMD ["/usr/bin/supervisord","-c","/etc/supervisor/conf.d/supervisord.conf"]


