FROM node:14-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache python3 py3-pip
COPY package*.json ./
RUN npm install
COPY . .
RUN cd napi_blog && npm run build
RUN npm run build
EXPOSE 8000
CMD ["npm","run","start"]
