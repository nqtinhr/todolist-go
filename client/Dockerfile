# Stage 1
FROM node:alpine3.18 as build-stage

RUN addgroup tester && adduser -S -G tester tester

USER tester

WORKDIR /frontend

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Stage 2
FROM nginx:1.23

COPY --from=build-stage /frontend/dist /usr/share/nginx/html

CMD nginx -g 'daemon off;'